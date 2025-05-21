import ChatBot from '@/components/landing/chat-bot';
import Footer from '@/components/landing/footer';
import { Project, ProjectCard, ProjectDetailModal, projects } from '@/components/landing/project';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import Pusher from 'pusher-js';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Visitor data interface
interface VisitorData {
    date: string;
    visitors: number;
}

// New interfaces for enhanced analytics
interface DeviceData {
    name: string;
    value: number;
}

interface LocationData {
    country: string;
    visitors: number;
}

interface ConversionData {
    date: string;
    views: number;
    inquiries: number;
    conversions: number;
}

interface PageBreakdown {
    page_visited: string;
    count: number;
}

interface ActiveUsersData {
    count: number;
    breakdown: PageBreakdown[];
}

interface WelcomeProps {
    dailyVisitors: number;
    monthlyVisitors: number;
    dailyVisitorsData: VisitorData[];
    monthlyVisitorsData: VisitorData[];
    geographicalDistribution: LocationData[];
    activeUsers: ActiveUsersData;
}

const ParallaxBackground = () => {
    const [scrollY, setScrollY] = useState(0);
    const [mouseX, setMouseX] = useState(0);
    const [mouseY, setMouseY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        const handleMouseMove = (e: { clientX: number; clientY: number }) => {
            setMouseX(e.clientX / window.innerWidth);
            setMouseY(e.clientY / window.innerHeight);
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 h-screen w-full overflow-hidden">
            <div
                className="absolute inset-0 h-[120%] w-full bg-cover bg-center"
                style={{
                    backgroundImage: "url('/assets/images/background.sws.png')",
                    transform: `translateY(-${scrollY * 0.5}px) translateX(${(mouseX - 0.5) * -10}px) translateY(${(mouseY - 0.5) * -10}px)`,
                    filter: 'brightness(0.7)',
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/70" />
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)',
                }}
            />
        </div>
    );
};

// Original visitor stats card
const VisitorStatsCard = ({ title, count, data, darkMode }: { title: string; count: number; data: VisitorData[]; darkMode: boolean }) => {
    return (
        <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-medium">{title}</h3>
                <span className="text-2xl font-bold text-blue-500">{count}</span>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    {title.includes('Today') ? (
                        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                            <XAxis dataKey="date" stroke={darkMode ? '#aaa' : '#666'} />
                            <YAxis stroke={darkMode ? '#aaa' : '#666'} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#333' : '#fff',
                                    color: darkMode ? '#fff' : '#333',
                                    border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                }}
                            />
                            <Line type="monotone" dataKey="visitors" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                    ) : (
                        <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                            <XAxis dataKey="date" stroke={darkMode ? '#aaa' : '#666'} />
                            <YAxis stroke={darkMode ? '#aaa' : '#666'} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: darkMode ? '#333' : '#fff',
                                    color: darkMode ? '#fff' : '#333',
                                    border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                }}
                            />
                            <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// New geographical distribution card
