import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { JsonLd } from '@/components/seo/json-ld';
import { ServiceDetail } from '@/components/services/service-detail';
import { listAvailable } from '@/lib/capstones';
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from '@/lib/seo';
import { findServiceBySlug, listServiceSlugs } from '@/lib/services';

interface Props {
    params: Promise<{ slug: string }>;
}

/** Four pages, known at build time — all static, none rendered on demand. */
export function generateStaticParams() {
    return listServiceSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const service = findServiceBySlug((await params).slug);
    if (!service) return { title: 'Service Not Found' };

    return {
        title: service.metaTitle,
        description: service.metaDescription,
        alternates: { canonical: `/services/${service.slug}` },
        openGraph: {
            title: service.metaTitle,
            description: service.metaDescription,
            url: `/services/${service.slug}`,
        },
    };
}

export default async function ServicePage({ params }: Props) {
    const service = findServiceBySlug((await params).slug);
    if (!service) notFound();

    // Proof for this service, in the order the copy lists it.
    const catalog = listAvailable();
    const related = service.relatedSlugs.flatMap((slug) => catalog.filter((c) => c.slug === slug));

    return (
        <>
            <ServiceDetail service={service} related={related} />
            <JsonLd data={serviceJsonLd(service)} />
            <JsonLd data={faqJsonLd(service.faqs)} />
            <JsonLd
                data={breadcrumbJsonLd([
                    { name: 'Services', path: '/services' },
                    { name: service.shortName, path: `/services/${service.slug}` },
                ])}
            />
        </>
    );
}
