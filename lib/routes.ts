/**
 * Every internal path in one place.
 *
 * Originally replaced Ziggy's `route()` from the Laravel app. Now that the admin
 * and auth routes are gone, all that remains is the public catalog — but keeping
 * the map means renaming a folder still points TypeScript at every link to move.
 */
export const routes = {
    home: '/',
    capstone: {
        index: '/capstone',
        show: (slug: string) => `/capstone/${slug}`,
    },
} as const;
