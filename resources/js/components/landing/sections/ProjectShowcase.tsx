import { motion } from 'framer-motion';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

interface ProjectShowcaseProps {
    darkMode: boolean;
}

const ProjectShowcase = ({ darkMode }: ProjectShowcaseProps) => {
    // Simple image data for showcase
    const projectImages = [
        '/assets/videos/project-1.mp4',
        '/assets/videos/project-2.mp4',
        '/assets/videos/project-3.mp4',
        '/assets/videos/project-4.mp4',
        '/assets/videos/project-5.mp4',
        '/assets/videos/project-6.mp4',
        '/assets/videos/project-7.mp4',
    ];

    return (
        <section id="projects" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-12 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Featured Projects
                    </h2>
                    <p className={`mx-auto max-w-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Explore my latest work showcasing modern web development with cutting-edge technologies
                    </p>
                </div>

                {/* Top Slider - Right to Left */}
                <div className="mb-8">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={3000}
                        allowTouchMove={false}
                        className="!overflow-hidden"
                    >
                        {projectImages.map((video, index) => (
                            <SwiperSlide key={`top-${index}`} className="!w-auto">
                                <video
                                    src={video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-80 w-[650px] rounded-lg object-cover shadow-lg brightness-90 filter transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:brightness-110"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Bottom Slider - Left to Right */}
                <div className="mb-8">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={30}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            reverseDirection: true,
                        }}
                        speed={5000}
                        allowTouchMove={false}
                        className="!overflow-hidden"
                    >
                        {projectImages.map((video, index) => (
                            <SwiperSlide key={`bottom-${index}`} className="!w-auto">
                                <video
                                    src={video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    className="h-80 w-[650px] rounded-lg object-cover shadow-lg brightness-90 filter transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:brightness-110"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </motion.div>
        </section>
    );
};

export default ProjectShowcase;
