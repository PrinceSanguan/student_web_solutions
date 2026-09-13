'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { verifyPassword } from '@/lib/auth/password';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions, sessionSecret } from '@/lib/auth/session';
import type { LoginState } from '@/lib/forms';
import { clientIp, hit } from '@/lib/rate-limit';
import { routes } from '@/lib/routes';
import { getStoredAdmin } from '@/lib/store/admin';

/**
 * Replaces `LoginController::store`.
 *
 * Laravel's `LoginRequest` throttled at 5 attempts per key; the same limit lives
 * here, keyed on IP. Note what is deliberately preserved: a wrong email and a
 * wrong password give the identical message, so the form cannot be used to
 * enumerate accounts.
 */
export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const values = { email };

    const errors: LoginState['errors'] = {};
    if (!email) errors.email = 'The email field is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'The email must be a valid email address.';
    if (!password) errors.password = 'The password field is required.';
    if (Object.keys(errors).length) return { errors, values };

    const ip = clientIp(await headers());
    const limit = hit(`login:${ip}`, 5, 60);
    if (!limit.ok) {
        return { errors: { auth: `Too many login attempts. Please try again in ${limit.retryAfter} seconds.` }, values };
    }

    const secret = sessionSecret();
    if (!secret) {
        // A misconfigured server must not look like a wrong password.
        return { errors: { auth: 'Login is not configured: ADMIN_SESSION_SECRET is missing.' }, values };
    }

    const admin = await getStoredAdmin();
    if (!admin) {
        return { errors: { auth: 'No admin account exists yet. Run: npm run set-admin-password' }, values };
    }

    const emailMatches = admin.email.toLowerCase() === email.toLowerCase();
    const passwordMatches = await verifyPassword(password, admin.passwordHash);
    if (!emailMatches || !passwordMatches) {
        return { errors: { auth: 'The provided credentials do not match our records.' }, values };
    }

    (await cookies()).set(SESSION_COOKIE, await createSessionToken(secret), sessionCookieOptions());

    redirect(routes.admin.dashboard);
}
