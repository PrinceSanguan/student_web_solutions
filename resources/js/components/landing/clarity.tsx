import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface ClarityProps {
    darkMode: boolean;
}

interface ClarityApiResponse {
    totalSessions: number;
    totalPageViews: number;
    uniqueUsers: number;
    bounceRate: number;
    avgSessionDuration: number;
    deviceData: Array<{
        dimension: string;
        sessions: number;
        pageViews: number;
    }>;
    dailyData: Array<{
        date: string;
        sessions: number;
        pageViews: number;
        users: number;
    }>;
    topPages: Array<{
        page: string;
        views: number;
    }>;
}

const Clarity = ({ darkMode }: ClarityProps) => {
    const [clarityData, setClarityData] = useState<ClarityApiResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClarityData = async () => {
            try {
                setLoading(true);

                // Call your Laravel backend route that fetches from Microsoft Clarity API
                const response = await fetch('/api/clarity-analytics', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();

                if (data.success) {
                    setClarityData(data.data);
                } else {
                    throw new Error(data.message || 'Failed to fetch analytics data');
                }
            } catch (err) {
                console.error('Error fetching Clarity data:', err);
                setError(err instanceof Error ? err.message : 'Failed to load analytics data');
            } finally {
                setLoading(false);
            }
        };

        fetchClarityData();
    }, []);

    if (loading) {
        return (
            <section className="mb-16 scroll-mt-20">
                <div className="text-center">
                    <div
                        className={`inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    ></div>
                    <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading Microsoft Clarity analytics...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mb-16 scroll-mt-20">
                <div className={`rounded-xl p-6 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="mb-2 text-red-500">⚠️ Analytics Unavailable</div>
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
                </div>
            </section>
        );
    }

    if (!clarityData) {
        return (
            <section className="mb-16 scroll-mt-20">
                <div className={`rounded-xl p-6 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>No analytics data available at the moment.</p>
                </div>
            </section>
        );
    }

    // Process device data for pie chart
    const deviceChartData = clarityData.deviceData.map((item, index) => ({
        name: item.dimension,
        value: item.sessions,
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5],
    }));

    // Format session duration
    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <section id="clarity" className="mb-16 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-8 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Microsoft Clarity Analytics
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
                        Real-time website performance data from Microsoft Clarity API
                    </p>
                </div>

                {/* Key Metrics Cards */}
                <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className={`rounded-xl p-4 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-blue-500">{clarityData.totalSessions.toLocaleString()}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Sessions</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-green-500">{clarityData.totalPageViews.toLocaleString()}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Page Views</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-purple-500">{clarityData.uniqueUsers.toLocaleString()}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unique Users</div>
                    </div>
                    <div className={`rounded-xl p-4 text-center shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-orange-500">{formatDuration(clarityData.avgSessionDuration)}</div>
                        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. Session</div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Daily Performance Chart */}
                    <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="mb-4 text-lg font-semibold">Daily Performance Trend</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={clarityData.dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#eee'} />
                                    <XAxis
                                        dataKey="date"
                                        stroke={darkMode ? '#aaa' : '#666'}
                                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis stroke={darkMode ? '#aaa' : '#666'} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#333' : '#fff',
                                            color: darkMode ? '#fff' : '#333',
                                            border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                        }}
                                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                                    />
                                    <Area type="monotone" dataKey="sessions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                                    <Area type="monotone" dataKey="pageViews" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Device Distribution */}
                    <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="mb-4 text-lg font-semibold">Sessions by Device</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceChartData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                    >
                                        {deviceChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: darkMode ? '#333' : '#fff',
                                            color: darkMode ? '#fff' : '#333',
                                            border: darkMode ? '1px solid #555' : '1px solid #ddd',
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Top Pages */}
                {clarityData.topPages && clarityData.topPages.length > 0 && (
                    <div className={`mt-6 rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                        <h3 className="mb-4 text-lg font-semibold">Top Pages</h3>
                        <div className="space-y-3">
                            {clarityData.topPages.slice(0, 10).map((page, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className={`truncate text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        {page.page || 'Unknown Page'}
                                    </span>
                                    <span className="ml-4 font-medium">{page.views.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Device Performance Table */}
                <div className={`mt-6 rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <h3 className="mb-4 text-lg font-semibold">Device Performance Breakdown</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <th className="py-2 text-left">Device</th>
                                    <th className="py-2 text-right">Sessions</th>
                                    <th className="py-2 text-right">Page Views</th>
                                    <th className="py-2 text-right">Pages/Session</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clarityData.deviceData.map((device, index) => (
                                    <tr key={index} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <td className="py-2 font-medium">{device.dimension}</td>
                                        <td className="py-2 text-right">{device.sessions.toLocaleString()}</td>
                                        <td className="py-2 text-right">{device.pageViews.toLocaleString()}</td>
                                        <td className="py-2 text-right">
                                            {device.sessions > 0 ? (device.pageViews / device.sessions).toFixed(2) : '0.00'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Microsoft Clarity Tracking Script */}
                <script
                    type="text/javascript"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(c, l, a, r, i, t, y) {
                                c[a] = c[a] || function() {
                                    (c[a].q = c[a].q || []).push(arguments)
                                };
                                t = l.createElement(r);
                                t.async = 1;
                                t.src = "https://www.clarity.ms/tag/" + i;
                                y = l.getElementsByTagName(r)[0];
                                y.parentNode.insertBefore(t, y);
                            })(window, document, "clarity", "script", "rvk16k915r");
                        `,
                    }}
                />
            </motion.div>
        </section>
    );
};

export default Clarity;
