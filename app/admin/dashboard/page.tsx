import type { Metadata } from 'next';
import Link from 'next/link';

import { FlashBanner } from '@/components/admin/flash-banner';
import { requireAdmin } from '@/lib/auth/require-admin';
import { flashMessage } from '@/lib/flash';
import { routes } from '@/lib/routes';
import { stats } from '@/lib/store/capstones';

export const metadata: Metadata = { title: 'Dashboard' };

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
    return (
        <div className={`rounded-2xl border p-5 ${color}`}>
            <p className="text-xs font-semibold tracking-wider uppercase opacity-70">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
            {sub && <p className="mt-0.5 text-xs opacity-60">{sub}</p>}
        </div>
    );
}

/** Ported from `pages/Admin/Dashboard.tsx` + `Admin\DashboardController`. */
export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
    const [admin, counts, { flash }] = await Promise.all([requireAdmin(), stats(), searchParams]);

    return (
        <>
            <FlashBanner message={flashMessage(flash)} />

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {admin.name}</p>
            </div>

            {/* Stats grid */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Projects" value={counts.total} color="border-gray-200 bg-white text-gray-800" />
                <StatCard
                    label="Listed"
                    value={counts.available}
                    sub="visible in public catalog"
                    color="border-green-200 bg-green-50 text-green-800"
                />
                <StatCard label="Unlisted" value={counts.unlisted} sub="hidden from catalog" color="border-gray-200 bg-gray-50 text-gray-700" />
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <h2 className="mb-4 font-semibold text-gray-800">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <Link
                        href={routes.admin.capstones.create}
                        className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                        <span className="text-lg">➕</span>
                        Add New Project
                    </Link>
                    <Link
                        href={routes.admin.capstones.index}
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        <span className="text-lg">📂</span>
                        Manage Projects
                    </Link>
                    <Link
                        href={routes.capstone.index}
                        target="_blank"
                        className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                    >
                        <span className="text-lg">🌐</span>
                        View Public Catalog
                    </Link>
                </div>
            </div>
        </>
    );
}
