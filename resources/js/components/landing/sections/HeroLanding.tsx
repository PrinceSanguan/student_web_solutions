import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from '@/components/ui/animated-modal';
import { Cover } from '@/components/ui/cover';
import { Vortex } from '@/components/ui/vortex';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';

const HeroLanding = () => {
    const projectImages = [
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
    ];

    return (
        <div className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
            {/* Mobile View with Vortex */}
            <div className="block h-full w-full md:hidden">
                <Vortex backgroundColor="black" className="flex h-full w-full flex-col items-center justify-center px-2 py-4">
                    <h1 className="max-w-4xl text-center text-2xl font-bold text-white">
                        {'Get a complete system —'.split(' ').map((word, index) => (
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
                                delay: 0.6,
                                ease: 'easeInOut',
                            }}
                            className="inline-block"
                        >
                            <Cover>ready to deploy.</Cover>
                        </motion.span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className="mt-6 max-w-xl text-center text-sm text-white"
                    >
                        Browse ready-made capstone projects and web systems, or request a custom build tailored to your needs.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1 }}
                        className="mt-6 flex flex-col items-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('capstone-projects')?.scrollIntoView({ behavior: 'smooth' })}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white shadow-[0px_2px_0px_0px_#FFFFFF40_inset] transition duration-200 hover:bg-blue-700"
                        >
                            🎓 View Capstone Projects Catalog
                        </button>
                        <button
                            onClick={() => window.open('https://www.facebook.com/profile.php?id=61560390520092')}
                            className="rounded-lg border border-white/20 px-6 py-2 text-white transition-all duration-300 hover:bg-white/10"
                        >
                            💬 Request Custom System
                        </button>
                    </motion.div>
                </Vortex>
            </div>

            {/* Desktop View */}
            <div className="relative hidden h-full w-full md:flex md:flex-col md:items-center md:justify-center">
                <div className="px-4">
                    <h1 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-black md:text-4xl md:text-white lg:text-7xl">
                        {'Get a complete system —'.split(' ').map((word, index) => (
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
                                delay: 0.6,
                                ease: 'easeInOut',
                            }}
                            className="inline-block"
                        >
                            <Cover>ready to deploy.</Cover>
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
                        Browse ready-made capstone projects and web systems, or request a custom build tailored to your needs.
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
                                <span className="text-center transition duration-500 group-hover/modal-btn:translate-x-40">
                                    View Capstone Projects Catalog
                                </span>
                                <div className="absolute inset-0 z-20 flex -translate-x-40 items-center justify-center text-white transition duration-500 group-hover/modal-btn:translate-x-0">
                                    🎓
                                </div>
                            </ModalTrigger>
                            <ModalBody>
                                <ModalContent>
                                    <h4 className="mb-6 text-center text-lg font-bold text-neutral-700 md:text-2xl">
                                        Get your capstone in{' '}
                                        <span className="rounded-md border border-blue-200 bg-blue-100 px-1 py-0.5 text-blue-600">
                                            4 simple steps
                                        </span>
                                    </h4>

                                    <div className="mx-auto max-w-sm space-y-3">
                                        {[
                                            { icon: '🔍', step: '01', title: 'Browse projects', desc: 'Explore our catalog of ready-made capstone systems' },
                                            { icon: '👁️', step: '02', title: 'Check the live demo', desc: 'See exactly what you\'re getting before you pay' },
                                            { icon: '💳', step: '03', title: 'Pay via GCash', desc: 'Fast, secure payment — just scan and pay' },
                                            { icon: '⚡', step: '04', title: 'Download your ZIP', desc: 'Source code + documentation + setup tutorial — instantly' },
                                        ].map((item) => (
                                            <div key={item.step} className="flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3">
                                                <span className="mt-0.5 text-xl">{item.icon}</span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-bold text-blue-500">{item.step}</span>
                                                        <span className="text-sm font-semibold text-neutral-800">{item.title}</span>
                                                    </div>
                                                    <p className="mt-0.5 text-xs text-neutral-500">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mx-auto mt-5 max-w-sm rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center">
                                        <p className="text-sm font-medium text-green-700">
                                            💚 Powered by GCash — just scan and pay. Starting at <span className="font-bold">₱499</span>.
                                        </p>
                                    </div>
                                </ModalContent>
                                <ModalFooter className="gap-4">
                                    <button
                                        onClick={() => router.visit('/capstone')}
                                        className="flex w-36 items-center justify-center gap-1 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
                                    >
                                        🎓 Browse Now
                                    </button>
                                </ModalFooter>
                            </ModalBody>
                        </Modal>
                        <button
                            onClick={() => window.open('https://www.facebook.com/profile.php?id=61560390520092')}
                            className="w-60 transform rounded-lg border border-white/20 bg-white/10 px-6 py-2 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20"
                        >
                            💬 Request Custom System
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

export default HeroLanding;
