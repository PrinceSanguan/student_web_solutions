import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PageLoaderProps {
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const PageLoader = ({ isLoading, setIsLoading }: PageLoaderProps) => {
    const loaderRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate page loading
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15);

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);

                // Animate loader out
                const tl = gsap.timeline({
                    onComplete: () => {
                        setIsLoading(false);
                    }
                });

                tl.to(progressRef.current, {
                    width: '100%',
                    duration: 0.3,
                    ease: "power2.inOut"
                })
                .to(textRef.current, {
                    y: -20,
                    opacity: 0,
                    duration: 0.4,
                    ease: "power2.in"
                }, "-=0.1")
                .to(loaderRef.current, {
                    height: 0,
                    duration: 0.8,
                    ease: "power2.inOut"
                });
            }

            if (progressRef.current) {
                gsap.to(progressRef.current, {
                    width: `${progress}%`,
                    duration: 0.3,
                    ease: "power1.out"
                });
            }
        }, 200);

        return () => clearInterval(interval);
    }, [setIsLoading]);

    if (!isLoading) return null;

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-50 flex h-screen w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black"
        >
            <div className="mb-8 flex flex-col items-center">
                <img src="/assets/images/sws.png" alt="Logo" className="mb-4 h-16 w-16 rounded-full" />
                <div ref={textRef} className="text-center">
                    <h1 className="text-xl font-bold text-white md:text-2xl">Student Web Solutions</h1>
                    <p className="text-gray-400">Loading your experience...</p>
                </div>
            </div>

            <div className="h-1 w-64 rounded-full bg-gray-800 sm:w-96">
                <div
                    ref={progressRef}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                    style={{ width: '0%' }}
                ></div>
            </div>
        </div>
    );
};

export default PageLoader;
