import { SITE_NAME, SITE_URL } from '@/lib/site';
import type { PublicCapstone, Service } from '@/lib/types';

/**
 * JSON-LD builders.
 *
 * Schema is how a page tells Google what it *is* rather than leaving it to be
 * inferred from prose. The site previously emitted only `LocalBusiness` on every
 * page, so a service page and a project page looked identical to a crawler.
 *
 * `FAQPage` is the one with visible payoff — it is what produces the expandable
 * question list under a result. It only works if the questions and answers are
 * really on the page, which is why the same array renders the visible FAQ.
 */

const absolute = (path: string) => (path.startsWith('http') ? path : `${SITE_URL}${path}`);

/** Breadcrumbs. Pass the trail without the home crumb — it is added here. */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [{ name: 'Home', path: '/' }, ...trail].map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: absolute(crumb.path),
        })),
    };
}

export function serviceJsonLd(service: Service) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        serviceType: service.name,
        description: service.metaDescription,
        url: absolute(`/services/${service.slug}`),
        provider: {
            '@type': 'LocalBusiness',
            name: SITE_NAME,
            url: SITE_URL,
        },
        areaServed: [
            { '@type': 'Country', name: 'Philippines' },
            // SJA Martial Arts is a live client in Swansea — the reach is real.
            { '@type': 'Country', name: 'United Kingdom' },
        ],
        availableChannel: {
            '@type': 'ServiceChannel',
            serviceUrl: absolute(`/services/${service.slug}`),
            availableLanguage: [
                { '@type': 'Language', name: 'English' },
                { '@type': 'Language', name: 'Filipino' },
            ],
        },
    };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
    };
}

/** A collection page — `/capstone` and `/services` both are one. */
export function itemListJsonLd(name: string, items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name,
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            url: absolute(item.path),
        })),
    };
}

/**
 * A project detail page. `CreativeWork` rather than `Product` — these are not
 * listed with a price, and marking them as products without an `offers` block
 * earns a Search Console warning rather than a rich result.
 */
export function projectJsonLd(capstone: PublicCapstone) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: capstone.title,
        description: capstone.description.replace(/\s+/g, ' ').trim().slice(0, 300),
        url: absolute(`/capstone/${capstone.slug}`),
        ...(capstone.thumbnail ? { image: absolute(capstone.thumbnail) } : {}),
        ...(capstone.technologies?.length ? { keywords: capstone.technologies.join(', ') } : {}),
        creator: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
        inLanguage: 'en',
    };
}
