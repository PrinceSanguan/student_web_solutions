/**
 * Provisions (or resets) the single admin account.
 *
 *   node scripts/set-admin-password.mjs <email> <password> [name]
 *
 * This replaces Laravel's `UserSeeder`. There is deliberately no default
 * credential baked into the repo — a known password in version control is a
 * credential, not a convenience.
 *
 * Writes `data/admin.json`, which is gitignored, so it is per-machine state.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { MIN_PASSWORD_LENGTH, hashPassword } from '../lib/auth/password.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'data', 'admin.json');

const [email, password, name] = process.argv.slice(2);

function fail(message) {
    console.error(`\n  ${message}\n`);
    console.error('  Usage: npm run set-admin-password -- <email> <password> [name]\n');
    process.exit(1);
}

if (!email || !password) fail('An email and a password are both required.');
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(`"${email}" does not look like an email address.`);
if (password.length < MIN_PASSWORD_LENGTH) fail(`The password must be at least ${MIN_PASSWORD_LENGTH} characters.`);

// Keep the existing display name when only the password is being rotated.
let existingName = 'Admin';
try {
    existingName = JSON.parse(await readFile(FILE, 'utf8')).name || existingName;
} catch {
    // First run — no file yet.
}

const record = {
    name: name || existingName,
    email,
    passwordHash: await hashPassword(password),
};

await mkdir(path.dirname(FILE), { recursive: true });
await writeFile(FILE, `${JSON.stringify(record, null, 2)}\n`, 'utf8');

console.log(`\n  Admin account saved to data/admin.json`);
console.log(`    name:  ${record.name}`);
console.log(`    email: ${record.email}\n`);
console.log(`  Sign in at /login.\n`);
