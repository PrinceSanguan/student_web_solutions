import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { SESSION_COOKIE, sessionSecret, verifySessionToken } from '@/lib/auth/session';

/**
 * Next.js 16 proxy (what used to be called middleware).
 *
 * Stands in for Laravel's `AdminMiddleware` and `GuestMiddleware`, and does the
 * same two jobs:
 *
 *   - no valid session on /admin/**  -> send to /login
 *   - valid session on /login        -> send to /admin/dashboard
 *
 * This is an OPTIMISTIC check only. It verifies the cookie signature; it does not
 * confirm the account still exists. `requireAdmin()` does that, and every Server
 * Action calls it — the proxy cannot be the authorization boundary because a POST
 * to an action never has to pass a page route.
 */
export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const signedIn = await verifySessionToken(token, sessionSecret());

    if (pathname.startsWith('/admin')) {
        if (!signedIn) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.search = '';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (pathname === '/login' && signedIn) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/dashboard';
        url.search = '';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    // Only the two route groups that need a decision. Everything else is public,
    // so there is no reason to pay for a proxy hop.
    matcher: ['/admin/:path*', '/login'],
};
