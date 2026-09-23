import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Inter, Syne } from 'next/font/google';

import { LOGO_PATH, SITE_NAME, SITE_URL, localBusinessJsonLd } from '@/lib/site';

import './globals.css';

/**
 * Fonts the Laravel pages pulled in with `<link>` tags inside Inertia's `<Head>`.
 * next/font self-hosts them, so there is no render-blocking request to Google and
 * no layout shift. Each is exposed as a CSS variable and wired into `@theme` in
 * globals.css.
 */
const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-inter',
    display: 'swap',
});

const syne = Syne({
    subsets: ['latin'],
    weight: ['600', '700', '800'],
    variable: '--font-syne-google',
    display: 'swap',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600'],
    variable: '--font-dm-sans-google',
    display: 'swap',
});

/**
 * Every meta tag from `resources/views/app.blade.php`.
 *
 * `title.template` replaces Inertia's `title: (title) => \`${title} - ${appName}\``,
 * and `title.default` is the long-tail keyword title the landing page used.
 */
export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: 'Capstone Projects, Web Systems & AI Automation Philippines | Student Web Solutions',
        template: `%s | ${SITE_NAME}`,
    },
    description:
        'Capstone projects, custom web systems, leads AI automation, and Facebook & Google Ads management in the Philippines. Ready-made thesis and business systems from ₱10,000, plus live client builds in the Philippines and the UK.',
    // No `keywords` meta: Google has ignored it since 2009. What ranks is the
    // copy on the page, which is what /services now exists to provide.
    authors: [{ name: 'Prince Sanguan - Student Web Solutions' }],
    applicationName: SITE_NAME,
    referrer: 'strict-origin-when-cross-origin',
    alternates: { canonical: '/' },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_PH',
        siteName: SITE_NAME,
        url: '/',
        title: 'Student Web Solutions | Capstone System Maker Philippines | Paggawa ng Capstone',
        description:
            'Need a capstone system? We build complete thesis & capstone projects in 1-2 days starting at ₱10,000. Library systems, POS, school systems. Trusted by 100+ Filipino students. Message us now!',
        images: [
            {
                url: LOGO_PATH,
                width: 1200,
                height: 630,
                alt: 'Student Web Solutions - Capstone System Maker Philippines',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        site: '@studentwebsolutions',
        title: 'Student Web Solutions | Capstone System Maker Philippines',
        description: 'We build capstone & thesis systems in 1-2 days. Starting ₱10,000. Library, POS, School systems. Message us!',
        images: [LOGO_PATH],
    },
    icons: {
        icon: LOGO_PATH,
        shortcut: LOGO_PATH,
        apple: LOGO_PATH,
    },
    // Tags the Metadata API has no first-class field for. Same values as the Blade
    // template — regional signals for a business that only serves the Philippines.
    other: {
        'geo.region': 'PH',
        'geo.country': 'Philippines',
        language: 'English, Filipino',
        'revisit-after': '7 days',
        rating: 'general',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    colorScheme: 'light',
    themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable} ${syne.variable} ${dmSans.variable}`}>
            <body className="antialiased">
                {children}
                <script
                    type="application/ld+json"
                    // The payload is built from module constants, never from user input.
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd()) }}
                />
                {/* Vercel Web Analytics (visitor and page-view counts) and Speed
                    Insights (real-user Core Web Vitals).

                    Both inject their scripts only on a Vercel deployment; locally they
                    are no-ops that log to the console, so `npm run dev` stays quiet and
                    no requests leave the machine. */}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
