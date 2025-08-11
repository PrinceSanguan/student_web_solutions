import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import GitHub from '@/components/landing/github';
import { Head } from '@inertiajs/react';

// Import components from their new locations
import HeroLanding from '@/components/landing/sections/HeroLanding';
import LiveProject from '@/components/landing/sections/LiveProject';
import ProjectShowcase from '@/components/landing/sections/ProjectShowcase';

const Welcome = () => {
    return (
        <>
            <Head title="Student Web Solutions | Professional Web Development">
                <meta name="description" content="Professional web development solutions by Student Web Solutions." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div>
                {/* Hero Landing Section - Full Width */}
                <HeroLanding />

                {/* Main Content */}
                <main className="mx-auto mt-16 max-w-7xl px-3 sm:mt-20 sm:px-4 md:mt-24 md:px-6 lg:px-8">
                    {/* Project Showcase */}
                    <section>
                        <ProjectShowcase />
                    </section>

                    {/* Live Projects section */}
                    <section id="live-projects">
                        <LiveProject />
                    </section>

                    {/* GitHub section */}
                    <section>
                        <GitHub />
                    </section>
                </main>

                {/* Enhanced Footer */}
                <Footer />
            </div>

            {/* Chat Bot */}
            <ChatBot />
        </>
    );
};

export default Welcome;
