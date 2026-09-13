import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Deterministic stand-in for `Math.random()`, for decorative values that are
 * computed while rendering — animation delays, particle directions, and so on.
 *
 * `Math.random()` in a render body is wrong twice over. The server and the client
 * roll different numbers, so the markup does not match and React reports a
 * hydration mismatch; and React may re-render at any time, so a "fixed" delay
 * silently changes mid-animation. Seeding on a stable value (usually the element's
 * index) removes both problems and still looks random to the eye.
 *
 * This is a 32-bit integer hash (Thomas Wang's mix) scaled into [0, 1).
 */
export function seededRandom(seed: number): number {
    let x = seed | 0;
    x = x ^ 61 ^ (x >>> 16);
    x = x + (x << 3);
    x = x ^ (x >>> 4);
    x = Math.imul(x, 0x27d4eb2d);
    x = x ^ (x >>> 15);
    return ((x >>> 0) % 100000) / 100000;
}

/** Turns a stable string — a `useId()` value, say — into a `seededRandom` seed. */
export function seedFromString(value: string): number {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (Math.imul(hash, 31) + value.charCodeAt(i)) | 0;
    }
    return hash;
}
