import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/json-ld';
import { ServicesHub } from '@/components/services/services-hub';
import { breadcrumbJsonLd, itemListJsonLd } from '@/lib/seo';
import { listServices } from '@/lib/services';

export const metadata: Metadata = {
    title: 'Services — Web Development, AI Automation & Ads Management',
    description:
        'Web development, capstone projects, leads AI automation, Facebook Ads and Google Ads management for Philippine businesses. Built by a developer with live clients in the Philippines and the UK.',
    alternates: { canonical: '/services' },
};

export default function ServicesPage() {
    const services = listServices();

    return (
        <>
            <ServicesHub services={services} />
            <JsonLd data={breadcrumbJsonLd([{ name: 'Services', path: '/services' }])} />
            <JsonLd
                data={itemListJsonLd(
                    'Services',
                    services.map((s) => ({ name: s.name, path: `/services/${s.slug}` })),
                )}
            />
        </>
    );
}
