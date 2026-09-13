import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { routes } from '@/lib/routes';
import { getAdmin } from '@/lib/store/admin';
import type { AdminUser } from '@/lib/types';
import { SESSION_COOKIE, sessionSecret, verifySessionToken } from './session';

/**
 * The authorization boundary.
 *
 * `proxy.ts` also gates `/admin/**`, but that is only a fast redirect for humans
 * clicking links — a Server Action is reachable by a direct POST that never passes
 * through a page. So every action calls this too. Laravel got this for free from
 * route middleware; here it is explicit.
 */

/** `null` when there is no valid session — for pages that render either way. */
export async function currentAdmin(): Promise<AdminUser | null> {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!(await verifySessionToken(token, sessionSecret()))) return null;

    // A valid signature still needs a live account behind it: if `data/admin.json`
    // was deleted or replaced, an old cookie must stop working.
    return getAdmin();
}

/** Redirects to the login page instead of returning. */
export async function requireAdmin(): Promise<AdminUser> {
    const admin = await currentAdmin();
    if (!admin) redirect(routes.auth.login);
    return admin;
}
