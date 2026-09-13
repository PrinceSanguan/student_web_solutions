'use client';

import { motion } from 'motion/react';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';

const ProjectShowcase = () => {
    // Simple image data for showcase
    const projectImages = [
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-1.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-2.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-3.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-4.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-5.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-6.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-7.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-8.mp4',
        'https://media.biyaherongchesscoach.com/studentwebsolution/project-9.mp4',
    ];

    return (
        <section id="capstone-projects" className="scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-12 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Capstone Projects & Systems
                    </h2>
                    <p className={`'text-gray-300' : 'text-gray-600'} mx-auto max-w-2xl`}>
                        Browse our ready-made capstone projects and web systems — fully built, tested, and ready to deploy.
                    </p>
                </div>

                {/* Top Slider - Right to Left */}
                <div className="mb-8">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
                        slidesPerView="auto"
                        loop={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                        }}
                        speed={5000}
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
                                    className="h-48 w-[400px] rounded-lg object-cover shadow-lg brightness-90 filter transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:brightness-110 sm:h-64 sm:w-[500px] md:h-80 md:w-[650px]"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Bottom Slider - Left to Right */}
                <div className="mb-8">
                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={20}
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
                                    className="h-48 w-[400px] rounded-lg object-cover shadow-lg brightness-90 filter transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:brightness-110 sm:h-64 sm:w-[500px] md:h-80 md:w-[650px]"
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
