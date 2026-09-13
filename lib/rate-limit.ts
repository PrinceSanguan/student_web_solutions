/**
 * Fixed-window per-key rate limiter, held in memory.
 *
 * Stands in for Laravel's `RateLimiter` / `throttle:` middleware. It is
 * per-process: a single `next start` instance shares one map, but a horizontally
 * scaled deployment would need Redis. That matches how the Laravel app ran
 * (`CACHE_STORE=database` on one box) closely enough for a chatbot guard.
 */
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Stop the map from growing without bound on a long-lived server. */
function sweep(now: number) {
    if (windows.size < 512) return;
    for (const [key, window] of windows) {
        if (window.resetAt <= now) windows.delete(key);
    }
}

export interface RateLimitResult {
    ok: boolean;
    /** Seconds until the window resets. Feeds `Retry-After`. */
    retryAfter: number;
}

export function hit(key: string, limit: number, windowSeconds: number): RateLimitResult {
    const now = Date.now();
    sweep(now);

    const existing = windows.get(key);
    if (!existing || existing.resetAt <= now) {
        windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
        return { ok: true, retryAfter: 0 };
    }

    existing.count += 1;
    if (existing.count > limit) {
        return { ok: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
    }
    return { ok: true, retryAfter: 0 };
}

/**
 * Best-effort client IP. Behind a proxy `x-forwarded-for` is the real one; the
 * first entry is the client, the rest are hops.
 */
export function clientIp(headers: Headers): string {
    const forwarded = headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return headers.get('x-real-ip') ?? 'unknown';
}
