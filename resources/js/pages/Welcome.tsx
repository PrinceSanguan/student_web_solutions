import Analytics from '@/components/landing/analytics';
import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import ProjectShowcase from '@/components/landing/project-showcase';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const ParallaxBackground = () => {
    const [scrollY, setScrollY] = useState(0);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            setMouseX(e.clientX / window.innerWidth);
            setMouseY(e.clientY / window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
            <div
                className="absolute inset-0 h-[120%] w-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/images/background.sws.png')",
                    transform: `translateY(-${scrollY * 0.5}px) translateX(${(mouseX - 0.5) * -10}px) translateY(${(mouseY - 0.5) * -10}px)`,
                    filter: 'brightness(0.7)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/70" />
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                }}
            />
        </div>
    );
};

// Mobile-responsive Intro Video Component
const IntroVideo = ({ onVideoComplete }: { onVideoComplete: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Handle video ended event
    const handleVideoEnded = () => {
        // Mark video as watched in localStorage
        localStorage.setItem('introVideoWatched', 'true');
        onVideoComplete();
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black p-4 sm:p-6 md:p-8">
            {/* Welcome message - responsive text sizes */}
            <div className="bg-opacity-80 mb-3 w-full max-w-sm rounded-lg bg-gray-900 p-3 text-center sm:mb-4 sm:max-w-md sm:p-4 md:mb-6 md:max-w-lg">
                <h2 className="text-lg font-bold text-white sm:text-xl md:text-2xl">Welcome to Student Web Solutions</h2>
                <p className="mt-1 text-sm text-gray-300 sm:mt-2 sm:text-base">
                    Please watch our promotional video to continue to the website.
                    <br />
                    <span className="font-semibold">Click the video to play.</span>
                </p>
            </div>

            {/* Video container with aspect ratio box for responsiveness */}
            <div className="w-full max-w-4xl">
                {/* 16:9 aspect ratio wrapper */}
                <div className="relative overflow-hidden rounded-lg bg-black pb-[56.25%] shadow-xl">
                    <video
                        ref={videoRef}
                        className="absolute top-0 left-0 h-full w-full object-contain"
                        onEnded={handleVideoEnded}
                        controls={true}
                        playsInline
                        poster="/assets/images/logo.png"
                        preload="auto"
                    >
                        <source src="/assets/videos/promotion.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Mobile-friendly instruction below video on small screens */}
                <p className="mt-2 text-center text-xs text-white sm:hidden">Tap the play button to start the video</p>
            </div>
        </div>
    );
};

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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showIntro, setShowIntro] = useState(true);

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

    // Toggle dark mode function
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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
            </Head>

            {showIntro && <IntroVideo onVideoComplete={handleVideoComplete} />}

            <div
                className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative transition-colors duration-300`}
            >
                <ParallaxBackground />

                {/* Enhanced Header with Mobile Support */}
                <header className="sticky top-0 z-40 w-full bg-white/70 px-4 py-4 shadow-sm backdrop-blur-md dark:bg-gray-900/70">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/images/sws.png"
                                alt="Student Web Solutions Logo"
                                className="h-10 w-10 rounded-full shadow-md sm:h-12 sm:w-12"
                            />
                            <div>
                                <h1 className="text-lg font-bold sm:text-xl">Student Web Solutions</h1>
                                <p className="hidden text-xs text-gray-500 sm:block dark:text-gray-400">Professional Web Development</p>
                            </div>
                        </div>

                        {/* Mobile menu button */}
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
                <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    {/* Hero Section */}
                    <section className="mb-16 text-center">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
                                Our Portfolio
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg dark:text-gray-300">
                                Explore our showcase projects. Click to learn more and access test credentials.
                            </p>
                        </motion.div>
                    </section>

                    {/* Project Showcase */}
                    <ProjectShowcase darkMode={darkMode} />

                    {/* Analytics Dashboard Section */}
                    <Analytics
                        darkMode={darkMode}
                        dailyVisitors={props.dailyVisitors}
                        monthlyVisitors={props.monthlyVisitors}
                        dailyVisitorsData={props.dailyVisitorsData}
                        monthlyVisitorsData={props.monthlyVisitorsData}
                    />
                </main>

                {/* Enhanced Footer */}
                <Footer darkMode={darkMode} />
            </div>

            {/* Chat Bot */}
            <ChatBot darkMode={darkMode} />
        </>
    );
};

export default Welcome;
