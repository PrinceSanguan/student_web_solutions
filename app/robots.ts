import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * Replaces the inline `/robots.txt` closure in `routes/web.php`.
 *
 * `/dashboard` and `/user/` are gone from the disallow list because those routes
 * no longer exist — the user-facing dashboard was unreachable in the Laravel app
 * (registration disabled, non-admins rejected at login) and was not ported.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/login'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
