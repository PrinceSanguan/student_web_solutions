/**
 * Shapes that cross the server/client boundary.
 *
 * `Capstone` mirrors the old Laravel `capstones` table one column at a time, which
 * is why `content/capstones.json` can hold rows exported straight from it.
 * Timestamps are ISO strings because JSON has no date type.
 */
/**
 * What a project IS, which is not the same thing as what domain it serves.
 *
 * `capstone` — a ready-made system sold to students.
 * `client`   — a real system built for a paying client and running in production.
 *
 * The two are presented differently: a capstone advertises source code and a
 * submission-ready package, a client project advertises that it is live. Absent
 * in the JSON means `capstone`, so existing records need no edit.
 */
export type CapstoneKind = 'capstone' | 'client';

export interface Capstone {
    id: number;
    title: string;
    slug: string;
    description: string;
    kind?: CapstoneKind;
    /** Internal reference only — never rendered on a public page. */
    price: number;
    category: string | null;
    technologies: string[] | null;
    demo_url: string | null;
    /** Internal delivery field — never rendered on a public page. */
    download_url: string | null;
    /** Internal delivery field — never rendered on a public page. */
    download_file: string | null;
    thumbnail: string | null;
    /** `false` hides it from the grid and the sitemap; the direct URL still works. */
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * What the public catalog is allowed to see. Deliberately omits `price`,
 * `download_url` and `download_file` — the same cut `CapstoneController::publicFields`
 * made in the Laravel app.
 */
export type PublicCapstone = Pick<Capstone, 'id' | 'title' | 'slug' | 'description' | 'demo_url' | 'thumbnail' | 'category' | 'technologies'> & {
    /** Always resolved — `toPublic()` fills in the default. */
    kind: CapstoneKind;
};
