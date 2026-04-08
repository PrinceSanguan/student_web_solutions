import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Link, usePage } from '@inertiajs/react';

interface User { name: string; email: string; }

interface Stats {
    total_projects: number;
    available: number;
    unlisted: number;
    total_orders: number;
    paid_orders: number;
    pending_orders: number;
    total_revenue: number;
}

interface PurchaseRecord {
    id: number;
    reference: string;
    customer_name: string;
    customer_email: string;
    capstone_title: string | null;
    amount: number;
    paid_at: string;
    email_sent_at: string | null;
}

interface Props {
    user: User;
    stats: Stats;
    allOrders: PurchaseRecord[];
    appUrl: string;
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

export default function AdminDashboard({ user, stats, allOrders, appUrl }: Props) {
    const { props } = usePage<{ flash: { success?: string; error?: string } }>();
    const flash = props.flash;

    const urlIsLocal = appUrl.includes('localhost') || appUrl.includes('127.0.0.1');

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

                    {urlIsLocal && (
                        <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
                            <p className="font-semibold">⚠️ APP_URL is set to localhost</p>
                            <p className="mt-1">
                                Purchase confirmation emails contain{' '}
                                <code className="rounded bg-orange-100 px-1 font-mono text-xs">{appUrl}/download/…</code>{' '}
                                as the download link. Update{' '}
                                <code className="rounded bg-orange-100 px-1 font-mono text-xs">APP_URL</code> in{' '}
                                <code className="rounded bg-orange-100 px-1 font-mono text-xs">.env</code> to your real domain.
                            </p>
                        </div>
                    )}

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
                        <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
                    </div>

                    {/* Stats grid */}
                    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard
                            label="Total Projects"
                            value={stats.total_projects}
                            sub={`${stats.available} active · ${stats.unlisted} unlisted`}
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

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Purchase table — spans 2 cols */}
                        <div className="col-span-1 overflow-x-auto rounded-2xl border border-gray-200 bg-white p-5 lg:col-span-2">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="font-semibold text-gray-800">All Purchases</h2>
                                <span className="text-xs text-gray-400">{allOrders.length} total</span>
                            </div>
                            {allOrders.length === 0 ? (
                                <p className="py-8 text-center text-sm text-gray-400">No paid orders yet.</p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                                            <th className="pb-3 pr-4">Reference</th>
                                            <th className="pb-3 pr-4">Customer</th>
                                            <th className="pb-3 pr-4">Project</th>
                                            <th className="pb-3 pr-4 text-right">Amount</th>
                                            <th className="pb-3 pr-4">Date</th>
                                            <th className="pb-3 text-center">Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allOrders.map((o) => (
                                            <tr key={o.reference} className="border-b border-gray-50 hover:bg-gray-50">
                                                <td className="py-3 pr-4 font-mono text-xs text-gray-600">{o.reference}</td>
                                                <td className="py-3 pr-4">
                                                    <p className="text-gray-700">{o.customer_name}</p>
                                                    <p className="text-xs text-gray-400">{o.customer_email}</p>
                                                </td>
                                                <td className="py-3 pr-4 text-gray-700">{o.capstone_title ?? '—'}</td>
                                                <td className="py-3 pr-4 text-right font-semibold text-green-600">
                                                    ₱{Number(o.amount).toLocaleString()}
                                                </td>
                                                <td className="py-3 pr-4 text-xs text-gray-500">
                                                    {new Date(o.paid_at).toLocaleString('en-PH', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="py-3 text-center">
                                                    {o.email_sent_at ? (
                                                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                                            ✓ Sent
                                                        </span>
                                                    ) : (
                                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
