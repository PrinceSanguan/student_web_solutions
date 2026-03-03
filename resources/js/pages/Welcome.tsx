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

                {/* Facebook CTA */}
                <div className="bg-blue-600 py-6 text-center text-white">
                    <p className="text-lg font-semibold">Want a custom website built for you?</p>
                    <p className="mt-1 text-sm text-blue-100">Send me a message and let's bring your idea to life!</p>

                    <a
                        href="https://www.facebook.com/people/StudentwebSolution/61560390520092/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                        Message me on Facebook
                    </a>
                </div>

            {/* Enhanced Footer */}
            <Footer />
            </div>

            {/* Chat Bot */}
            <ChatBot darkMode={false} />
        </>
    );
};

export default Welcome;
