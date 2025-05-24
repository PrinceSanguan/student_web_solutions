import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface IntroVideoProps {
    onVideoComplete: () => void;
}

const IntroVideo = ({ onVideoComplete }: IntroVideoProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => window.removeEventListener('resize', checkIsMobile);
    }, []);

    // Handle video ended event
    const handleVideoEnded = () => {
        // Mark video as watched in localStorage
        localStorage.setItem('introVideoWatched', 'true');

        // Animate out the intro container
        gsap.to(containerRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: onVideoComplete,
        });

        setIsPlaying(false);
    };

    // Handle video play/pause events
    const handleVideoPlay = () => {
        setIsPlaying(true);
    };

    const handleVideoPause = () => {
        setIsPlaying(false);
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            videoElement.addEventListener('play', handleVideoPlay);
            videoElement.addEventListener('pause', handleVideoPause);

            // Animate in the intro container
            gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });

            return () => {
                videoElement.removeEventListener('play', handleVideoPlay);
                videoElement.removeEventListener('pause', handleVideoPause);
            };
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-50 flex flex-col items-center ${
                isPlaying && !isMobile ? 'justify-center' : 'justify-start'
            } overflow-y-auto bg-black px-4 py-8 sm:justify-center sm:p-6 md:p-8`}
        >
            {/* Welcome message - visible when video is not playing */}
            <div
                className={`mb-6 w-full max-w-sm rounded-lg border-2 border-green-600 bg-black p-4 text-center ${isPlaying ? 'hidden' : 'block'} sm:mb-8 sm:max-w-md md:mb-10 md:max-w-lg`}
            >
                <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">Welcome to Student Web Solutions</h2>
                <p className="mt-2 text-sm text-white sm:text-base md:text-lg">
                    Please watch our promotional video to continue to the website.
                    <br />
                    <span className="font-semibold">Click the video to play.</span>
                </p>
            </div>

            {/* Video container - portrait orientation when playing */}
            <div className={`${isPlaying ? (isMobile ? 'w-full max-w-xs' : 'fixed inset-0 z-50') : 'w-full max-w-sm'} sm:max-w-md md:max-w-lg`}>
                <div
                    className={`relative overflow-hidden rounded-lg bg-black ${
                        isPlaying ? (isMobile ? 'pb-[177.78%]' : 'h-screen w-screen') : 'pb-[56.25%]'
                    } shadow-xl`}
                >
                    <video
                        ref={videoRef}
                        className={`absolute top-0 left-0 h-full w-full ${isPlaying && !isMobile ? 'object-cover' : 'object-contain'}`}
                        onEnded={handleVideoEnded}
                        controls={true}
                        playsInline
                        poster="/assets/images/logo.png"
                        preload="auto"
                    >
                        <source src={isMobile ? '/assets/videos/promotion.mp4' : '/assets/videos/promotion-desktop.mp4'} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    );
};

export default IntroVideo;
