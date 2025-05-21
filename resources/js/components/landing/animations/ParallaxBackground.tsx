import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins if not already registered
gsap.registerPlugin(ScrollTrigger);

const ParallaxBackground = () => {
    const backgroundRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            setMouseX(e.clientX / window.innerWidth);
            setMouseY(e.clientY / window.innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    useEffect(() => {
        // Create parallax effect on scroll
        gsap.to(backgroundRef.current, {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 0.5
            }
        });

        // Fade in overlay on scroll
        gsap.fromTo(overlayRef.current,
            { opacity: 0.4 },
            {
                opacity: 0.8,
                scrollTrigger: {
                    trigger: "body",
                    start: "20% top",
                    end: "50% center",
                    scrub: true
                }
            }
        );
    }, []);

    return (
        <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
            <div
                ref={backgroundRef}
                className="absolute inset-0 h-[120%] w-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/images/background.sws.png')",
                    transform: `translateX(${(mouseX - 0.5) * -10}px) translateY(${(mouseY - 0.5) * -10}px)`,
                    filter: 'brightness(0.7)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/70" />
            <div
                ref={overlayRef}
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                }}
            />
        </div>
    );
};

export default ParallaxBackground;
