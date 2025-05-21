import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Define project interface
export interface Project {
    id: number;
    title: string;
    description: string;
    image: string;
    video: string;
    category: 'capstone' | 'client'; // Added category field
    credentials: {
        username: string;
        password: string;
    };
    liveUrl: string;
}

// Project data with categories
export const projects: Project[] = [
    {
        id: 1,
        title: 'Chess School Website',
        description:
            'This is the premier chess school in Thailand, dedicated to nurturing future chess champions. Our website offers a seamless registration system that helps them easily identify and manage new sign-ups. Once a student registers, the school receives an instant notification—ensuring no one is missed and every application is tracked efficiently. The site features a responsive design that works flawlessly on all devices, integrated payment processing for course registrations, and an elegant user interface that reflects the strategic nature of chess.\n\nKey features include:\n• Modern, responsive design optimized for all devices\n• Streamlined registration process with automated notifications\n• Secure payment integration\n• Course catalog with detailed information\n• Instructor profiles and scheduling system\n• Interactive chess-themed elements throughout the site\n• SEO optimization for better visibility',
        image: '/assets/images/project-1.png',
        video: '/assets/videos/DoubleBishopChess.mp4',
        category: 'client',
        credentials: {
            username: 'No test Credential for this project',
            password: 'No test Credential for this project',
        },
        liveUrl: 'https://doublebishopchess.com',
    },
    {
        id: 2,
        title: 'PNP E-Mapping System',
        description:
            'The PNP E-Mapping System is an internal web application designed to streamline user account management and regional data mapping within the Philippine National Police. The system allows administrators and regional users to securely log in, manage information, and coordinate across divisions efficiently. It includes user role assignments, secure password hashing, and role-based access control to ensure data privacy and operational clarity.\n\nKey features include:\n• Role-based user access (admin and regional users)\n• Secure password encryption\n• Seamless user registration and account creation\n• Responsive design for desktop and mobile use\n• Email-based user identification\n• Scalable for additional region support',
        image: '/assets/images/project-2.png',
        video: '/assets/videos/pnp.mp4',
        category: 'capstone',
        credentials: {
            username: 'APCSLADMIN',
            password: 'APCSL',
        },
        liveUrl: 'https://pnp-system-main-3cjhdf.laravel.cloud',
    },
    {
        id: 3,
        title: 'Wedding Website',
        description:
            'This is the website wedding that i created for my wedding. It is a simple website that contains the information about the wedding, such as the date, time, and location of the wedding. It also contains a RSVP form that allows guests to RSVP for the wedding. The website is built using Laravel and blade.',
        image: '/assets/images/project-3.png',
        video: '/assets/videos/wedding.mp4',
        category: 'client',
        credentials: {
            username: 'No test Credential for this project',
            password: 'No test Credential for this project',
        },
        liveUrl: 'https://wedding.psanguan.com',
    },
    {
        id: 4,
        title: 'Candy Shop Website',
        description: 'This is a candy shop website that i created for my client. It is a simple website in three Js, Typescript and laravel',
        image: '/assets/images/project-4.png',
        video: '/assets/videos/candy.mp4',
        category: 'client',
        credentials: {
            username: 'No test Credential for this project',
            password: 'No test Credential for this project',
        },
        liveUrl: 'https://less-is-more-candy-main-qk8czn.laravel.cloud/',
    },
    {
        id: 5,
        title: 'Athlete Tracking System',
        description:
            'This is a web application that allows coaches to track the performance of their athletes. It includes features such as athlete profiles, performance tracking, and reporting.',
        image: '/assets/images/project-5.png',
        video: '/assets/videos/tracking.mp4',
        category: 'client',
        credentials: {
            username: 'No test Credential for this project',
            password: 'No test Credential for this project',
        },
        liveUrl: 'https://ben.choros.io/',
    },
];

