/**
 * Every internal path in one place.
 *
 * This replaces Ziggy's `route('admin.capstones.edit', id)`. Ziggy could do this
 * because Laravel owned the route table; in Next.js the filesystem owns it, so a
 * small typed map is the honest equivalent — rename a folder and TypeScript
 * points at every link that has to move.
 */
export const routes = {
    home: '/',
    capstone: {
        index: '/capstone',
        show: (slug: string) => `/capstone/${slug}`,
    },
    auth: {
        login: '/login',
        logout: '/logout',
    },
    admin: {
        dashboard: '/admin/dashboard',
        settings: '/admin/settings',
        capstones: {
            index: '/admin/capstones',
            create: '/admin/capstones/new',
            edit: (id: number) => `/admin/capstones/${id}/edit`,
        },
    },
} as const;
