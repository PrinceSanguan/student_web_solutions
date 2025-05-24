import { Project, ProjectCard, ProjectDetailModal, projects } from '@/components/landing/project';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ProjectShowcaseProps {
    darkMode: boolean;
}

const ProjectShowcase = ({ darkMode }: ProjectShowcaseProps) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <>
            <section id="projects" className="mb-16 scroll-mt-20 md:mb-24">
                <div className="mx-auto max-w-6xl">
                    <div className="container mx-auto px-2 py-8 sm:px-4 md:py-12">
                        {/* Founder Websites */}
                        <div className="mb-12 md:mb-16">
                            <div className="mb-6 flex items-center">
                                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Founder Websites</h2>
                                <div className="ml-4 flex-grow border-b-4 border-purple-500 dark:border-purple-400"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                {projects
                                    .filter((project) => project.category === 'founder')
                                    .map((project) => (
                                        <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                    ))}
                            </div>
                        </div>

                        {/* Capstone Projects */}
                        <div className="mb-12 md:mb-16">
                            <div className="mb-6 flex items-center">
                                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Capstone Projects</h2>
                                <div className="ml-4 flex-grow border-b-4 border-blue-500 dark:border-blue-400"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                {projects
                                    .filter((project) => project.category === 'capstone')
                                    .map((project) => (
                                        <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                    ))}
                            </div>
                        </div>

                        {/* Client Websites */}
                        <div className="mb-12 md:mb-16">
                            <div className="mb-6 flex items-center">
                                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Client Websites</h2>
                                <div className="ml-4 flex-grow border-b-4 border-green-500 dark:border-green-400"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                {projects
                                    .filter((project) => project.category === 'client')
                                    .map((project) => (
                                        <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                    ))}
                            </div>
                        </div>

                        {/* Mobile Websites */}
                        <div className="mb-12 md:mb-16">
                            <div className="mb-6 flex items-center">
                                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">Mobile Websites</h2>
                                <div className="ml-4 flex-grow border-b-4 border-orange-500 dark:border-orange-400"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                {projects
                                    .filter((project) => project.category === 'mobile')
                                    .map((project) => (
                                        <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                    ))}
                            </div>
                        </div>

                        {/* SAAS Websites */}
                        <div className="mb-12">
                            <div className="mb-6 flex items-center">
                                <h2 className="text-xl font-bold sm:text-2xl md:text-3xl">SAAS Websites</h2>
                                <div className="ml-4 flex-grow border-b-4 border-red-500 dark:border-red-400"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2">
                                {projects
                                    .filter((project) => project.category === 'saas')
                                    .map((project) => (
                                        <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} darkMode={darkMode} className="z-30" />
                )}
            </AnimatePresence>
        </>
    );
};

export default ProjectShowcase;
