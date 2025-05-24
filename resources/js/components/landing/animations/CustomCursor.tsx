import gsap from 'gsap';
import { useEffect, useRef } from 'react';

interface CustomCursorProps {
    darkMode: boolean;
}

const CustomCursor = ({ darkMode }: CustomCursorProps) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const cursorDot = cursorDotRef.current;

        if (!cursor || !cursorDot) return;

        // Set initial position off-screen
        gsap.set(cursor, { x: -100, y: -100, xPercent: -50, yPercent: -50 });
        gsap.set(cursorDot, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

        // Variables for mouse position
        let mouseX = -100;
        let mouseY = -100;
        let prevMouseX = -100;
        let prevMouseY = -100;

        // Update cursor position with lerp for smooth movement
        gsap.ticker.add(() => {
            // Calculate velocity for scaling effect
            const deltaX = Math.abs(mouseX - prevMouseX);
            const deltaY = Math.abs(mouseY - prevMouseY);
            const velocity = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.5, 10);

            // Apply smooth movement to cursor
            const speed = 0.15;
            const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());

            prevMouseX = gsap.utils.interpolate(prevMouseX, mouseX, dt);
            prevMouseY = gsap.utils.interpolate(prevMouseY, mouseY, dt);

            // Set cursor position with lag
            gsap.set(cursor, {
                x: prevMouseX,
                y: prevMouseY,
                scale: 1 + velocity * 0.05,
            });

            // Set dot position immediately
            gsap.set(cursorDot, { x: mouseX, y: mouseY });
        });

        // Track mouse position
        const trackMouse = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        // Handle hover states
        const handleMouseEnter = () => {
            gsap.to(cursor, { scale: 1.5, opacity: 0.6, duration: 0.3 });
            gsap.to(cursorDot, { scale: 0.5, opacity: 0.6, duration: 0.3 });
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 });
            gsap.to(cursorDot, { scale: 1, opacity: 1, duration: 0.3 });
        };

        // Add event listeners
        window.addEventListener('mousemove', trackMouse);

        // Add hover effect for all clickable elements
        const clickables = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
        clickables.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', trackMouse);
            clickables.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            gsap.ticker.remove(() => {});
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className={`pointer-events-none fixed top-0 left-0 z-50 h-6 w-6 rounded-full ${
                    darkMode ? 'bg-white/20 backdrop-blur-sm' : 'bg-black/20 backdrop-blur-sm'
                } hidden mix-blend-difference sm:block`}
            ></div>
            <div
                ref={cursorDotRef}
                className={`pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 rounded-full ${
                    darkMode ? 'bg-white' : 'bg-black'
                } hidden mix-blend-difference sm:block`}
            ></div>
        </>
    );
};

export default CustomCursor;
