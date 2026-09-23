import type { Metadata } from 'next';

import { CapstoneCatalog } from '@/components/capstone/catalog';
import { JsonLd } from '@/components/seo/json-ld';
import { listAvailable } from '@/lib/capstones';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';

/** Was the `<Head>` block in `pages/Capstone/Index.tsx`. */
export const metadata: Metadata = {
    title: 'Capstone Projects',
    description:
        'Browse ready-made capstone projects and web systems for Filipino students. Contact the developer to discuss pricing, customizations, and delivery.',
    alternates: { canonical: '/capstone' },
};

/** Ported from `CapstoneController::index`. */
export default function CapstoneIndexPage() {
    const capstones = listAvailable();

    return (
        <>
            <CapstoneCatalog capstones={capstones} />
            <JsonLd data={breadcrumbJsonLd([{ name: 'Projects', path: '/capstone' }])} />
            <JsonLd
                data={itemListJsonLd(
                    'Capstone Projects and Client Systems',
                    capstones.map((c) => ({ name: c.title, path: `/capstone/${c.slug}` })),
                )}
            />
        </>
    );
}
