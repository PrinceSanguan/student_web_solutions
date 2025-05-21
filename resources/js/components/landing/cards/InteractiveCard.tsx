import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface InteractiveCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    darkMode: boolean;
}

const InteractiveCard = ({ title, description, icon, darkMode }: InteractiveCardProps) => {
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const card = cardRef.current;
        if (!card) return;

        // Create hover animation
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -10,
                boxShadow: darkMode
                    ? '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
                    : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: darkMode
                    ? '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)'
                    : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        return () => {
            card.removeEventListener('mouseenter', () => {});
            card.removeEventListener('mouseleave', () => {});
        };
    }, [darkMode]);

    return (
        <div
            ref={cardRef}
            className={`rounded-lg p-6 transition-all duration-300 ${
                darkMode
                    ? 'bg-gray-800/70 shadow-lg shadow-black/50'
                    : 'bg-white/90 shadow-lg shadow-black/5'
            }`}
        >
            <div className="mb-4 text-blue-600 dark:text-blue-400">{icon}</div>
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
    );
};

export default InteractiveCard;
