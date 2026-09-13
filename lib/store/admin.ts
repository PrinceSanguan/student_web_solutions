import 'server-only';

import type { AdminUser, StoredAdmin } from '@/lib/types';
import { readJson, writeJson } from './json-file';

/**
 * The single admin account, where Laravel had a `users` row.
 *
 * There is no "create account" path on purpose — registration was disabled in
 * the Laravel routes and only admins could log in. The account is provisioned
 * out of band by `npm run set-admin-password`.
 */

const FILE = 'admin.json';

/** `null` when the account has not been provisioned yet. */
export async function getStoredAdmin(): Promise<StoredAdmin | null> {
    const stored = await readJson<StoredAdmin | null>(FILE, null);
    if (!stored?.email || !stored?.passwordHash) return null;
    return stored;
}

/** The safe projection — what a page or a client component may see. */
export async function getAdmin(): Promise<AdminUser | null> {
    const stored = await getStoredAdmin();
    return stored ? { name: stored.name, email: stored.email } : null;
}

export async function updateAdminProfile(name: string): Promise<void> {
    const stored = await getStoredAdmin();
    if (!stored) throw new Error('No admin account provisioned.');
    await writeJson<StoredAdmin>(FILE, { ...stored, name });
}

export async function updateAdminPassword(passwordHash: string): Promise<void> {
    const stored = await getStoredAdmin();
    if (!stored) throw new Error('No admin account provisioned.');
    await writeJson<StoredAdmin>(FILE, { ...stored, passwordHash });
}
