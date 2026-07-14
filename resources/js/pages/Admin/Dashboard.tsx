import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Link, usePage } from '@inertiajs/react';

interface User { name: string; email: string; }

interface Stats {
    total_projects: number;
    available: number;
    unlisted: number;
}

interface Props {
    user: User;
    stats: Stats;
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

export default function AdminDashboard({ user, stats }: Props) {
    const { props } = usePage<{ flash: { success?: string; error?: string } }>();
    const flash = props.flash;

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar user={user} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    {/* Flash messages */}
                    {flash?.success && (
                        <div className="mb-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
                    </div>

                    {/* Stats grid */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            label="Total Projects"
                            value={stats.total_projects}
                            color="border-gray-200 bg-white text-gray-800"
                        />
                        <StatCard
                            label="Listed"
                            value={stats.available}
                            sub="visible in public catalog"
                            color="border-green-200 bg-green-50 text-green-800"
                        />
                        <StatCard
                            label="Unlisted"
                            value={stats.unlisted}
                            sub="hidden from catalog"
                            color="border-gray-200 bg-gray-50 text-gray-700"
                        />
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <h2 className="mb-4 font-semibold text-gray-800">Quick Actions</h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                </main>
            </div>
        </div>
    );
}