// Project Card Component
export const ProjectCard = ({ project, onClick }: { project: Project; onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (isHovered && videoRef.current) {
            videoRef.current.play().catch(() => {
                // Silent catch for browsers that prevent autoplay
            });
        } else if (!isHovered && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isHovered]);

    const handleClick = () => {
        // Play audio when card is clicked
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                // Silent catch for browsers that prevent autoplay
            });
        }
        onClick();
    };

    return (
        <motion.div
            className="h-full cursor-pointer overflow-hidden rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            <div className="relative aspect-video overflow-hidden bg-gray-900">
                <img
                    src={project.image}
                    alt={project.title}
                    className={`h-full w-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                />

                {isHovered && (
                    <video ref={videoRef} src={project.video} className="absolute inset-0 h-full w-full object-cover" muted loop playsInline />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-4">
                    <h3 className="text-xl font-bold text-white">{project.title}</h3>
                    <p className="mt-1 text-sm text-gray-300">Click to view details</p>
                </div>

                <div
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                    <span className="rounded-lg bg-white/90 px-4 py-2 font-medium text-gray-900 shadow-lg">View Project</span>
                </div>
            </div>
        </motion.div>
    );
};

// Category Section Component
export const CategorySection = ({
    title,
    projects,
    onSelectProject,
}: {
    title: string;
    projects: Project[];
    onSelectProject: (project: Project) => void;
}) => {
    return (
        <div className="mb-12">
            <div className="mb-6 flex items-center">
                <h2 className="text-2xl font-bold">{title}</h2>
                <div className="ml-4 flex-grow border-b-2 border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
                {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} onClick={() => onSelectProject(project)} />
                ))}
            </div>
        </div>
    );
};

// Service Card Component
export const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
    return (
        <motion.div
            className="rounded-xl bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            <div className="mb-4 text-blue-500">{icon}</div>
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </motion.div>
    );
};

// Custom Confirmation Dialog Component
export const ConfirmationDialog = ({
    isOpen,
    onClose,
    onConfirm,
    darkMode,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    darkMode: boolean;
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className={`w-full max-w-md rounded-2xl p-1 ${darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'}`}
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                            <div className="mb-4 flex justify-center">
                                <div className={`rounded-full p-4 ${darkMode ? 'bg-gray-700' : 'bg-blue-100'}`}>
                                    <svg
                                        className={`h-10 w-10 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}
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

                            <h3 className={`mb-2 text-center text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Leaving This Site</h3>

                            <p className={`mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                You will now go to my Facebook page to message me. Would you like to continue?
                            </p>

                            <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                                <button
                                    onClick={onClose}
                                    className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors ${
                                        darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors ${
                                        darkMode
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                                            : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
                                    }`}
                                >
                                    Continue to Facebook
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Project Detail Modal Component
export const ProjectDetailModal = ({
    project,
    onClose,
    darkMode,
    className,
}: {
    project: Project;
    onClose: () => void;
    darkMode: boolean;
    className?: string;
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [copied, setCopied] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleCloseModal();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleCloseModal();
            }
        };

        window.addEventListener('keydown', handleEsc);
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Play video with sound when modal opens and clean up when closed
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {
                // Silent catch for browsers that prevent autoplay
            });
        }

        // Stop video when component unmounts
        return () => {
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
            }
        };
    }, []);

    const copyCredentials = () => {
        const text = `Username: ${project.credentials.username}\nPassword: ${project.credentials.password}`;
        navigator.clipboard.writeText(text);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    const handleCloseModal = () => {
        // Stop the video
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        onClose();
    };

    const handleFacebookClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmFacebook = () => {
        setShowConfirmation(false);
        window.open('https://www.facebook.com/profile.php?id=61560390520092', '_blank');
    };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                ref={modalRef}
                className={`max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl shadow-2xl ${
                    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
                <div className="relative aspect-video">
                    <video ref={videoRef} src={project.video} className="h-full w-full object-cover" autoPlay loop playsInline />
                    <button
                        onClick={handleCloseModal}
                        className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <h2 className="mb-4 text-2xl font-bold">{project.title}</h2>

                    <div className="mb-6">
                        <h3 className="mb-2 text-lg font-semibold">Project Overview</h3>
                        <div className={`whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{project.description}</div>
                    </div>

                    <div className={`mb-6 rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-medium">Test Credentials</h3>
                            <button
                                onClick={copyCredentials}
                                className={`rounded px-3 py-1 text-sm transition-colors ${
                                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Username</p>
                                <p className={`mt-1 rounded p-2 font-mono break-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    {project.credentials.username}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400">Password</p>
                                <p className={`mt-1 rounded p-2 font-mono break-all ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    {project.credentials.password}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                        <a
                            href="#"
                            onClick={handleFacebookClick}
                            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium shadow-md transition-all sm:w-auto ${
                                darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                />
                            </svg>
                            Have an idea you want to bring to life? Contact us!
                        </a>
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium shadow-md transition-all sm:w-auto ${
                                darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                            }`}
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
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirmFacebook}
                darkMode={darkMode}
            />
        </motion.div>
    );
};

// Projects Container Component
export const ProjectsContainer = ({ darkMode }: { darkMode: boolean }) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Filter projects by category
    const capstoneProjects = projects.filter((project) => project.category === 'capstone');
    const clientProjects = projects.filter((project) => project.category === 'client');

    return (
        <div className="container mx-auto px-4 py-12">
            {capstoneProjects.length > 0 && (
                <div className="mb-16">
                    <div className="mb-6 flex items-center">
                        <h2 className="text-3xl font-bold">Capstone Projects</h2>
                        <div className="ml-4 flex-grow border-b-4 border-blue-500 dark:border-blue-400"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {capstoneProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                        ))}
                    </div>
                </div>
            )}

            {clientProjects.length > 0 && (
                <div className="mb-12">
                    <div className="mb-6 flex items-center">
                        <h2 className="text-3xl font-bold">Client Websites</h2>
                        <div className="ml-4 flex-grow border-b-4 border-green-500 dark:border-green-400"></div>
                    </div>
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {clientProjects.map((project) => (
                            <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                        ))}
                    </div>
                </div>
            )}

            {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} darkMode={darkMode} />}
        </div>
    );
};
