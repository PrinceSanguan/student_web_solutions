import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ParticleBackgroundProps {
    darkMode: boolean;
}

const ParticleBackground = ({ darkMode }: ParticleBackgroundProps) => {
    const particlesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = particlesRef.current;
        if (!container) return;

        // Clear any existing particles
        container.innerHTML = '';

        // Create particles
        const particleCount = window.innerWidth < 768 ? 30 : 60;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');

            // Random size, position, and animation delay
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = Math.random() * 20 + 10;
            const opacity = Math.random() * 0.5 + 0.1;

            // Apply styles
            particle.className = `absolute rounded-full ${darkMode ? 'bg-white' : 'bg-gray-800'} pointer-events-none`;
            Object.assign(particle.style, {
                width: `${size}px`,
                height: `${size}px`,
                left: `${posX}%`,
                top: `${posY}%`,
                opacity: String(opacity),
            });

            // Add to container
            container.appendChild(particle);

            // Animate with GSAP
            gsap.to(particle, {
                y: -100 - Math.random() * 100,
                x: (Math.random() - 0.5) * 40,
                opacity: 0,
                duration,
                delay,
                ease: 'none',
                repeat: -1,
                onRepeat: () => {
                    gsap.set(particle, {
                        y: 100 + Math.random() * 100,
                        x: (Math.random() - 0.5) * 40,
                        opacity
                    });
                }
            });
        }

        return () => {
            // Cleanup animations
            container.querySelectorAll('div').forEach((particle) => {
                gsap.killTweensOf(particle);
            });
        };
    }, [darkMode]);

    return (
        <div
            ref={particlesRef}
            className="fixed inset-0 -z-5 pointer-events-none overflow-hidden"
        ></div>
    );
};

export default ParticleBackground;
