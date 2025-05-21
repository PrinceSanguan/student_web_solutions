import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins if not already registered
gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    title: string;
    darkMode: boolean;
}

const AnimatedCounter = ({
    value,
    prefix = '',
    suffix = '',
    title,
    darkMode
}: AnimatedCounterProps) => {
    const counterRef = useRef<HTMLDivElement>(null);
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        const counter = counterRef.current;
        if (!counter) return;

        const updateValue = () => {
            setDisplayValue(Math.floor(gsap.getProperty(counter, "countNum") as number));
        };

        ScrollTrigger.create({
            trigger: counter,
            start: "top 85%",
            onEnter: () => {
                gsap.to(counter, {
                    countNum: value,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: updateValue
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [value]);

    return (
        <div
            ref={counterRef}
            className={`rounded-lg p-6 text-center ${
                darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}
            data-count-num={0}
        >
            <div className="text-3xl font-bold text-blue-600 md:text-4xl">
                {prefix}{displayValue.toLocaleString()}{suffix}
            </div>
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 md:text-base">{title}</div>
        </div>
    );
};

export default AnimatedCounter;
