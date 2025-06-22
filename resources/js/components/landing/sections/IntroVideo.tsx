import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

interface IntroVideoProps {
    onVideoComplete: () => void;
}

const IntroVideo = ({ onVideoComplete }: IntroVideoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoComplete = () => {
        localStorage.setItem('introVideoWatched', 'true');

        gsap.to(containerRef.current, {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: onVideoComplete,
        });
    };

    const handlePlayClick = () => {
        setIsPlaying(true);
        // Auto complete after video duration (adjust time as needed)
        setTimeout(handleVideoComplete, 60000); // 1 minute
    };

    useEffect(() => {
        gsap.fromTo(containerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
    }, []);

    return (
        <div
            ref={containerRef}
            className={`fixed inset-0 z-50 flex flex-col items-center ${
                isPlaying ? 'justify-center' : 'justify-start'
            } overflow-y-auto bg-black px-4 py-8 sm:justify-center sm:p-6 md:p-8`}
        >
            {!isPlaying && (
                <div className="mb-6 w-full max-w-sm rounded-lg border-2 border-green-600 bg-black p-4 text-center sm:mb-8 sm:max-w-md md:mb-10 md:max-w-lg">
                    <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">Welcome to Student Web Solutions</h2>
                    <p className="mt-2 text-sm text-white sm:text-base md:text-lg">
                        Please watch our promotional video to continue to the website.
                        <br />
                        <span className="font-semibold">Click play to start.</span>
                    </p>
                    <button onClick={handlePlayClick} className="mt-4 rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                        Play Video
                    </button>
                </div>
            )}

            {isPlaying && (
                <div className="w-full max-w-4xl">
                    <div className="relative overflow-hidden rounded-lg bg-black pb-[56.25%] shadow-xl">
                        <iframe
                            src="https://www.youtube.com/embed/lU56fBfBpvY?autoplay=1&mute=0&rel=0&modestbranding=1"
                            className="absolute top-0 left-0 h-full w-full"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            frameBorder="0"
                        />
                    </div>
                    <button onClick={handleVideoComplete} className="mt-4 w-full rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700">
                        Continue to Website
                    </button>
                </div>
            )}
        </div>
    );
};

export default IntroVideo;
