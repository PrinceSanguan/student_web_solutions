import type { Metadata } from 'next';

import { CapstoneCatalog } from '@/components/capstone/catalog';
import { listAvailable } from '@/lib/store/capstones';

/** Was the `<Head>` block in `pages/Capstone/Index.tsx`. */
export const metadata: Metadata = {
    title: 'Capstone Projects',
    description:
        'Browse ready-made capstone projects and web systems for Filipino students. Contact the developer to discuss pricing, customizations, and delivery.',
    alternates: { canonical: '/capstone' },
};

/**
 * Revalidate hourly on top of the explicit `revalidatePath` the admin actions
 * already fire. That covers the case the actions cannot see: `data/capstones.json`
 * edited directly, or a build whose `data/` differs from the server's.
 */
export const revalidate = 3600;

/** Ported from `CapstoneController::index`. */
export default async function CapstoneIndexPage() {
    const capstones = await listAvailable();
    return <CapstoneCatalog capstones={capstones} />;
}
