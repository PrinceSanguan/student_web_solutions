import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { SESSION_COOKIE } from '@/lib/auth/session';
import { routes } from '@/lib/routes';

/**
 * Replaces `LoginController::destroy`.
 *
 * Kept as a GET because that is what the Laravel route was, and the "Logout"
 * items in the sidebar and header are plain links. A GET that mutates state is
 * not ideal, but the only state it destroys is the caller's own cookie, and
 * changing it would mean rewriting those links into forms for no security gain.
 */
export async function GET(request: NextRequest) {
    (await cookies()).delete(SESSION_COOKIE);
    return NextResponse.redirect(new URL(routes.home, request.url));
}
