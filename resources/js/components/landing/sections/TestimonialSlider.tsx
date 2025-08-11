import { DraggableCardBody, DraggableCardContainer } from '@/components/ui/draggable-card';
import { useState } from 'react';

interface TestimonialSliderProps {
    darkMode: boolean;
}

const TestimonialSlider = ({ darkMode }: TestimonialSliderProps) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const testimonials = [
        {
            image: '/assets/images/testimonial-1.png',
            author: 'Sarah Johnson',
            className: 'absolute top-20 left-[30%] rotate-[-5deg]',
        },
        {
            image: '/assets/images/testimonial-2.png',
            author: 'Michael Chen',
            className: 'absolute top-32 right-[30%] rotate-[7deg]',
        },
    ];

    const handleImageClick = (image: string) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="relative overflow-hidden py-12 sm:py-16 md:py-20">
            {/* Section Header */}
            <div className="mb-8 text-center">
                <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                    Client Testimonials
                </h2>
                <p className={`mx-auto max-w-2xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Real feedback from satisfied clients who trust our web development expertise
                </p>
            </div>

            <DraggableCardContainer className="relative flex min-h-[600px] w-full items-center justify-center overflow-hidden">
                {/* Center Text */}
                <div className="absolute top-1/2 left-1/2 z-0 mx-auto max-w-sm -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className={`text-2xl font-black md:text-4xl ${darkMode ? 'text-neutral-800' : 'text-neutral-300'}`}>Drag to explore our</p>
                    <p className={`mt-2 text-xl font-bold md:text-2xl ${darkMode ? 'text-neutral-700' : 'text-neutral-400'}`}>client testimonials</p>
                </div>

                {/* Draggable Testimonial Cards */}
                {testimonials.map((testimonial, index) => (
                    <DraggableCardBody key={index} className={testimonial.className}>
                        <div
                            className={`group hover:shadow-3xl relative cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 ${
                                darkMode ? 'border border-gray-700 bg-gray-800' : 'border border-gray-200 bg-white'
                            }`}
                            onClick={() => handleImageClick(testimonial.image)}
                        >
                            <img
                                src={testimonial.image}
                                alt={testimonial.author}
                                className="h-64 w-64 object-cover transition-transform duration-300 group-hover:scale-110 sm:h-80 sm:w-80"
                            />

                            {/* Author Overlay */}
                            <div className="absolute right-0 bottom-0 left-0 z-20 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4">
                                <div className="text-white">
                                    <p className="text-lg font-bold sm:text-xl">{testimonial.author}</p>
                                    <p className="text-sm opacity-75">Click to enlarge</p>
                                </div>
                            </div>

                            {/* Click indicator */}
                            <div className="absolute top-4 right-4 z-30">
                                <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </DraggableCardBody>
                ))}
            </DraggableCardContainer>

            {/* Bottom Instructions */}
            <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 px-4 py-2 shadow-lg backdrop-blur-sm">
                    <svg className="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3.5"
                        />
                    </svg>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Drag the cards around to explore our testimonials
                    </span>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className={`absolute -top-24 -right-24 h-48 w-48 rounded-full blur-3xl ${
                        darkMode ? 'bg-blue-500/6' : 'bg-blue-500/3'
                    } animate-pulse opacity-50`}
                ></div>
                <div
                    className={`absolute -bottom-24 -left-24 h-48 w-48 rounded-full blur-3xl ${
                        darkMode ? 'bg-purple-500/6' : 'bg-purple-500/3'
                    } animate-pulse opacity-50`}
                    style={{ animationDelay: '3s' }}
                ></div>
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                    <div className="relative max-h-[85vh] max-w-[95vw] overflow-hidden rounded-2xl shadow-2xl sm:max-h-[90vh] sm:max-w-[90vw]">
                        <img src={selectedImage} alt="Enlarged testimonial" className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain" />

                        {/* Close button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Instructions */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-sm">
                            <p className="text-sm">Click anywhere to close</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestimonialSlider;
