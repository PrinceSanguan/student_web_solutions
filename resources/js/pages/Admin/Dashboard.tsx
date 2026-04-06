import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Link } from '@inertiajs/react';

interface User { name: string; email: string; }

interface Stats {
    total_projects: number;
    available: number;
    sold: number;
    total_orders: number;
    paid_orders: number;
    pending_orders: number;
    total_revenue: number;
}

interface RecentOrder {
    reference: string;
    customer_name: string;
    capstone_title: string | null;
    amount: number;
    paid_at: string;
}

interface Props {
    user: User;
    stats: Stats;
    recentOrders: RecentOrder[];
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className={`rounded-2xl border p-5 ${color}`}>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-70">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {sub && <p className="mt-0.5 text-xs opacity-60">{sub}</p>}
        </div>
    );
}

export default function AdminDashboard({ user, stats, recentOrders }: Props) {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar user={user} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
                    </div>

                    {/* Stats grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard
                            label="Total Projects"
                            value={stats.total_projects}
                            sub={`${stats.available} available · ${stats.sold} sold`}
                            color="border-gray-200 bg-white text-gray-800"
                        />
                        <StatCard
                            label="Revenue"
                            value={`₱${Number(stats.total_revenue).toLocaleString()}`}
                            sub="from paid orders"
                            color="border-green-200 bg-green-50 text-green-800"
                        />
                        <StatCard
                            label="Paid Orders"
                            value={stats.paid_orders}
                            color="border-blue-200 bg-blue-50 text-blue-800"
                        />
                        <StatCard
                            label="Pending"
                            value={stats.pending_orders}
                            color="border-yellow-200 bg-yellow-50 text-yellow-800"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Recent sales */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-800">Recent Sales</h2>
                                <Link href={route('admin.capstones.index')} className="text-xs text-blue-500 hover:underline">
                                    View all
                                </Link>
                            </div>
                            {recentOrders.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">No paid orders yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((o) => (
                                        <div key={o.reference} className="flex items-center justify-between text-sm">
                                            <div>
                                                <p className="font-medium text-gray-800">{o.customer_name}</p>
                                                <p className="text-xs text-gray-400">{o.capstone_title} · {o.paid_at}</p>
                                            </div>
                                            <span className="font-semibold text-green-600">₱{Number(o.amount).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick actions */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <h2 className="mb-4 font-semibold text-gray-800">Quick Actions</h2>
                            <div className="space-y-3">
                                <Link
                                    href={route('admin.capstones.create')}
                                    className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                                >
                                    <span className="text-lg">➕</span>
                                    Add New Project
                                </Link>
                                <Link
                                    href={route('admin.capstones.index')}
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    <span className="text-lg">📂</span>
                                    Manage Projects
                                </Link>
                                <Link
                                    href={route('capstone.index')}
                                    target="_blank"
                                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                                >
                                    <span className="text-lg">🌐</span>
                                    View Public Catalog
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
