import { SERVICES } from '@/content/services';
import type { Service } from '@/lib/types';

/**
 * Read-only accessors over `content/services.ts`, mirroring `lib/capstones.ts`.
 *
 * Plain imports, no filesystem: every service page is prerendered at build time.
 */

export function listServices(): Service[] {
    return SERVICES;
}

export function findServiceBySlug(slug: string): Service | null {
    return SERVICES.find((s) => s.slug === slug) ?? null;
}

export function listServiceSlugs(): string[] {
    return SERVICES.map((s) => s.slug);
}
