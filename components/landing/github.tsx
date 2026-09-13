'use client';

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface GitHubStats {
    login: string;
    name: string;
    avatar_url: string;
    followers: number;
    following: number;
    public_repos: number;
    public_gists: number;
    created_at: string;
    updated_at: string;
    bio: string;
    location: string;
    blog: string;
    company: string;
}

const GitHub = () => {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const username = 'princesanguan';

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                setLoading(true);

                // Fetch user stats
                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                if (!userResponse.ok) throw new Error('Failed to fetch user data');
                const userData = await userResponse.json();
                setStats(userData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, []);

    const getYearsActive = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24 * 365));
    };

    if (loading) {
        return (
            <section className="mb-16 scroll-mt-20">
                <div className="text-center">
                    <div
                        className={`'text-white' : 'text-gray-900'} inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent`}
                    ></div>
                    <p className={`'text-gray-300' : 'text-gray-600'} mt-4`}>Loading GitHub data...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-16 scroll-mt-20">
                <div className="text-center">
                    <p className="text-red-500">Error loading GitHub data: {error}</p>
                </div>
            </section>
        );
    }

    if (!stats) return null;

    return (
        <section id="github" className="mb-16 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-8 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        GitHub Profile
                    </h2>
                    <p className={`'text-gray-300' : 'text-gray-600'} mx-auto max-w-2xl`}>
                        Active development and contributions across multiple projects
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Profile Card */}
                    <motion.div
                        className={`'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="flex flex-col items-center text-center">
                            <img src={stats.avatar_url} alt={stats.name} className="mb-4 h-20 w-20 rounded-full border-4 border-green-500" />
                            <h3 className="mb-2 text-xl font-bold">{stats.name}</h3>
                            <p className={`'text-gray-400' : 'text-gray-500'} mb-2 text-sm`}>@{stats.login}</p>
                            {stats.bio && <p className={`'text-gray-300' : 'text-gray-600'} mb-4 text-sm`}>{stats.bio}</p>}
                            <div className="flex w-full flex-wrap justify-center gap-4 text-sm">
                                {stats.location && (
                                    <div className="flex items-center gap-1">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{stats.location}</span>
                                    </div>
                                )}
                                {stats.company && (
                                    <div className="flex items-center gap-1">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                        </svg>
                                        <span>{stats.company}</span>
                                    </div>
                                )}
                            </div>
                            <a
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600' } mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors`}
                            >
                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                View Profile
                            </a>
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        className="lg:col-span-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        {/* GitHub Stats */}
                        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                            <div className={`'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow-lg`}>
                                <div className="text-2xl font-bold text-green-500">{stats.public_repos}</div>
                                <div className={`'text-gray-400' : 'text-gray-500'} text-sm`}>Repositories</div>
                            </div>
                            <div className={`'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow-lg`}>
                                <div className="text-2xl font-bold text-blue-500">{stats.followers}</div>
                                <div className={`'text-gray-400' : 'text-gray-500'} text-sm`}>Followers</div>
                            </div>
                            <div className={`'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow-lg`}>
                                <div className="text-2xl font-bold text-purple-500">{stats.following}</div>
                                <div className={`'text-gray-400' : 'text-gray-500'} text-sm`}>Following</div>
                            </div>
                            <div className={`'bg-gray-800' : 'bg-white'} rounded-lg p-4 text-center shadow-lg`}>
                                <div className="text-2xl font-bold text-orange-500">{getYearsActive(stats.created_at)}+</div>
                                <div className={`'text-gray-400' : 'text-gray-500'} text-sm`}>Years Active</div>
                            </div>
                        </div>

                        {/* Contribution Graph */}
                        <div className={`'bg-gray-800' : 'bg-white'} rounded-xl p-6 shadow-lg`}>
                            <h3 className="mb-4 text-lg font-semibold">Contribution Activity</h3>
                            <div className="w-full overflow-x-auto">
                                <img
                                    src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&bg_color=ffffff&color=0969da&line=0969da&point=0969da&area=true&hide_border=true`}
                                    alt="GitHub Contribution Graph"
                                    className="w-full rounded-lg"
                                    style={{ minWidth: '640px' }}
                                />
                            </div>
                            <p className={`'text-gray-400' : 'text-gray-500'} mt-3 text-center text-sm`}>
                                Consistent development activity throughout the year
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
};

export default GitHub;
