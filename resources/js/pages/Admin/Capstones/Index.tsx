import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';

interface User { name: string; email: string; }

interface Capstone {
    id: number;
    title: string;
    slug: string;
    price: number;
    category: string | null;
    is_available: boolean;
    thumbnail: string | null;
}

interface Stats {
    total: number;
    available: number;
    unlisted: number;
}

interface Props {
    capstones: Capstone[];
    stats: Stats;
}

interface PageProps {
    auth: { user: User };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

export default function CapstoneIndex({ capstones, stats }: Props) {
    const { auth, flash } = usePage<PageProps>().props;

    function confirmDelete(id: number, title: string) {
        if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
        router.delete(route('admin.capstones.destroy', id));
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={auth.user} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={auth.user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Head title="Projects | Admin" />

                    {flash?.success && (
                        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                            <p className="text-sm text-gray-500">
                                {stats.total} total · {stats.available} listed · {stats.unlisted} unlisted
                            </p>
                        </div>
                        <Link
                            href={route('admin.capstones.create')}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Plus size={16} /> New Project
                        </Link>
                    </div>

                    {capstones.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
                            <p className="mb-4 text-gray-400">No projects yet.</p>
                            <Link
                                href={route('admin.capstones.create')}
                                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Add First Project
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                                        <th className="px-4 py-3 font-semibold text-gray-600">Project</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Category</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Price</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Status</th>
                                        <th className="px-4 py-3 font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {capstones.map((c) => (
                                        <tr key={c.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {c.thumbnail ? (
                                                        <img src={c.thumbnail} alt={c.title} className="h-10 w-14 rounded-lg object-cover" />
                                                    ) : (
                                                        <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-xl">🖥️</div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-800">{c.title}</p>
                                                        <p className="text-xs text-gray-400">{c.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{c.category ?? '—'}</td>
                                            <td className="px-4 py-3 font-semibold text-green-600">
                                                ₱{Number(c.price).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    c.is_available
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {c.is_available ? 'Listed' : 'Unlisted'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={route('admin.capstones.edit', c.id)}
                                                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Pencil size={15} />
                                                    </Link>
                                                    <button
                                                        onClick={() => confirmDelete(c.id, c.title)}
                                                        className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
