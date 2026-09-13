/**
 * Shapes that cross the server/client boundary.
 *
 * `Capstone` mirrors the old `capstones` table one column at a time, so a row
 * exported from the Laravel database drops straight into `data/capstones.json`.
 * Timestamps are ISO strings because JSON has no date type.
 */
export interface Capstone {
    id: number;
    title: string;
    slug: string;
    description: string;
    /** Internal reference only — never sent to the public pages. */
    price: number;
    category: string | null;
    technologies: string[] | null;
    demo_url: string | null;
    /** Internal delivery field — never sent to the public pages. */
    download_url: string | null;
    /** Filename inside `data/uploads/capstone-downloads/`. Internal. */
    download_file: string | null;
    thumbnail: string | null;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * What the public catalog is allowed to see. Deliberately omits `price`,
 * `download_url` and `download_file` — the same cut `CapstoneController::publicFields`
 * made in the Laravel app.
 */
export type PublicCapstone = Pick<Capstone, 'id' | 'title' | 'slug' | 'description' | 'demo_url' | 'thumbnail' | 'category' | 'technologies'>;

/** The row the admin table renders. */
export type AdminCapstoneRow = Pick<Capstone, 'id' | 'title' | 'slug' | 'price' | 'category' | 'is_available' | 'thumbnail'>;

/** The single admin account, stored in `data/admin.json`. */
export interface AdminUser {
    name: string;
    email: string;
}

/** `AdminUser` plus the secret — never leaves the server. */
export interface StoredAdmin extends AdminUser {
    /** `scrypt$<salt-base64>$<hash-base64>` — see `lib/auth/password.ts`. */
    passwordHash: string;
}

export interface CapstoneStats {
    total: number;
    available: number;
    unlisted: number;
}
