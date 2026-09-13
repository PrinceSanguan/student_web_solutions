/**
 * Admin session cookie.
 *
 * Uses WEB CRYPTO (`crypto.subtle`), not `node:crypto`, because `proxy.ts` may run
 * on the Edge runtime where Node APIs do not exist. Web Crypto works in both.
 *
 * The cookie is not a secret — you can read its contents. What the signature
 * prevents is FORGERY: without `ADMIN_SESSION_SECRET` you cannot mint a cookie
 * that claims to be the admin. This is the same trade Laravel's signed session
 * cookie made.
 */

export const SESSION_COOKIE = 'sws_admin';

/** 12 hours — long enough for a work session, short enough not to sit open overnight. */
export const SESSION_TTL_SECONDS = 12 * 60 * 60;

const SUBJECT = 'admin';
const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
    let binary = '';
    for (const byte of new Uint8Array(bytes)) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Length-independent compare, so the response time does not leak the signature. */
function safeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

async function sign(payload: string, secret: string): Promise<string> {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(payload)));
}

export function sessionSecret(): string {
    return process.env.ADMIN_SESSION_SECRET ?? '';
}

export async function createSessionToken(secret: string): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
    const payload = `${SUBJECT}.${expires}`;
    return `${payload}.${await sign(payload, secret)}`;
}

/** `true` when the signature holds and the token has not expired. */
export async function verifySessionToken(token: string | undefined, secret: string): Promise<boolean> {
    if (!token || !secret) return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [subject, expiresRaw, signature] = parts;
    if (subject !== SUBJECT) return false;

    const expires = Number(expiresRaw);
    if (!Number.isFinite(expires) || expires * 1000 < Date.now()) return false;

    const expected = await sign(`${subject}.${expiresRaw}`, secret);
    return safeEqual(signature, expected);
}

/** Shared cookie attributes, so set and delete cannot drift apart. */
export function sessionCookieOptions() {
    return {
        httpOnly: true,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_TTL_SECONDS,
    };
}
