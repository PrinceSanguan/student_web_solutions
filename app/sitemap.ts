import type { MetadataRoute } from 'next';

import { listAvailable } from '@/lib/capstones';
import { SITE_URL } from '@/lib/site';

/**
 * Replaces `SitemapController` + `resources/views/sitemap.blade.php`.
 *
 * The Blade version hardcoded twelve `/project/{id}` URLs. That route rendered a
 * page component that did not exist, so every one of those twelve entries served
 * a 500 to crawlers. This lists the pages that are actually there, and one entry
 * per listed capstone.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const capstones = listAvailable();

    return [
        { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${SITE_URL}/capstone`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        ...capstones.map((c) => ({
            url: `${SITE_URL}/capstone/${c.slug}`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ];
}
