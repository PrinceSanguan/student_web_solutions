import 'server-only';

import type { AdminCapstoneRow, Capstone, CapstoneStats, PublicCapstone } from '@/lib/types';
import { readJson, updateJson } from './json-file';

/**
 * Capstone records — the old `capstones` table.
 *
 * Ordering matches `orderByDesc('created_at')` from both Laravel controllers.
 * Ties break on descending id so a batch of records created in the same second
 * still comes back in a stable order (JSON timestamps have second-ish precision
 * in practice, and a stable sort matters for the admin table).
 */

const FILE = 'capstones.json';

async function all(): Promise<Capstone[]> {
    return readJson<Capstone[]>(FILE, []);
}

function newestFirst(rows: Capstone[]): Capstone[] {
    return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);
}

/** Only what the public catalog may see — no price, no download fields. */
function toPublic(c: Capstone): PublicCapstone {
    return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        description: c.description,
        demo_url: c.demo_url,
        thumbnail: c.thumbnail,
        category: c.category,
        technologies: c.technologies,
    };
}

function toAdminRow(c: Capstone): AdminCapstoneRow {
    return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        price: c.price,
        category: c.category,
        is_available: c.is_available,
        thumbnail: c.thumbnail,
    };
}

/* ── Reads ──────────────────────────────────────────────────────────────── */

export async function listAvailable(): Promise<PublicCapstone[]> {
    const rows = await all();
    return newestFirst(rows.filter((c) => c.is_available)).map(toPublic);
}

export async function listForAdmin(): Promise<AdminCapstoneRow[]> {
    return newestFirst(await all()).map(toAdminRow);
}

/**
 * Public detail page. Mirrors Laravel's `where('slug', …)->firstOrFail()`, which
 * did NOT filter on `is_available` — an unlisted project stays reachable by its
 * direct URL, it just drops out of the catalog listing.
 */
export async function findPublicBySlug(slug: string): Promise<PublicCapstone | null> {
    const rows = await all();
    const match = rows.find((c) => c.slug === slug);
    return match ? toPublic(match) : null;
}

/** Full record, for the admin edit form only. */
export async function findById(id: number): Promise<Capstone | null> {
    const rows = await all();
    return rows.find((c) => c.id === id) ?? null;
}

export async function slugTaken(slug: string, exceptId?: number): Promise<boolean> {
    const rows = await all();
    return rows.some((c) => c.slug === slug && c.id !== exceptId);
}

export async function stats(): Promise<CapstoneStats> {
    const rows = await all();
    const available = rows.filter((c) => c.is_available).length;
    return { total: rows.length, available, unlisted: rows.length - available };
}

/* ── Writes ─────────────────────────────────────────────────────────────── */

type NewCapstone = Omit<Capstone, 'id' | 'created_at' | 'updated_at'>;

export async function create(input: NewCapstone): Promise<Capstone> {
    return updateJson<Capstone[], Capstone>(FILE, [], (rows) => {
        const now = new Date().toISOString();
        const record: Capstone = {
            ...input,
            id: rows.reduce((max, c) => Math.max(max, c.id), 0) + 1,
            created_at: now,
            updated_at: now,
        };
        return [[...rows, record], record];
    });
}

export async function update(id: number, patch: Partial<NewCapstone>): Promise<Capstone | null> {
    return updateJson<Capstone[], Capstone | null>(FILE, [], (rows) => {
        const index = rows.findIndex((c) => c.id === id);
        if (index === -1) return [rows, null];

        const record: Capstone = { ...rows[index], ...patch, updated_at: new Date().toISOString() };
        const next = [...rows];
        next[index] = record;
        return [next, record];
    });
}

/** Returns the removed record so the caller can clean up its uploaded file. */
export async function remove(id: number): Promise<Capstone | null> {
    return updateJson<Capstone[], Capstone | null>(FILE, [], (rows) => {
        const match = rows.find((c) => c.id === id);
        if (!match) return [rows, null];
        return [rows.filter((c) => c.id !== id), match];
    });
}
