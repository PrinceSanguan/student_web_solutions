import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface TestimonialSliderProps {
    darkMode: boolean;
}

const TestimonialSlider = ({ darkMode }: TestimonialSliderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const background1Ref = useRef<HTMLDivElement>(null);
    const background2Ref = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeBackground, setActiveBackground] = useState(1);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const testimonialImages = [
        '/assets/images/testimonial-1.png',
        '/assets/images/testimonial-2.png',
        '/assets/images/project-3.png',
        '/assets/images/project-4.png',
        '/assets/images/project-5.png',
        '/assets/images/project-6.png',
    ];

    useEffect(() => {
        // Preload all images
        const preloadImages = async () => {
            const imagePromises = testimonialImages.map((src) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = src;
                });
            });

            try {
                await Promise.all(imagePromises);
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to load some images');
                setIsLoaded(true);
            }
        };

        preloadImages();
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        // Set initial background
        if (background1Ref.current) {
            background1Ref.current.style.backgroundImage = `url(${testimonialImages[0]})`;
            gsap.set(background1Ref.current, { opacity: 1 });
            gsap.set(background2Ref.current, { opacity: 0 });
        }

        // Start auto-changing images every 2 seconds
        intervalRef.current = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialImages.length);
        }, 2000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isLoaded, testimonialImages.length]);

    useEffect(() => {
        if (!isLoaded || !background1Ref.current || !background2Ref.current) return;

        const currentImage = testimonialImages[currentIndex];

        // Determine which background to update
        const nextBackground = activeBackground === 1 ? background2Ref.current : background1Ref.current;
        const currentBackground = activeBackground === 1 ? background1Ref.current : background2Ref.current;

        // Set the new background image
        nextBackground.style.backgroundImage = `url(${currentImage})`;

        // Create smooth crossfade animation
        const tl = gsap.timeline({
            onComplete: () => {
                setActiveBackground(activeBackground === 1 ? 2 : 1);
            },
        });

        tl.to(nextBackground, {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut',
        }).to(
            currentBackground,
            {
                opacity: 0,
                duration: 1,
                ease: 'power2.inOut',
            },
            '<',
        );
    }, [currentIndex, isLoaded, activeBackground]);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative overflow-hidden py-12 sm:py-16 md:py-20">
            {/* Main background container */}
            <div
                ref={containerRef}
                className="relative mx-auto h-64 w-full max-w-6xl overflow-hidden rounded-3xl shadow-2xl sm:h-80 md:h-96 lg:h-[32rem]"
            >
                {/* Background image layers for crossfade */}
                <div
                    ref={background1Ref}
                    className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 1,
                    }}
                />
                <div
                    ref={background2Ref}
                    className="absolute inset-0 h-full w-full transition-opacity duration-1000 ease-in-out"
                    style={{
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        opacity: 0,
                    }}
                />

                {/* Loading state */}
                {!isLoaded && (
                    <div
                        className={`absolute inset-0 z-30 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} animate-pulse`}
                    >
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex space-x-2">
                                <div className={`h-3 w-3 animate-bounce rounded-full ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
                                <div
                                    className={`h-3 w-3 animate-bounce rounded-full ${darkMode ? 'bg-purple-400' : 'bg-purple-600'}`}
                                    style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                    className={`h-3 w-3 animate-bounce rounded-full ${darkMode ? 'bg-emerald-400' : 'bg-emerald-600'}`}
                                    style={{ animationDelay: '0.2s' }}
                                ></div>
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading testimonials...</p>
                        </div>
                    </div>
                )}

                {/* Multiple overlay layers for smooth fading effect */}
                <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-blue-900/30 via-transparent to-purple-900/30 mix-blend-overlay"></div>
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-black/10 to-transparent"></div>

                {/* Content overlay */}
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-10 lg:p-12">
                    {/* Top section */}
                    <div className="flex items-start justify-between">
                        {/* Live indicator with fade animation */}
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-md">
                            <div className="relative">
                                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                                <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-emerald-400 opacity-75"></div>
                            </div>
                            <span className="text-sm font-medium text-white drop-shadow-sm">Live Testimonial</span>
                        </div>

                        {/* Image counter with fade */}
                        <div className="rounded-full border border-white/30 bg-black/40 px-4 py-2 shadow-lg backdrop-blur-md">
                            <span className="text-sm font-medium text-white drop-shadow-sm">
                                {currentIndex + 1} / {testimonialImages.length}
                            </span>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className="text-center">
                        <h2 className="mb-4 text-2xl font-bold text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
                            <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                                Client Success Stories
                            </span>
                        </h2>
                        <p className="mx-auto mb-6 max-w-2xl rounded-lg bg-black/20 p-3 text-sm text-white/90 drop-shadow-md backdrop-blur-sm sm:text-base md:text-lg">
                            Real testimonials from satisfied clients showcasing successful project deliveries
                        </p>

                        {/* Progress indicators with smooth hover effects */}
                        <div className="flex justify-center space-x-3">
                            {testimonialImages.map((_, index) => (
                                <button
                                    key={index}
                                    className={`relative h-3 w-3 transform rounded-full transition-all duration-500 hover:scale-125 focus:ring-2 focus:ring-white/50 focus:outline-none ${
                                        index === currentIndex ? 'scale-125 bg-white shadow-lg' : 'bg-white/40 hover:bg-white/70'
                                    }`}
                                    onClick={() => handleDotClick(index)}
                                >
                                    {index === currentIndex && <div className="absolute inset-0 animate-ping rounded-full bg-white opacity-75"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Animated progress bar */}
                <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/20">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 shadow-lg transition-all duration-2000 ease-linear"
                        style={{
                            width: `${((currentIndex + 1) / testimonialImages.length) * 100}%`,
                            boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                        }}
                    ></div>
                </div>

                {/* Subtle vignette effect */}
                <div className="bg-radial-gradient absolute inset-0 z-10 from-transparent via-transparent to-black/20"></div>
            </div>

            {/* Bottom info with fade effect */}
            <div className="mt-6 text-center sm:mt-8">
                <div className="inline-flex items-center gap-3 rounded-full border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-emerald-500/10 px-6 py-3 shadow-lg backdrop-blur-sm">
                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Smooth transitions every 2 seconds • Click dots to navigate
                    </span>
                </div>
            </div>

            {/* Enhanced background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div
                    className={`absolute -top-32 -right-32 h-64 w-64 rounded-full blur-3xl ${
                        darkMode ? 'bg-blue-500/8' : 'bg-blue-500/4'
                    } animate-pulse opacity-60`}
                ></div>
                <div
                    className={`absolute -bottom-32 -left-32 h-64 w-64 rounded-full blur-3xl ${
                        darkMode ? 'bg-purple-500/8' : 'bg-purple-500/4'
                    } animate-pulse opacity-60`}
                    style={{ animationDelay: '1s' }}
                ></div>
                <div
                    className={`absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full blur-3xl ${
                        darkMode ? 'bg-emerald-500/5' : 'bg-emerald-500/3'
                    } animate-pulse opacity-40`}
                    style={{ animationDelay: '2s' }}
                ></div>
            </div>
        </div>
    );
};

export default TestimonialSlider;
