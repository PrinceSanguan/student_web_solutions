import type React from 'react';

import { projects } from '@/components/landing/project';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../components/landing/theme-provider';

interface Props {
    projectId: number;
}

export default function ProjectDetail({ projectId }: Props) {
    // Force darkMode to be true for this page
    const { darkMode: themeMode } = useTheme();
    const darkMode = true; // Force dark mode
    const [project] = useState(projects.find((p) => p.id === Number.parseInt(String(projectId))));
    const videoRef = useRef<HTMLVideoElement>(null);
    const [copied, setCopied] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Add a useEffect to force dark mode styling
    useEffect(() => {
        // Add dark mode class to body
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#0f172a'; // slate-900

        return () => {
            // Cleanup when component unmounts
            if (!themeMode) {
                document.documentElement.classList.remove('dark');
                document.body.style.backgroundColor = '';
            }
        };
    }, [themeMode]);

    const copyCredentials = () => {
        if (!project) return;

        const text = `Username: ${project.credentials.username}\nPassword: ${project.credentials.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleFacebookClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmFacebook = () => {
        setShowConfirmation(false);
        window.open('https://www.facebook.com/profile.php?id=61560390520092', '_blank');
    };

    if (!project) {
        return (
            <>
                <Head title="Project Not Found" />
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
                    <div className="text-center">
                        <div className="mb-8 flex justify-center">
                            <div className="rounded-full border border-slate-700/50 bg-slate-800/50 p-6 backdrop-blur-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-16 w-16 text-red-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                            Project Not Found
                        </h1>
                        <p className="mt-4 text-lg text-slate-300">The project you are looking for does not exist.</p>
                        <a
                            href="/"
                            className="mt-8 inline-block rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                        >
                            Back to Home
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title={project.title} />
            <div
                className={`min-h-screen w-full overflow-x-hidden bg-slate-950 ${
                    darkMode
                        ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white'
                        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
                } transition-colors duration-300`}
                style={{ backgroundColor: '#030712' }} // Force dark background color
            >
                {/* Enhanced background pattern with stronger colors */}
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.15),transparent_70%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(147,51,234,0.15),transparent_50%)]"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.15),transparent_50%)]"></div>
                </div>

                <div className="relative z-10 container mx-auto max-w-7xl px-4 py-8">
                    <a
                        href="/#projects"
                        onClick={() => localStorage.setItem('introVideoWatched', 'true')}
                        className={`mb-8 inline-flex items-center gap-3 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                            darkMode
                                ? 'border border-slate-700/50 bg-slate-800/60 text-white backdrop-blur-md hover:bg-slate-700/60'
                                : 'border border-gray-200 bg-white/80 text-gray-800 backdrop-blur-md hover:bg-white'
                        } shadow-lg hover:translate-y-[-2px] hover:shadow-xl`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Projects
                    </a>

                    <div
                        className={`overflow-hidden rounded-2xl shadow-2xl backdrop-blur-md ${
                            darkMode ? 'border border-slate-800/70 bg-slate-900/60' : 'border border-gray-200 bg-white/80'
                        }`}
                    >
                        <div className="relative aspect-video w-full">
                            {/* Enhanced video overlay gradient */}
                            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

                            <img src={project.image} alt={project.title} className="h-full w-full object-cover" />

                            {/* Project title overlay on video */}
                            <div className="absolute bottom-0 left-0 z-20 w-full p-6">
                                <h1 className="text-3xl font-bold text-white drop-shadow-2xl md:text-4xl lg:text-5xl">{project.title}</h1>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 lg:p-10">
                            <div className="mb-10">
                                <h2 className="mb-4 flex items-center text-xl font-semibold md:text-2xl">
                                    <span className="mr-3 inline-block h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                                    Project Overview
                                </h2>
                                <div
                                    className={`text-base leading-relaxed whitespace-pre-line md:text-lg ${
                                        darkMode ? 'text-slate-200' : 'text-gray-700'
                                    }`}
                                >
                                    {project.description}
                                </div>
                            </div>

                            <motion.div
                                className={`mb-10 rounded-xl p-6 ${
                                    darkMode ? 'border border-slate-800/70 bg-slate-900/70 backdrop-blur-sm' : 'border border-gray-200 bg-gray-50/80'
                                }`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                    <h2 className="flex items-center text-xl font-semibold md:text-2xl">
                                        <span className="mr-3 inline-block h-1 w-10 rounded-full bg-gradient-to-r from-emerald-400 to-green-500"></span>
                                        Test Credentials
                                    </h2>
                                    <motion.button
                                        onClick={copyCredentials}
                                        className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
                                            darkMode
                                                ? 'border border-slate-600/50 bg-slate-700/60 text-white hover:bg-slate-600/60'
                                                : 'border border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        } backdrop-blur-sm`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {copied ? (
                                            <span className="flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-1 h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Copied!
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-1 h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                                    />
                                                </svg>
                                                Copy
                                            </span>
                                        )}
                                    </motion.button>
                                </div>
                                <div className="grid grid-cols-1 gap-6 text-sm lg:grid-cols-2">
                                    <div className="transition-all duration-300 hover:translate-y-[-2px]">
                                        <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>Username</p>
                                        <p
                                            className={`rounded-lg p-4 font-mono break-all ${
                                                darkMode
                                                    ? 'border border-slate-800/70 bg-slate-950/80 backdrop-blur-sm'
                                                    : 'border border-gray-200 bg-white'
                                            }`}
                                        >
                                            {project.credentials.username}
                                        </p>
                                    </div>
                                    <div className="transition-all duration-300 hover:translate-y-[-2px]">
                                        <p className={`mb-2 ${darkMode ? 'text-slate-300' : 'text-gray-500'}`}>Password</p>
                                        <p
                                            className={`rounded-lg p-4 font-mono break-all ${
                                                darkMode
                                                    ? 'border border-slate-800/70 bg-slate-950/80 backdrop-blur-sm'
                                                    : 'border border-gray-200 bg-white'
                                            }`}
                                        >
                                            {project.credentials.password}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="flex flex-col items-center justify-center gap-6 lg:flex-row lg:justify-between">
                                <motion.a
                                    href="#"
                                    onClick={handleFacebookClick}
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium shadow-lg transition-all duration-300 lg:w-auto ${
                                        darkMode
                                            ? 'border border-blue-500/20 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-xl hover:shadow-blue-600/20'
                                            : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-xl hover:shadow-blue-500/20'
                                    } backdrop-blur-sm`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                        />
                                    </svg>
                                    <span className="text-center">Have an idea you want to bring to life? Contact us!</span>
                                </motion.a>
                                <motion.a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium shadow-lg transition-all duration-300 lg:w-auto ${
                                        darkMode
                                            ? 'border border-slate-600/50 bg-slate-700/60 text-white hover:bg-slate-600/60 hover:shadow-xl'
                                            : 'border border-gray-300 bg-gray-200 text-gray-800 hover:bg-gray-300 hover:shadow-xl'
                                    } backdrop-blur-sm`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <span>Try Live Demo</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                        />
                                    </svg>
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Confirmation Dialog */}
            <AnimatePresence>
                {showConfirmation && (
                    <motion.div
                        className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowConfirmation(false)}
                    >
                        <motion.div
                            className={`w-full max-w-md rounded-2xl p-1 ${
                                darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-700' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                            }`}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`rounded-xl p-8 ${darkMode ? 'bg-slate-900/95 backdrop-blur-md' : 'bg-white/95 backdrop-blur-md'}`}>
                                <div className="mb-6 flex justify-center">
                                    <div className={`rounded-full p-5 ${darkMode ? 'border border-slate-700/50 bg-slate-800/60' : 'bg-blue-100'}`}>
                                        <svg
                                            className={`h-12 w-12 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <h3 className={`mb-3 text-center text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    Leaving This Site
                                </h3>

                                <p className={`mb-8 text-center ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                                    You will now go to my Facebook page to message me. Would you like to continue?
                                </p>

                                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                                    <motion.button
                                        onClick={() => setShowConfirmation(false)}
                                        className={`flex-1 rounded-xl px-5 py-4 font-medium transition-colors ${
                                            darkMode
                                                ? 'border border-slate-700/50 bg-slate-800/60 text-slate-300 hover:bg-slate-700/60'
                                                : 'border border-gray-300 bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        } backdrop-blur-sm`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                    <motion.button
                                        onClick={handleConfirmFacebook}
                                        className={`flex-1 rounded-xl px-5 py-4 font-medium transition-colors ${
                                            darkMode
                                                ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white hover:from-blue-700 hover:to-purple-800'
                                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                        }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Continue to Facebook
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
