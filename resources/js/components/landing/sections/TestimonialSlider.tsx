import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import TiltCard from '../cards/TiltCard';

interface TestimonialSliderProps {
    darkMode: boolean;
}

const TestimonialSlider = ({ darkMode }: TestimonialSliderProps) => {
    const sliderRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    const testimonials = [
        {
            text: "Student Web Solutions transformed our online presence with a beautiful, functional website that perfectly represents our brand.",
            author: "Sarah Johnson",
            role: "CEO, TechStart"
        },
        {
            text: "The team at SWS delivered our e-commerce platform ahead of schedule and helped increase our online sales by 200%.",
            author: "Michael Chen",
            role: "Founder, EcoShop"
        },
        {
            text: "Their attention to detail and commitment to quality is unmatched. I wouldn't trust anyone else with our web development needs.",
            author: "Jessica Williams",
            role: "Marketing Director, Innovate Inc."
        }
    ];

    useEffect(() => {
        if (!sliderRef.current) return;

        // Set up autoplay
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        // Initialize positions
        updateSlidePositions(currentSlide, true);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Animate to new slide position when currentSlide changes
        updateSlidePositions(currentSlide);
    }, [currentSlide]);

    const updateSlidePositions = (active: number, instant = false) => {
        slideRefs.current.forEach((slide, index) => {
            if (!slide) return;

            let xPosition: number;

            if (index === active) {
                xPosition = 0; // Center
            } else if (index < active) {
                xPosition = -100; // Left
            } else {
                xPosition = 100; // Right
            }

            gsap.to(slide, {
                xPercent: xPosition,
                opacity: index === active ? 1 : 0,
                scale: index === active ? 1 : 0.8,
                duration: instant ? 0 : 0.6,
                ease: "power2.out"
            });
        });
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Function to set references correctly
    const setSlideRef = (el: HTMLDivElement | null, index: number) => {
        slideRefs.current[index] = el;
    };

    return (
        <div className="relative overflow-hidden py-10">
            <h2 className="mb-8 text-center text-2xl font-bold sm:text-3xl md:text-4xl">
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Client Testimonials</span>
            </h2>

            {/* Slider container */}
            <div ref={sliderRef} className="relative mx-auto h-64 w-full max-w-2xl overflow-hidden">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        ref={(el) => setSlideRef(el, index)}
                        className="absolute inset-0 flex items-center justify-center px-6 text-center"
                    >
                        <TiltCard darkMode={darkMode}>
                            <div className="p-8">
                                <div className="mb-4 text-center">
                                    <svg className="mx-auto h-12 w-12 text-blue-500/80" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                                    </svg>
                                </div>
                                <p className="mb-4 text-lg italic text-gray-600 dark:text-gray-300">{testimonial.text}</p>
                                <div className="font-medium text-gray-800 dark:text-white">{testimonial.author}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                            </div>
                        </TiltCard>
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            <div className="mt-8 flex justify-center space-x-4">
                <button
                    onClick={prevSlide}
                    className={`rounded-full p-2 ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                    } shadow-md transition-colors`}
                    aria-label="Previous testimonial"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className={`rounded-full p-2 ${
                        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                    } shadow-md transition-colors`}
                    aria-label="Next testimonial"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Indicator dots */}
            <div className="mt-4 flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 w-2 rounded-full transition-colors ${
                            index === currentSlide
                                ? 'bg-blue-500'
                                : darkMode
                                ? 'bg-gray-600 hover:bg-gray-500'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default TestimonialSlider;
