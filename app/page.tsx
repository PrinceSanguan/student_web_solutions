import type { Metadata } from 'next';

import { FaqSection, HOME_FAQS } from '@/components/landing/faq-section';
import Footer from '@/components/landing/footer';
import GitHub from '@/components/landing/github';
import HeroLanding from '@/components/landing/sections/HeroLanding';
import ProjectShowcase from '@/components/landing/sections/ProjectShowcase';
import { ServicesSection } from '@/components/landing/services-section';
import TerminalSection from '@/components/landing/terminal-section';
import { JsonLd } from '@/components/seo/json-ld';
import { faqJsonLd, itemListJsonLd } from '@/lib/seo';
import { listServices } from '@/lib/services';

/** Was `<Head title=… >` inside `pages/Welcome.tsx`. */
export const metadata: Metadata = {
    title: 'Capstone Projects, Web Systems & AI Automation Philippines',
    description:
        'Ready-made capstone projects and custom web systems from ₱10,000, plus leads AI automation and Facebook & Google Ads management. Live client builds in the Philippines and the UK.',
    alternates: { canonical: '/' },
};

export default function HomePage() {
    const services = listServices();

    return (
        <>
            <div>
                {/* Hero Landing Section - Full Width */}
                <HeroLanding />

                {/* What we do — the page's indexable copy and its links to /services */}
                <ServicesSection />

                {/* How It Works — Terminal */}
                <TerminalSection />

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                    {/* Capstone Projects & Systems */}
                    <section>
                        <ProjectShowcase />
                    </section>
                </main>

                {/* GitHub Section */}
                <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                    <section>
                        <GitHub />
                    </section>
                </div>

                {/* FAQ — also the source of the FAQPage schema below */}
                <FaqSection />

                {/* Footer */}
                <Footer />
            </div>

            <JsonLd data={faqJsonLd(HOME_FAQS)} />
            <JsonLd
                data={itemListJsonLd(
                    'Services',
                    services.map((s) => ({ name: s.name, path: `/services/${s.slug}` })),
                )}
            />
        </>
    );
}
