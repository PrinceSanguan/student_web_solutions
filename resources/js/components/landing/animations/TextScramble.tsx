import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins if not already registered
gsap.registerPlugin(ScrollTrigger);

interface TextScrambleProps {
    text: string;
    className: string;
}

const TextScramble = ({ text, className }: TextScrambleProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        if (!textRef.current) return;

        // Create timeline for text scramble effect
        gsap.timeline({
            scrollTrigger: {
                trigger: textRef.current,
                start: 'top 90%',
                once: true
            }
        });

        // Characters to use for scramble effect
        const chars = '!<>-_\\/[]{}—=+*^?#________';
        let frame = 0;
        const frameRate = 25;
        const duration = 2;
        const frames = duration * frameRate;

        // Scramble effect function
        const scramble = () => {
            if (frame >= frames) {
                setDisplayText(text);
                return;
            }

            const progress = frame / frames;

            // Calculate how many characters should be revealed
            const revealLength = Math.floor(text.length * progress);

            // Build the output text
            let output = '';
            for (let i = 0; i < text.length; i++) {
                if (text[i] === ' ') {
                    output += ' ';
                    continue;
                }

                if (i < revealLength) {
                    output += text[i];
                } else {
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }

            setDisplayText(output);
            frame++;

            // Request next frame
            setTimeout(scramble, 1000 / frameRate);
        };

        // Start scramble effect
        setTimeout(scramble, 500);

        return () => {
            // Cleanup
        };
    }, [text]);

    return (
        <div ref={textRef} className={className}>
            {displayText || text}
        </div>
    );
};

export default TextScramble;
