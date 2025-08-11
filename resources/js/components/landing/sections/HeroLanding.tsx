import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { BackgroundLines } from '@/components/ui/background-lines';
import { Cover } from '@/components/ui/cover';
import { motion } from 'framer-motion';

interface HeroLandingProps {
    darkMode: boolean;
}

const HeroLanding = ({ darkMode }: HeroLandingProps) => {
    const projectImages = [
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
    ];

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* 3D Marquee Background */}
            <div className="absolute inset-0 z-0">
                <div className="h-full w-full opacity-30 blur-[1px]">
                    <ThreeDMarquee images={projectImages} />
                </div>
            </div>

            {/* Background Lines with Content */}
            <BackgroundLines className="flex min-h-screen w-full flex-col items-center justify-center bg-transparent px-4">
                {/* Hero Text */}
                <div className="relative z-20 mx-auto max-w-7xl px-4 py-20 md:py-32">
                    <h1
                        className={`relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold md:text-4xl lg:text-7xl ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                        {['Build', 'your', 'capstone', 'not', 'in', 'months', 'but', 'in', 'a'].map((word, index) => (
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
                                delay: 9 * 0.1, // Continue the sequence
                                ease: 'easeInOut',
                            }}
                            className="inline-block"
                        >
                            <Cover>few days</Cover>
                        </motion.span>
                    </h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.8 }}
                        className={`relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal ${darkMode ? 'text-neutral-400' : 'text-neutral-600'}`}
                    >
                        Professional web development services that transform your ideas into powerful digital solutions. I deliver cutting-edge
                        websites and applications that help your business thrive in the digital world.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: 1 }}
                        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
                    >
                        <button
                            className={`w-60 transform rounded-lg px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                                darkMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'
                            }`}
                        >
                            Start Your Project
                        </button>
                        <button
                            className={`w-60 transform rounded-lg border px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                                darkMode
                                    ? 'border-gray-700 bg-black text-white hover:bg-gray-900'
                                    : 'border-gray-300 bg-white text-black hover:bg-gray-100'
                            }`}
                        >
                            View Portfolio
                        </button>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        className="mt-16 grid grid-cols-2 gap-8 lg:grid-cols-4"
                    >
                        {[
                            { number: '50+', label: 'Projects Delivered' },
                            { number: '100%', label: 'Client Satisfaction' },
                            { number: '24/7', label: 'Support Available' },
                            { number: '3+', label: 'Years Experience' },
                        ].map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className={`text-3xl font-bold sm:text-4xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.number}</div>
                                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Technologies */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.8 }}
                        className="mt-16 text-center"
                    >
                        <h3 className={`mb-8 text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Powered by Modern Technologies</h3>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            {['React', 'Laravel', 'TypeScript', 'PostgreSQL', 'Tailwind CSS', 'Shadcn UI'].map((tech, index) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 2 + index * 0.1 }}
                                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-110 ${
                                        darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </BackgroundLines>
        </div>
    );
};

export default HeroLanding;
