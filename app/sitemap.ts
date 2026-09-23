import type { MetadataRoute } from 'next';

import { listSitemapEntries } from '@/lib/capstones';
import { listServices } from '@/lib/services';
import { SITE_URL } from '@/lib/site';

/**
 * Replaces `SitemapController` + `resources/views/sitemap.blade.php`.
 *
 * `lastModified` comes from each record's own `updated_at`, not from the build
 * clock. Stamping every URL with the deploy time tells Google the whole site
 * changed on every deploy, which is false, and it learns to ignore the signal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const capstones = listSitemapEntries();
    const services = listServices();

    // The catalog as a whole is as fresh as its newest entry.
    const newestProject = capstones.reduce<string | null>((newest, c) => (!newest || c.updated_at > newest ? c.updated_at : newest), null);
    const catalogUpdated = newestProject ? new Date(newestProject) : new Date();

    return [
        { url: `${SITE_URL}/`, lastModified: catalogUpdated, changeFrequency: 'weekly', priority: 1.0 },

        { url: `${SITE_URL}/services`, lastModified: catalogUpdated, changeFrequency: 'monthly', priority: 0.9 },
        ...services.map((s) => ({
            url: `${SITE_URL}/services/${s.slug}`,
            lastModified: catalogUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),

        { url: `${SITE_URL}/capstone`, lastModified: catalogUpdated, changeFrequency: 'weekly', priority: 0.9 },
        ...capstones.map((c) => ({
            url: `${SITE_URL}/capstone/${c.slug}`,
            lastModified: new Date(c.updated_at),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
    ];
}
