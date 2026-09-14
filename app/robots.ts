import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

/**
 * Replaces the inline `/robots.txt` closure in `routes/web.php`.
 *
 * Nothing is disallowed any more: the admin panel and the login page were removed,
 * and every remaining route is meant to be indexed.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
