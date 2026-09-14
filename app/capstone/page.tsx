import type { Metadata } from 'next';

import { CapstoneCatalog } from '@/components/capstone/catalog';
import { listAvailable } from '@/lib/capstones';

/** Was the `<Head>` block in `pages/Capstone/Index.tsx`. */
export const metadata: Metadata = {
    title: 'Capstone Projects',
    description:
        'Browse ready-made capstone projects and web systems for Filipino students. Contact the developer to discuss pricing, customizations, and delivery.',
    alternates: { canonical: '/capstone' },
};

/** Ported from `CapstoneController::index`. */
export default function CapstoneIndexPage() {
    return <CapstoneCatalog capstones={listAvailable()} />;
}
