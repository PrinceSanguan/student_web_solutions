import { Tabs } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const LiveProject = () => {
    const liveProjects = [
        {
            title: 'Choros.io',
            url: 'https://choros.io',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.webp',
        },
        {
            title: 'IPTT',
            url: 'https://iptt.laravel.cloud/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.webp',
        },
        {
            title: 'SJA Website',
            url: 'https://sjamartialarts.com/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.webp',
        },
        {
            title: 'Chess website',
            url: 'https://doublebishopchess.com/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.webp',
        },
        {
            title: 'Choros Plus',
            url: 'https://choros-plus-main-2s4qrk.laravel.cloud/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.webp',
        },
        {
            title: 'Bijou',
            url: 'https://bijou.laravel.cloud/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.webp',
        },
        {
            title: 'BWC',
            url: 'https://bwc.laravel.cloud/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.webp',
        },
        {
            title: 'ARMA',
            url: 'https://arma-website-main-gbgm6t.laravel.cloud/',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.webp',
        },
        {
            title: 'Sushi Website',
            url: 'https://butterflysushibars.com',
            image: 'https://media.biyaherongchesscoach.com/studentwebsolution/project-9.webp',
        },
    ];

    const tabs = liveProjects.map((project, index) => ({
        title: project.title,
        value: project.title.toLowerCase().replace(/\s+/g, '-'),
        content: (
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="group block h-full w-full cursor-pointer">
                <div className="relative h-full w-full overflow-hidden rounded-2xl bg-gradient-to-br from-purple-700 to-violet-900 transition-all duration-300 hover:from-purple-600 hover:to-violet-800">
                    {/* Project Image */}
                    <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
            </a>
        ),
    }));

    return (
        <div className="relative overflow-hidden py-12 sm:py-16 md:py-20">
            {/* Section Header */}
            <div className="mb-12 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl"
                >
                    Live Projects
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`'text-gray-300' : 'text-gray-600'} mx-auto max-w-2xl`}
                >
                    Explore our deployed projects and see them in action. Click on any tab to visit the live websites.
                </motion.p>
            </div>

            {/* Projects Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="relative mx-auto flex h-[15rem] w-full max-w-5xl flex-col items-start justify-start [perspective:1000px] sm:h-[20rem] md:h-[40rem]"
            >
                <Tabs tabs={tabs} />
            </motion.div>

            {/* Call to Action */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-8 text-center"
            >
                <div className="inline-flex items-center gap-3 rounded-full border border-green-500/20 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 px-6 py-3 shadow-lg backdrop-blur-sm">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
            </motion.div>

            {/* Background Decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className={`'bg-green-500/6' : 'bg-green-500/3' } absolute -top-24 -right-24 h-48 w-48 animate-pulse rounded-full opacity-50 blur-3xl`}
                ></div>
                <div
                    className={`'bg-blue-500/6' : 'bg-blue-500/3' } absolute -bottom-24 -left-24 h-48 w-48 animate-pulse rounded-full opacity-50 blur-3xl`}
                    style={{ animationDelay: '3s' }}
                ></div>
            </div>
        </div>
    );
};

export default LiveProject;
