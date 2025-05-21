import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TiltCardProps {
    children: React.ReactNode;
    darkMode: boolean;
}

const TiltCard = ({ children, darkMode }: TiltCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // Track mouse position for tilt effect
        let bounds: DOMRect;
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (e: MouseEvent) => {
            bounds = card.getBoundingClientRect();
            mouseX = e.clientX;
            mouseY = e.clientY;

            const posX = mouseX - bounds.left;
            const posY = mouseY - bounds.top;

            // Calculate rotation values based on mouse position
            const rotateX = ((posY - bounds.height / 2) / bounds.height) * 10; // Max 10 degrees
            const rotateY = ((bounds.width / 2 - posX) / bounds.width) * 10; // Max 10 degrees

            // Apply rotation with GSAP
            gsap.to(card, {
                rotateX,
                rotateY,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out"
            });

            // Apply highlight effect
            const elems = card.querySelectorAll('.highlight');
            elems.forEach((elem) => {
                const boundingRect = (elem as HTMLElement).getBoundingClientRect();
                const elemX = boundingRect.left + boundingRect.width / 2;
                const elemY = boundingRect.top + boundingRect.height / 2;

                // Calculate distance from mouse to element center
                const distance = Math.sqrt(
                    Math.pow(mouseX - elemX, 2) + Math.pow(mouseY - elemY, 2)
                );

                // Apply opacity based on distance
                const maxDistance = 300;
                const opacity = Math.max(0, 1 - distance / maxDistance);

                gsap.to(elem, {
                    opacity: 0.8 + opacity * 0.2,
                    duration: 0.3
                });
            });
        };

        const handleMouseLeave = () => {
            // Reset rotation
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: "power2.out"
            });

            // Reset highlight effect
            const elems = card.querySelectorAll('.highlight');
            elems.forEach((elem) => {
                gsap.to(elem, { opacity: 0, duration: 0.5 });
            });
        };

        // Add event listeners
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className={`relative overflow-hidden rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-xl transition-transform`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            {/* Highlight effects */}
            <div className="highlight absolute left-0 top-0 -ml-32 -mt-32 h-64 w-64 rounded-full bg-blue-500/20 opacity-0 blur-3xl"></div>
            <div className="highlight absolute right-0 bottom-0 -mr-32 -mb-32 h-64 w-64 rounded-full bg-purple-500/20 opacity-0 blur-3xl"></div>

            {/* Actual content */}
            <div style={{ transform: 'translateZ(20px)' }}>
                {children}
            </div>
        </div>
    );
};

export default TiltCard;
