/**
 * Site-wide constants that used to live in `app.blade.php` and `config/app.php`.
 */

/** Canonical origin. `metadataBase`, the sitemap and robots.txt all read this. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

export const SITE_NAME = 'Student Web Solutions';

export const FACEBOOK_URL = 'https://www.facebook.com/Grandmaster1997/';
export const GITHUB_URL = 'https://github.com/PrinceSanguan';

export const LOGO_PATH = '/assets/images/logo.png';

/**
 * LocalBusiness structured data, ported verbatim from the Blade template's
 * JSON-LD block. Google reads this for the rich result, so the prices and service
 * names have to stay in step with what the chatbot quotes.
 */
export function localBusinessJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: SITE_NAME,
        alternateName: 'SWS - Capstone System Maker Philippines',
        description:
            'Professional capstone system maker in the Philippines. We build thesis systems, library systems, POS, school management systems, and custom web applications in 1-2 days starting at ₱10,000.',
        url: SITE_URL,
        logo: `${SITE_URL}${LOGO_PATH}`,
        image: `${SITE_URL}${LOGO_PATH}`,
        telephone: '',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'PH',
            addressRegion: 'Philippines',
        },
        geo: {
            '@type': 'GeoCoordinates',
            addressCountry: 'PH',
        },
        areaServed: {
            '@type': 'Country',
            name: 'Philippines',
        },
        priceRange: '₱10,000 - ₱50,000',
        currenciesAccepted: 'PHP',
        openingHours: 'Mo-Su 00:00-24:00',
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Web Development Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Capstone System Development',
                        description: 'Complete capstone and thesis system development for Filipino students',
                    },
                    price: '10000',
                    priceCurrency: 'PHP',
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Library System',
                        description: 'Library management system with borrowing, return, and inventory',
                    },
                    price: '15000',
                    priceCurrency: 'PHP',
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'School Information System',
                        description: 'Complete school or student information management system',
                    },
                    price: '18000',
                    priceCurrency: 'PHP',
                },
            ],
        },
        sameAs: [FACEBOOK_URL, GITHUB_URL],
        founder: {
            '@type': 'Person',
            name: 'Prince E. Sanguan',
            jobTitle: 'Lead Web Developer',
            sameAs: 'https://psanguan.com',
        },
    };
}
