import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import GitHub from '@/components/landing/github';
import { Head } from '@inertiajs/react';

// Import components from their new locations
import TerminalSection from '@/components/landing/terminal-section';
import HeroLanding from '@/components/landing/sections/HeroLanding';
import ProjectShowcase from '@/components/landing/sections/ProjectShowcase';

const Welcome = () => {
    return (
        <>
            <Head title="Student Web Solutions | Capstone Projects & Ready-Made Systems">
                <meta name="description" content="Browse ready-made capstone projects and web systems. Contact us for custom builds." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

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
};

export default Welcome;
