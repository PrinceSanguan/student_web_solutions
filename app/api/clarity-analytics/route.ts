import type { NextRequest } from 'next/server';

import { clientIp, hit } from '@/lib/rate-limit';

/**
 * Replaces `HomeController::getAnalytics`.
 *
 * A thin proxy to Microsoft Clarity's live-insights export, so the API token never
 * reaches the browser. Nothing in the ported UI calls this yet — the Laravel
 * component that did (`landing/analytics.tsx`) was dead code and was not ported —
 * but the endpoint itself was live, so it is preserved.
 */

const CLARITY_ENDPOINT = 'https://www.clarity.ms/export-data/api/v1/project-live-insights';

interface ClarityDimensionStats {
    sessions?: number;
    pageViews?: number;
    users?: number;
}

interface ClarityResponse {
    totalSessions?: number;
    totalPageViews?: number;
    uniqueUsers?: number;
    avgSessionDuration?: number;
    bounceRate?: number;
    dimensions?: Record<string, Record<string, ClarityDimensionStats>>;
    dailyBreakdown?: Record<string, ClarityDimensionStats>;
}

/** Reshapes Clarity's payload into what the frontend expected. Ported as-is. */
function formatClarityData(raw: ClarityResponse) {
    const deviceData = Object.entries(raw.dimensions?.Device ?? {}).map(([dimension, stats]) => ({
        dimension,
        sessions: stats.sessions ?? 0,
        pageViews: stats.pageViews ?? 0,
    }));

    const dailyData = Object.entries(raw.dailyBreakdown ?? {}).map(([date, stats]) => ({
        date,
        sessions: stats.sessions ?? 0,
        pageViews: stats.pageViews ?? 0,
        users: stats.users ?? 0,
    }));

    const topPages = Object.entries(raw.dimensions?.Page ?? {})
        .map(([page, stats]) => ({ page, views: stats.pageViews ?? 0 }))
        // The PHP version called arsort() on the raw map before slicing, which sorted
        // by the array values rather than by pageViews. Sorting on views is what that
        // code was reaching for.
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

    return {
        totalSessions: raw.totalSessions ?? 0,
        totalPageViews: raw.totalPageViews ?? 0,
        uniqueUsers: raw.uniqueUsers ?? 0,
        bounceRate: raw.bounceRate ?? 0,
        avgSessionDuration: raw.avgSessionDuration ?? 0,
        deviceData,
        dailyData,
        topPages,
    };
}

export async function GET(request: NextRequest) {
    // Not throttled in Laravel beyond the blanket `throttle:10,1`; this endpoint
    // spends someone else's API quota, so a modest cap is worth keeping.
    const ip = clientIp(request.headers);
    const limit = hit(`clarity:${ip}`, 10, 60);
    if (!limit.ok) {
        return Response.json(
            { success: false, message: 'Too many requests.' },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
        );
    }

    const token = process.env.CLARITY_API_TOKEN;
    if (!token) {
        return Response.json({ success: false, message: 'Clarity API token not configured' }, { status: 500 });
    }

    try {
        const url = new URL(CLARITY_ENDPOINT);
        url.searchParams.set('numOfDays', '3');
        url.searchParams.set('dimension1', 'Device');
        url.searchParams.set('dimension2', 'Page');

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            // Clarity's live insights change constantly; a cached answer would be wrong.
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error(`Clarity API Error: ${await response.text()}`);
            return Response.json({ success: false, message: 'Failed to fetch data from Clarity API' }, { status: response.status });
        }

        return Response.json({ success: true, data: formatClarityData(await response.json()) });
    } catch (error) {
        console.error('Clarity Analytics Error:', error);
        return Response.json({ success: false, message: 'Error fetching analytics data' }, { status: 500 });
    }
}
