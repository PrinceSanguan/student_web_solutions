import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
    isTyping?: boolean;
}

interface ChatBotProps {
    darkMode: boolean;
}

const ChatBot = ({ darkMode }: ChatBotProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: "Hi there! 👋 I'm SWS AI Assistant. How can I help with your web development needs today?",
            sender: 'bot',
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const messageEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [minimized, setMinimized] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setMinimized(false);
    };

    const minimizeChat = () => {
        setMinimized(!minimized);
    };

    const handleSendMessage = async (text: string) => {
        if (text.trim() === '') return;

        // Add user message
        const userMessage: Message = {
            id: messages.length + 1,
            text: text,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages([...messages, userMessage]);
        setInputValue('');

        // Show typing indicator
        setIsTyping(true);

        try {
            // Use Inertia's router for the request (handles CSRF automatically)
            const response = await fetch('/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    message: text,
                    conversation: messages
                        .filter((msg) => !msg.isTyping)
                        .map((msg) => ({
                            role: msg.sender === 'user' ? 'user' : 'model',
                            parts: [{ text: msg.text }],
                        })),
                }),
            });

            if (response.status === 419) {
                // CSRF token mismatch
                const botMessage: Message = {
                    id: messages.length + 2,
                    text: 'Sorry, there was a security validation error. Please refresh the page and try again.',
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
                return;
            }

            const data = await response.json();

            if (response.status === 429) {
                // Rate limit exceeded
                const botMessage: Message = {
                    id: messages.length + 2,
                    text: `${data.message} You can send another message in ${data.retryAfter} seconds.`,
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else if (data.success) {
                const botMessage: Message = {
                    id: messages.length + 2,
                    text: data.message,
                    sender: 'bot',
                    timestamp: new Date(),
                };
                setMessages((prevMessages) => [...prevMessages, botMessage]);
            } else {
                throw new Error('Failed to get response');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: messages.length + 2,
                text: "Sorry, I'm having trouble connecting right now. Please try again later.",
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage(inputValue);
    };

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        // Focus input when chat is opened
        if (isOpen && !minimized) {
            inputRef.current?.focus();
        }
    }, [messages, isOpen, minimized]);

    useEffect(() => {
        // Existing code for scrolling and focusing
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });

        if (isOpen && !minimized) {
            inputRef.current?.focus();
        }

        // Add resize handler for responsiveness
        const handleResize = () => {
            // Force re-render on resize to update responsive styles
            setMessages([...messages]);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [messages, isOpen, minimized]);

    // Update the message area to be more responsive
    <div className={`flex-1 space-y-3 overflow-y-auto p-3 sm:space-y-4 sm:p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}></div>;

    return (
        <>
            {/* Chat Button - Pulsing effect when closed */}
            <motion.div
                className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 rounded-full bg-blue-400 opacity-75"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.3, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                    />
                )}
                <button
                    onClick={toggleChat}
                    className={`relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${
                        darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                    aria-label="Chat with our AI"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                    )}
                </button>
            </motion.div>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed right-6 bottom-24 z-40 w-full max-w-sm overflow-hidden rounded-xl shadow-2xl sm:right-6 sm:w-full"
                        style={{
                            width: typeof window !== 'undefined' && window.innerWidth < 640 ? 'calc(100vw - 48px)' : 'auto',
                            right: typeof window !== 'undefined' && window.innerWidth < 640 ? '24px' : '24px',
                            left: typeof window !== 'undefined' && window.innerWidth < 640 ? '24px' : 'auto',
                        }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    >
                        <div
                            className={`flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
                            style={{ height: minimized ? 'auto' : '450px' }}
                        >
                            {/* Chat Header */}
                            <div
                                className={`flex items-center justify-between p-4 ${
                                    darkMode ? 'bg-gradient-to-r from-blue-700 to-indigo-800' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                                } text-white`}
                            >
                                <div className="flex items-center">
                                    <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">SWS AI Assistant</h3>
                                        <div className="flex items-center text-xs">
                                            <span className="mr-1 inline-block h-2 w-2 rounded-full bg-green-400"></span>
                                            Online - AI Powered
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={minimizeChat} className="rounded p-1 hover:bg-white/10">
                                        {minimized ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                    <button onClick={toggleChat} className="rounded p-1 hover:bg-white/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {!minimized && (
                                <>
                                    {/* Messages */}
                                    <div className={`flex-1 space-y-4 overflow-y-auto p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                                        {messages.map((message) => (
                                            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                {message.sender === 'bot' && (
                                                    <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}

                                                <div
                                                    className={`max-w-[75%] rounded-2xl px-3 py-2 shadow sm:px-4 ${
                                                        message.sender === 'user'
                                                            ? darkMode
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-blue-500 text-white'
                                                            : darkMode
                                                              ? 'bg-gray-800 text-white'
                                                              : 'bg-white text-gray-800'
                                                    }`}
                                                >
                                                    <p className="text-xs break-words whitespace-pre-line sm:text-sm">{message.text}</p>
                                                    <p
                                                        className={`mt-1 text-right text-xs ${
                                                            message.sender === 'user' ? 'text-blue-200' : darkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>

                                                {message.sender === 'user' && (
                                                    <div className="ml-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-300 text-gray-700 shadow-md dark:bg-gray-700 dark:text-gray-300">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                            />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        ))}

                                        {/* Typing indicator */}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="mr-2 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                                    <div className="flex space-x-1">
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} animate-bounce`}
                                                            style={{ animationDelay: '0ms' }}
                                                        ></div>
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} animate-bounce`}
                                                            style={{ animationDelay: '150ms' }}
                                                        ></div>
                                                        <div
                                                            className={`h-2 w-2 rounded-full ${darkMode ? 'bg-gray-400' : 'bg-gray-400'} animate-bounce`}
                                                            style={{ animationDelay: '300ms' }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={messageEndRef} />
                                    </div>

                                    {/* Input Form */}
                                    <form
                                        onSubmit={handleSubmit}
                                        className={`border-t p-3 ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                placeholder="Ask me anything..."
                                                className={`flex-1 rounded-full px-3 py-2 text-sm focus:ring-2 focus:outline-none sm:px-4 sm:text-base ${
                                                    darkMode
                                                        ? 'bg-gray-700 text-white placeholder-gray-400 focus:ring-blue-600'
                                                        : 'bg-gray-100 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                                                }`}
                                            />
                                            <button
                                                type="submit"
                                                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${
                                                    darkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-500 text-white hover:bg-blue-600'
                                                }`}
                                                disabled={inputValue.trim() === ''}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {/* Footer - only shown when minimized is false */}
                            {!minimized && (
                                <div
                                    className={`border-t px-3 py-2 text-center text-xs ${
                                        darkMode ? 'border-gray-700 bg-gray-800 text-gray-400' : 'border-gray-200 text-gray-500'
                                    }`}
                                >
                                    Powered by Student Web Solutions AI
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
