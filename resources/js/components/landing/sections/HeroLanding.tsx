import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/animated-modal';
import { Cover } from '@/components/ui/cover';
import { Vortex } from '@/components/ui/vortex';
import { motion } from 'framer-motion';

const HeroLanding = () => {
    const projectImages = [
        '/assets/images/project-1.webp',
        '/assets/images/project-2.webp',
        '/assets/images/project-3.webp',
        '/assets/images/project-4.webp',
        '/assets/images/project-5.webp',
        '/assets/images/project-6.webp',
        '/assets/images/project-7.webp',
        '/assets/images/project-8.webp',
        '/assets/images/project-1.webp',
        '/assets/images/project-2.webp',
        '/assets/images/project-3.webp',
        '/assets/images/project-4.webp',
        '/assets/images/project-5.webp',
        '/assets/images/project-6.webp',
        '/assets/images/project-7.webp',
        '/assets/images/project-8.webp',
        '/assets/images/project-1.webp',
        '/assets/images/project-2.webp',
        '/assets/images/project-3.webp',
        '/assets/images/project-4.webp',
        '/assets/images/project-5.webp',
        '/assets/images/project-6.webp',
        '/assets/images/project-7.webp',
        '/assets/images/project-8.webp',
        '/assets/images/project-1.webp',
        '/assets/images/project-2.webp',
        '/assets/images/project-3.webp',
        '/assets/images/project-4.webp',
        '/assets/images/project-5.webp',
        '/assets/images/project-6.webp',
        '/assets/images/project-7.webp',
        '/assets/images/project-8.webp',
    ];

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
            {/* Mobile View with Vortex */}
            <div className="block h-full w-full md:hidden">
                <Vortex backgroundColor="black" className="flex h-full w-full flex-col items-center justify-center px-2 py-4">
                    <h1 className="max-w-4xl text-center text-2xl font-bold text-white">
                        {'Build your system not in months but in a'.split(' ').map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: 'easeInOut',
                                }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: 1.0,
                                ease: 'easeInOut',
                            }}
                            className="inline-block"
                        >
                            <Cover>few days.</Cover>
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="mt-6 max-w-xl text-center text-sm text-white"
                    >
                        Professional web development services that transform your ideas into powerful digital solutions.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1 }}
                        className="mt-6 flex flex-col items-center gap-4"
                    >
                        <button
                            onClick={() => window.open('https://www.facebook.com/profile.php?id=61560390520092')}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] transition duration-200 hover:bg-blue-700"
                        >
                            💬 Start Your Project
                        </button>
                        <button
                            onClick={() => document.getElementById('live-projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="rounded-lg border border-white/20 px-6 py-2 text-white transition-all duration-300 hover:bg-white/10"
                        >
                            View Portfolio
                        </button>
                    </motion.div>
                </Vortex>
            </div>

            {/* Desktop View */}
            <div className="relative hidden h-full w-full md:flex md:flex-col md:items-center md:justify-center">
                <div className="px-4">
                    <h1 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-black md:text-4xl md:text-white lg:text-7xl">
                        {'Build your system not in months but in a'.split(' ').map((word, index) => (
                            <motion.span
                                key={index}
                                initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.1,
                                    ease: 'easeInOut',
                                }}
                                className="mr-2 inline-block"
                            >
                                {word}
                            </motion.span>
                        ))}
                        <motion.span
                            initial={{ opacity: 0, filter: 'blur(4px)', y: 10 }}
                            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: 1.0,
                                ease: 'easeInOut',
                            }}
                            className="inline-block"
                        >
                            <Cover>few days.</Cover>
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: 0.8,
                        }}
                        className="relative z-20 mx-auto max-w-xl py-4 text-center text-lg font-normal text-black md:text-neutral-200"
                    >
                        Professional web development services that transform your ideas into powerful digital solutions.
                    </motion.p>

                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        transition={{
                            duration: 0.3,
                            delay: 1,
                        }}
                        className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <Modal>
                            <ModalTrigger className="group/modal-btn flex w-60 transform justify-center rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800">
                                <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-40">Start Your Project</span>
                                <div className="absolute inset-0 z-20 flex -translate-x-40 items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
                                    💬
                                </div>
                            </ModalTrigger>
                            <ModalBody>
                                <ModalContent>
                                    <h4 className="mb-8 text-center text-lg font-bold text-neutral-600 md:text-2xl dark:text-neutral-100">
                                        Let's start your{' '}
                                        <span className="rounded-md border border-blue-200 bg-blue-100 px-1 py-0.5 text-blue-600 dark:border-blue-700 dark:bg-blue-800/30 dark:text-blue-400">
                                            project
                                        </span>{' '}
                                        together! 💬
                                    </h4>
                                    <div className="flex items-center justify-center">
                                        {[
                                            '/assets/images/project-1.webp',
                                            '/assets/images/project-2.webp',
                                            '/assets/images/project-3.webp',
                                            '/assets/images/project-4.webp',
                                            '/assets/images/project-5.webp',
                                        ].map((image, idx) => (
                                            <motion.div
                                                key={'images' + idx}
                                                style={{
                                                    rotate: Math.random() * 20 - 10,
                                                }}
                                                whileHover={{
                                                    scale: 1.1,
                                                    rotate: 0,
                                                    zIndex: 100,
                                                }}
                                                whileTap={{
                                                    scale: 1.1,
                                                    rotate: 0,
                                                    zIndex: 100,
                                                }}
                                                className="mt-4 -mr-4 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1 dark:border-neutral-700 dark:bg-neutral-800"
                                            >
                                                <img
                                                    src={image}
                                                    alt="project preview"
                                                    width="500"
                                                    height="500"
                                                    className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-40 md:w-40"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mx-auto flex max-w-sm flex-wrap items-start justify-start gap-x-4 gap-y-6 py-10">
                                        <div className="flex items-center justify-center">
                                            <WebIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Custom Web Development</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <MobileIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Mobile Responsive</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <FastIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Fast Delivery</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <SupportIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">24/7 Support</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <DatabaseIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Database Integration</span>
                                        </div>
                                        <div className="flex items-center justify-center">
                                            <SecurityIcon className="mr-1 h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm text-neutral-700 dark:text-neutral-300">Secure & Reliable</span>
                                        </div>
                                    </div>
                                </ModalContent>
                                <ModalFooter className="gap-4">
                                    <button
                                        onClick={() => window.open('https://www.facebook.com/profile.php?id=61560390520092')}
                                        className="flex w-32 items-center justify-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                                    >
                                        💬 Message Me
                                    </button>
                                </ModalFooter>
                            </ModalBody>
                        </Modal>
                        <button
                            onClick={() => document.getElementById('live-projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-60 transform rounded-lg border border-white/20 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                        >
                            View Portfolio
                        </button>
                    </motion.div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 z-10 h-full w-full bg-black/60" />

                {/* 3D Marquee Background */}
                <ThreeDMarquee className="pointer-events-none absolute inset-0 h-full w-full" images={projectImages} />
            </div>
        </div>
    );
};

const WebIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="m12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

const MobileIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
);

const FastIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
    </svg>
);

const SupportIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c.552 0 1-.449 1-1s-.448-1-1-1" />
        <path d="M3 12c-.552 0-1-.449-1-1s.448-1 1-1" />
        <path d="M12 21c0 .552-.449 1-1 1s-1-.448-1-1" />
        <path d="M12 3c0-.552-.449-1-1-1s-1 .448-1 1" />
        <circle cx="12" cy="12" r="9" />
    </svg>
);

const DatabaseIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5" />
        <path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3" />
    </svg>
);

const SecurityIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export default HeroLanding;
