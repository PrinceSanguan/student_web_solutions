import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import GitHub from '@/components/landing/github';
import HeroLanding from '@/components/landing/sections/HeroLanding';
import ProjectShowcase from '@/components/landing/sections/ProjectShowcase';
import TerminalSection from '@/components/landing/terminal-section';

import type { Metadata } from 'next';

/** Was `<Head title=… >` inside `pages/Welcome.tsx`. */
export const metadata: Metadata = {
    title: 'Capstone Projects & Ready-Made Systems',
    description: 'Browse ready-made capstone projects and web systems. Contact us for custom builds.',
    alternates: { canonical: '/' },
};

export default function HomePage() {
    return (
        <>
            <div>
                {/* Hero Landing Section - Full Width */}
                <HeroLanding />

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

                {/* Footer */}
                <Footer />
            </div>

            {/* Chat Bot */}
            <ChatBot darkMode={false} />
        </>
    );
}
