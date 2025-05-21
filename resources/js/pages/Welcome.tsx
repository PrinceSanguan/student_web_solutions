import Analytics from '@/components/landing/analytics';
import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import ProjectShowcase from '@/components/landing/project-showcase';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { SplitText } from 'gsap/SplitText';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, SplitText);

// Import components from their new locations
import CustomCursor from '@/components/landing/animations/CustomCursor';
import TextScramble from '@/components/landing/animations/TextScramble';
import ParallaxBackground from '@/components/landing/animations/ParallaxBackground';
import ParticleBackground from '@/components/landing/animations/ParticleBackground';
import SmoothScrollSection from '@/components/landing/animations/SmoothScrollSection';
import InteractiveCard from '@/components/landing/cards/InteractiveCard';
import TiltCard from '@/components/landing/cards/TiltCard';
import TestimonialSlider from '@/components/landing/sections/TestimonialSlider';
import AnimatedCounter from '@/components/landing/sections/AnimatedCounter';
import PageLoader from '@/components/landing/sections/PageLoader';
import IntroVideo from '@/components/landing/sections/IntroVideo';

















interface WelcomeProps {
    dailyVisitors: number;
    monthlyVisitors: number;
    dailyVisitorsData: {
        date: string;
        visitors: number;
    }[];
    monthlyVisitorsData: {
        date: string;
        visitors: number;
    }[];
    geographicalDistribution: {
        country: string;
        visitors: number;
    }[];
}

const Welcome = (props: WelcomeProps) => {
    const [darkMode, setDarkMode] = useState(false);
    const [showIntro, setShowIntro] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const heroRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const mainRef = useRef<HTMLElement>(null);

    // Check if intro video has been watched before
    useEffect(() => {
        const videoWatched = localStorage.getItem('introVideoWatched');
        if (videoWatched === 'true') {
            setShowIntro(false);
        }
    }, []);

    // Check system preference for dark mode on load
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDarkMode);
    }, []);

    // Set up GSAP animations
    useEffect(() => {
        if (!showIntro && !isLoading && mainRef.current) {
            // Stagger animation for the header elements
            const tl = gsap.timeline();

            tl.from(headingRef.current, {
                y: 30,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            })
            .from(descriptionRef.current, {
                y: 20,
                opacity: 0,
                duration: 0.6,
                ease: "power3.out"
            }, "-=0.4");

            // Create scroll animations
            ScrollTrigger.batch("[data-gsap='reveal']", {
                onEnter: batch => gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power2.out"
                }),
                start: "top 85%"
            });

            // Create floating animation for elements with float class
            const floatingElements = document.querySelectorAll('.float');
            floatingElements.forEach((el, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                const delay = index * 0.2;

                gsap.to(el, {
                    y: direction * 12,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    duration: 3 + index * 0.2,
                    delay
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
                    scrub: 0.3
                }
            });
        }
    }, [showIntro, isLoading]);

    // Toggle dark mode function
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Handle video completion
    const handleVideoComplete = () => {
        setShowIntro(false);
    };

    return (
        <>
            <Head title="Student Web Solutions | Professional Web Development">
                <meta name="description" content="Professional web development solutions by Student Web Solutions." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
                <style>
                    {`
                    * {
                        cursor: none;
                    }

                    @media (max-width: 640px) {
                        * {
                            cursor: auto;
                        }
                    }
                    `}
                </style>
            </Head>

            {/* Custom cursor */}
            <CustomCursor darkMode={darkMode} />

            {/* Scroll progress bar */}
            <div className="fixed top-0 left-0 z-50 w-full h-1">
                <div className="scroll-progress h-full w-full scale-x-0 bg-gradient-to-r from-blue-500 to-purple-600 origin-left"></div>
            </div>

            {/* Page loader */}
            <PageLoader isLoading={isLoading} setIsLoading={setIsLoading} />

            {!isLoading && showIntro && <IntroVideo onVideoComplete={handleVideoComplete} />}

            <div
                className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative transition-colors duration-300`}
                style={{ visibility: isLoading ? 'hidden' : 'visible' }}
            >
                <ParallaxBackground />
                <ParticleBackground darkMode={darkMode} />

                {/* Enhanced Header with Mobile Support */}
                <header className="sticky top-0 z-40 w-full bg-white/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-gray-900/70">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/images/sws.png"
                                alt="Student Web Solutions Logo"
                                className="h-10 w-10 rounded-full shadow-md sm:h-12 sm:w-12 float"
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

                {/* Main Content */}
                <main ref={mainRef} className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    {/* Hero Section */}
                    <section ref={heroRef} className="mb-16 text-center">
                        <div className="overflow-hidden">
                            <TextScramble
                                text="Our Portfolio"
                                className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl"
                            />
                            <p
                                ref={descriptionRef}
                                className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-300"
                            >
                                Explore our showcase projects. Click to learn more and access test credentials.
                            </p>
                        </div>
                    </section>

                    {/* Stats section with animated counters */}
                    <section className="mb-20">
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <TextScramble
                                text="Our Impact"
                                className="mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
                            />

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                <AnimatedCounter
                                    value={100}
                                    suffix="+"
                                    title="Satisfied Clients"
                                    darkMode={darkMode}
                                />
                                <AnimatedCounter
                                    value={250}
                                    suffix="+"
                                    title="Projects Completed"
                                    darkMode={darkMode}
                                />
                                <AnimatedCounter
                                    value={5}
                                    suffix="+"
                                    title="Years Experience"
                                    darkMode={darkMode}
                                />
                                <AnimatedCounter
                                    value={24}
                                    suffix="/7"
                                    title="Support"
                                    darkMode={darkMode}
                                />
                            </div>
                        </div>
                    </section>

                    {/* Services section with interactive cards */}
                    <section className="mb-20">
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <TextScramble
                                text="Our Services"
                                className="mb-8 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl md:text-4xl"
                            />

                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                <InteractiveCard
                                    darkMode={darkMode}
                                    title="Web Development"
                                    description="Custom web development solutions tailored to your needs."
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                        </svg>
                                    }
                                />
                                <InteractiveCard
                                    darkMode={darkMode}
                                    title="UI/UX Design"
                                    description="Beautiful, intuitive interfaces that enhance user experience."
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                        </svg>
                                    }
                                />
                                <InteractiveCard
                                    darkMode={darkMode}
                                    title="Mobile App Development"
                                    description="Cross-platform mobile applications with responsive design."
                                    icon={
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 float" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    {/* Testimonial slider section */}
                    <section className="mb-20">
                        <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                            <TestimonialSlider darkMode={darkMode} />
                        </div>
                    </section>

                    {/* Smooth scroll text section */}
                    <SmoothScrollSection />

                    {/* Project Showcase */}
                    <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                        <ProjectShowcase darkMode={darkMode} />
                    </div>

                    {/* Analytics Dashboard Section */}
                    <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                        <Analytics
                            darkMode={darkMode}
                            dailyVisitors={props.dailyVisitors}
                            monthlyVisitors={props.monthlyVisitors}
                            dailyVisitorsData={props.dailyVisitorsData}
                            monthlyVisitorsData={props.monthlyVisitorsData}
                        />
                    </div>
                </main>

                {/* Enhanced Footer */}
                <div data-gsap="reveal" style={{ opacity: 0, transform: 'translateY(30px)' }}>
                    <Footer darkMode={darkMode} />
                </div>
            </div>

            {/* Chat Bot */}
            {!isLoading && <ChatBot darkMode={darkMode} />}
        </>
    );
};

export default Welcome;
