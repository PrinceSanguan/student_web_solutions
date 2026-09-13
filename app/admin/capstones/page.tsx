import { Pencil, Plus } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { DeleteCapstoneButton } from '@/components/admin/capstones/delete-capstone-button';
import { FlashBanner } from '@/components/admin/flash-banner';
import { flashMessage } from '@/lib/flash';
import { routes } from '@/lib/routes';
import { listForAdmin, stats } from '@/lib/store/capstones';

export const metadata: Metadata = { title: 'Projects' };

/** Ported from `pages/Admin/Capstones/Index.tsx` + `Admin\CapstoneController::index`. */
export default async function AdminCapstonesPage({ searchParams }: { searchParams: Promise<{ flash?: string }> }) {
    const [capstones, counts, { flash }] = await Promise.all([listForAdmin(), stats(), searchParams]);

    return (
        <>
            <FlashBanner message={flashMessage(flash)} />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                    <p className="text-sm text-gray-500">
                        {counts.total} total · {counts.available} listed · {counts.unlisted} unlisted
                    </p>
                </div>
                <Link
                    href={routes.admin.capstones.create}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus size={16} /> New Project
                </Link>
            </div>

            {capstones.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white py-20">
                    <p className="mb-4 text-gray-400">No projects yet.</p>
                    <Link
                        href={routes.admin.capstones.create}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Add First Project
                    </Link>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    <div className="overflow-x-auto">
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
                                                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-gray-100 text-xl">
                                                        🖥️
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{c.title}</p>
                                                    <p className="text-xs text-gray-400">{c.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{c.category ?? '—'}</td>
                                        <td className="px-4 py-3 font-semibold text-green-600">₱{Number(c.price).toLocaleString()}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                    c.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                {c.is_available ? 'Listed' : 'Unlisted'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={routes.admin.capstones.edit(c.id)}
                                                    className="rounded-lg p-1.5 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                                                    aria-label={`Edit ${c.title}`}
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <DeleteCapstoneButton id={c.id} title={c.title} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}
