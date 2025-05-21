import { motion } from 'framer-motion';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Visitor data interface
interface VisitorData {
    date: string;
    visitors: number;
}

// Location data interface
interface LocationData {
    country: string;
    visitors: number;
}

interface AnalyticsProps {
    darkMode: boolean;
    dailyVisitors: number;
    monthlyVisitors: number;
    dailyVisitorsData: VisitorData[];
    monthlyVisitorsData: VisitorData[];
}

// Visitor stats card component
const VisitorStatsCard = ({ title, count, data, darkMode }: { title: string; count: number; data: VisitorData[]; darkMode: boolean }) => {
    return (
        <div className={`rounded-xl p-4 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} transition-all duration-300 hover:shadow-xl`}>
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

const Analytics = ({ darkMode, dailyVisitors, monthlyVisitors, dailyVisitorsData, monthlyVisitorsData }: AnalyticsProps) => {
    return (
        <section id="analytics" className="mb-16 scroll-mt-20">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-8 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Our Analytics
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">Site performance at a glance</p>
                </div>

                {/* Analytics Cards Grid */}
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                    <VisitorStatsCard title="Unique Visitors Today" count={dailyVisitors} data={dailyVisitorsData} darkMode={darkMode} />
                    <VisitorStatsCard title="Unique Visitors This Month" count={monthlyVisitors} data={monthlyVisitorsData} darkMode={darkMode} />
                </div>
            </motion.div>
        </section>
    );
};

export default Analytics;