const GeographicalDistributionCard = ({ darkMode, data }: { darkMode: boolean; data: LocationData[] }) => {
    return (
        <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-medium">Geographical Distribution</h3>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                    Top 3 Countries
                </span>
            </div>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data} margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                        <XAxis type="number" stroke={darkMode ? '#aaa' : '#666'} />
                        <YAxis dataKey="country" type="category" stroke={darkMode ? '#aaa' : '#666'} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#333' : '#fff',
                                color: darkMode ? '#fff' : '#333',
                                border: darkMode ? '1px solid #555' : '1px solid #ddd',
                            }}
                        />
                        <Bar dataKey="visitors" fill="#00C49F" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const Welcome = (props: WelcomeProps) => {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    // Use data from backend props
    const [todayVisitors, setTodayVisitors] = useState(props.dailyVisitors || 0);
    const [monthVisitors, setMonthVisitors] = useState(props.monthlyVisitors || 0);
    const [dailyVisitorData, setDailyVisitorData] = useState<VisitorData[]>(props.dailyVisitorsData || []);
    const [monthlyVisitorData, setMonthlyVisitorData] = useState<VisitorData[]>(props.monthlyVisitorsData || []);
    const [locationData, setLocationData] = useState<LocationData[]>(props.geographicalDistribution || []);
    const [activeUsers, setActiveUsers] = useState(props.activeUsers?.count || 0);
    const [activeUsersBreakdown, setActiveUsersBreakdown] = useState(props.activeUsers?.breakdown || []);
    const [activeTab, setActiveTab] = useState('overview'); // For analytics tabs

    // Check system preference for dark mode on load
    useEffect(() => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(isDarkMode);
    }, []);

    // Add Pusher integration for real-time updates
    useEffect(() => {
        // Initialize Pusher
        const pusher = new Pusher('5ccdc1968f9495836d5e', {
            cluster: 'mt1',
            forceTLS: true,
        });

        // Subscribe to the visitor channel
        const channel = pusher.subscribe('visitor-channel');

        // Update active users when new visitor arrives
        channel.bind('new-visitor', function (data: any) {
            // Increment active users count
            setActiveUsers((prevCount) => prevCount + 1);

            // Update page breakdown
            const path = data.path;
            setActiveUsersBreakdown((prevBreakdown) => {
                // Create a copy and update
                const updated = [...prevBreakdown];
                const existingIndex = updated.findIndex((item) => item.page_visited === path);

                if (existingIndex >= 0) {
                    updated[existingIndex].count++;
                } else if (updated.length < 3) {
                    updated.push({ page_visited: path, count: 1 });
                }

                return updated;
            });
        });

        // Clean up on component unmount
        return () => {
            pusher.unsubscribe('visitor-channel');
        };
    }, []);

    // Toggle dark mode function
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <>
            <Head title="Student Web Solutions | Professional Web Development">
                <meta name="description" content="Professional web development solutions by Student Web Solutions." />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div
                className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} relative transition-colors duration-300`}
            >
                <ParallaxBackground />

                {/* Enhanced Header */}
                <header className="sticky top-0 z-40 w-full bg-white/70 px-4 py-4 shadow-sm backdrop-blur-md sm:px-6 lg:px-8 dark:bg-gray-900/70">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/images/sws.png"
                                alt="Student Web Solutions Logo"
                                className="h-10 w-10 rounded-full shadow-md sm:h-12 sm:w-12"
                            />
                            <div>
                                <h1 className="text-lg font-bold sm:text-xl">Student Web Solutions</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Professional Web Development</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleDarkMode}
                                className={`rounded-full p-2 ${
                                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'
                                } transition-colors`}
                                aria-label="Toggle dark mode"
                            >
                                {darkMode ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Hero Section */}
                    <section className="mb-16 text-center">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                                Our Portfolio
                            </h2>
                            <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                                Explore our showcase projects. Click to learn more and access test credentials.
                            </p>
                        </motion.div>
                    </section>

                    {/* Project Showcase */}
                    <section className="mb-24">
                        <div className="mx-auto max-w-6xl">
                            {/* Projects will be rendered here through ProjectsContainer component */}
                            <div className="container mx-auto px-4 py-12">
                                {/* Capstone Projects */}
                                <div className="mb-16">
                                    <div className="mb-6 flex items-center">
                                        <h2 className="text-3xl font-bold">Capstone Projects</h2>
                                        <div className="ml-4 flex-grow border-b-4 border-blue-500 dark:border-blue-400"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        {projects
                                            .filter((project) => project.category === 'capstone')
                                            .map((project) => (
                                                <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                            ))}
                                    </div>
                                </div>

                                {/* Client Websites */}
                                <div className="mb-12">
                                    <div className="mb-6 flex items-center">
                                        <h2 className="text-3xl font-bold">Client Websites</h2>
                                        <div className="ml-4 flex-grow border-b-4 border-green-500 dark:border-green-400"></div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                        {projects
                                            .filter((project) => project.category === 'client')
                                            .map((project) => (
                                                <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Analytics Dashboard Section */}
                    <section className="mb-16">
                        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <div className="mb-8 text-center">
                                <h2 className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                                    Our Analytics
                                </h2>
                                <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">Click on the cards for more details.</p>
                            </div>

                            {/* Analytics Cards Grid */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <VisitorStatsCard title="Unique Visitors Today" count={todayVisitors} data={dailyVisitorData} darkMode={darkMode} />
                                <VisitorStatsCard
                                    title="Unique Visitors This Month"
                                    count={monthVisitors}
                                    data={monthlyVisitorData}
                                    darkMode={darkMode}
                                />

                                <GeographicalDistributionCard darkMode={darkMode} data={locationData} />

                                <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Real-time Active Users</h3>
                                        <div className="flex items-center">
                                            <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                                            <span className="ml-1 text-sm">{activeUsers} Online</span>
                                        </div>
                                    </div>
                                    <div className="flex h-48 items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-5xl font-bold text-green-500">{activeUsers}</div>
                                            <p className="mt-2 text-gray-500 dark:text-gray-400">Users currently browsing the website</p>
                                            <div className="mt-4 flex justify-center gap-2">
                                                {activeUsersBreakdown &&
                                                    activeUsersBreakdown.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className={`rounded ${
                                                                index === 0
                                                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                                                    : index === 1
                                                                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                                                            } px-2 py-1 text-xs`}
                                                        >
                                                            {item.page_visited}: {item.count}
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </section>
                </main>

                {/* Enhanced Footer */}
                <Footer darkMode={darkMode} />
            </div>

            {/* Project Detail Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} darkMode={darkMode} className="z-30" />
                )}
            </AnimatePresence>

            {/* Chat Bot */}
            <ChatBot darkMode={darkMode} />
        </>
    );
};

export default Welcome;
