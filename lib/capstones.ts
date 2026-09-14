import type { Capstone, PublicCapstone } from '@/lib/types';

import raw from '@/content/capstones.json';

/**
 * The capstone catalog.
 *
 * This replaces the old `lib/store/` — a JSON file read through `node:fs` with an
 * atomic-write lock, which existed because the admin CMS could edit it at runtime.
 * With the admin side gone the catalog is plain content, so it is imported
 * directly: no filesystem access, no `server-only` boundary, and both public pages
 * can be fully prerendered.
 *
 * Concretely that also means the site now runs anywhere, Vercel included. The
 * previous design needed a writable disk.
 *
 * To change the catalog, edit `content/capstones.json` and redeploy.
 */

const capstones = raw as Capstone[];

/** Newest first, matching the order the Laravel catalog used. */
function newestFirst(rows: Capstone[]): Capstone[] {
    return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at) || b.id - a.id);
}

/**
 * Strips the fields the public pages must never see. `price` is kept in the JSON
 * as an internal reference; it has never been rendered anywhere public.
 */
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

/** Everything flagged `is_available`, for the catalog grid and the sitemap. */
export function listAvailable(): PublicCapstone[] {
    return newestFirst(capstones.filter((c) => c.is_available)).map(toPublic);
}

/**
 * One project by slug, or `null`.
 *
 * Deliberately does not filter on `is_available` — an unlisted project stays
 * reachable by its direct URL and only drops out of the grid. That is how the
 * Laravel `firstOrFail()` query behaved.
 */
export function findPublicBySlug(slug: string): PublicCapstone | null {
    const match = capstones.find((c) => c.slug === slug);
    return match ? toPublic(match) : null;
}

/** Every listed slug — lets the detail pages prerender at build time. */
export function listSlugs(): string[] {
    return capstones.filter((c) => c.is_available).map((c) => c.slug);
}
