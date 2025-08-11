import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import GitHub from '@/components/landing/github';
import { ThemeProvider } from '@/components/landing/theme-provider';
import { Head } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useState } from 'react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import components from their new locations
import HeroLanding from '@/components/landing/sections/HeroLanding';
import LiveProject from '@/components/landing/sections/LiveProject';
import ProjectShowcase from '@/components/landing/sections/ProjectShowcase';
import TestimonialSlider from '@/components/landing/sections/TestimonialSlider';

const Welcome = () => {
    const [darkMode, setDarkMode] = useState(false);

    // Check system preference for dark mode on load
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDarkMode);
    }, []);

    // Set up GSAP animations
    useEffect(() => {
        // Create scroll animations
        ScrollTrigger.batch("[data-gsap='reveal']", {
            onEnter: (batch) =>
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: 'power2.out',
                }),
            start: 'top 85%',
        });

        // Create floating animation for elements with float class
        const floatingElements = document.querySelectorAll('.float');
        floatingElements.forEach((el, index) => {
            const direction = index % 2 === 0 ? 1 : -1;
            const delay = index * 0.2;

            gsap.to(el, {
                y: direction * 12,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                duration: 3 + index * 0.2,
                delay,
            });
        });

        // Add scroll progress indicator
        gsap.to('.scroll-progress', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: document.body,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.3,
            },
        });
    }, []);

    // Toggle dark mode function
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <ThemeProvider>
            <Head title="Student Web Solutions | Professional Web Development">
                <meta name="description" content="Professional web development solutions by Student Web Solutions." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 z-50 h-1 w-full">
                <div className="scroll-progress h-full w-full origin-left scale-x-0 bg-gradient-to-r from-blue-500 to-purple-600"></div>
            </div>

            <div
                className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative transition-colors duration-300`}
                style={{ visibility: 'visible' }}
            >
                {/* Enhanced Header with Mobile Support */}
                <header className="sticky top-0 z-40 w-full bg-white/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-gray-900/70">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/images/sws.png"
                                alt="Student Web Solutions Logo"
                                className="float h-10 w-10 rounded-full shadow-md sm:h-12 sm:w-12"
                            />
                            <div>
                                <h1 className="text-lg font-bold sm:text-xl">Student Web Solutions</h1>
                                <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Professional Web Development</p>
                            </div>
                        </div>

                        {/* Dark mode toggle */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className={`rounded-full p-2 ${
                                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                                } transition-colors`}
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Hero Landing Section - Full Width */}
                <HeroLanding darkMode={darkMode} />

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Project Showcase */}
                    <section>
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <ProjectShowcase darkMode={darkMode} />
                        </div>
                    </section>

                    {/* Testimonial slider section */}
                    <section>
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <TestimonialSlider darkMode={darkMode} />
                        </div>
                    </section>

                    {/* Live Projects section */}
                    <section>
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <LiveProject darkMode={darkMode} />
                        </div>
                    </section>

                    {/* GitHub section */}
                    <section>
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <GitHub darkMode={darkMode} />
                        </div>
                    </section>
                </main>

                {/* Enhanced Footer */}
                <Footer darkMode={darkMode} />
            </div>

            {/* Chat Bot */}
            {<ChatBot darkMode={darkMode} />}
        </ThemeProvider>
    );
};

export default Welcome;
