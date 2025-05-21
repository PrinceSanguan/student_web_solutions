import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins if not already registered
gsap.registerPlugin(ScrollTrigger);

const SmoothScrollSection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Horizontal text movement on scroll
        gsap.to(textRef.current, {
            xPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    }, []);

    return (
        <div ref={sectionRef} className="relative my-24 overflow-hidden py-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 dark:from-blue-900/20 dark:to-purple-900/20"></div>
            <div ref={textRef} className="whitespace-nowrap py-8 text-6xl font-black uppercase tracking-tight opacity-80 md:text-8xl lg:text-9xl">
                <span className="mr-8 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Professional</span>
                <span className="mr-8 bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">Creative</span>
                <span className="mr-8 bg-gradient-to-r from-green-600 to-teal-400 bg-clip-text text-transparent">Innovative</span>
                <span className="mr-8 bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">Responsive</span>
                <span className="mr-8 bg-gradient-to-r from-purple-600 to-pink-400 bg-clip-text text-transparent">Professional</span>
            </div>
        </div>
    );
};

export default SmoothScrollSection;
