/**
 * Password hashing for the single admin account.
 *
 * Deliberately NOT marked `server-only`: `scripts/set-admin-password.mjs` imports
 * it too, and that runs as a plain Node script. The `node:crypto` import is
 * already enough to stop this from ever reaching a client bundle.
 *
 * scrypt, not bcrypt — it is built into Node, so there is no native dependency to
 * compile on Windows, and it is memory-hard, which is what makes a stolen hash
 * expensive to attack.
 */
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback) as (password: string, salt: Buffer, keylen: number) => Promise<Buffer>;

const KEY_LENGTH = 32;

/** Stored format: `scrypt$<salt-base64>$<hash-base64>`. */
export async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = await scrypt(password, salt, KEY_LENGTH);
    return `scrypt$${salt.toString('base64')}$${hash.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string | null | undefined): Promise<boolean> {
    if (!stored) return false;

    const [scheme, saltB64, hashB64] = stored.split('$');
    if (scheme !== 'scrypt' || !saltB64 || !hashB64) return false;

    try {
        const expected = Buffer.from(hashB64, 'base64');
        const actual = await scrypt(password, Buffer.from(saltB64, 'base64'), expected.length);
        return timingSafeEqual(actual, expected);
    } catch {
        return false;
    }
}

/**
 * Matches Laravel's `Password::defaults()` as it was configured here: a length
 * floor and nothing else, so an existing admin does not get locked out by a rule
 * the old app never enforced.
 */
export const MIN_PASSWORD_LENGTH = 8;

export function passwordError(password: string): string | null {
    if (password.length < MIN_PASSWORD_LENGTH) {
        return `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    return null;
}
