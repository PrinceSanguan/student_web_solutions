import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface User { name: string; email: string; }
interface PageProps { auth: { user: User }; flash?: { success?: string }; [key: string]: unknown; }

const CATEGORIES = ['Business System', 'School System', 'Government System', 'Healthcare', 'Hospitality', 'Other'];

interface CapstoneData {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    category: string | null;
    technologies: string;
    demo_url: string | null;
    download_url: string | null;
    download_file: string | null;
    thumbnail: string | null;
    is_available: boolean;
}

export default function CapstoneEdit({ capstone }: { capstone: CapstoneData }) {
    const { auth, flash } = usePage<PageProps>().props;
    const [downloadMode, setDownloadMode] = useState<'url' | 'file'>(capstone.download_file ? 'file' : 'url');

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        slug: string;
        description: string;
        price: string;
        category: string;
        technologies: string;
        demo_url: string;
        download_url: string;
        is_available: boolean;
        thumbnail: string;
        download_file: File | null;
        _method: string;
    }>({
        title: capstone.title,
        slug: capstone.slug,
        description: capstone.description,
        price: String(capstone.price),
        category: capstone.category ?? '',
        technologies: capstone.technologies ?? '',
        demo_url: capstone.demo_url ?? '',
        download_url: capstone.download_url ?? '',
        is_available: capstone.is_available,
        thumbnail: capstone.thumbnail ?? '',
        download_file: null,
        _method: 'PUT',
    });

    function handleTitleChange(value: string) {
        setData((prev) => ({
            ...prev,
            title: value,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(route('admin.capstones.update', capstone.id), {
            forceFormData: true,
        });
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={auth.user} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={auth.user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Head title={`Edit ${capstone.title} | Admin`} />

                    {flash?.success && (
                        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-6 flex items-center gap-3">
                        <Link href={route('admin.capstones.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Projects
                        </Link>
                        <span className="text-gray-300">/</span>
                        <h1 className="text-xl font-bold text-gray-900">Edit Project</h1>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="space-y-5 lg:col-span-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Project Info</h2>

                                    <Field label="Title" error={errors.title}>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            className={inputCls(errors.title)}
                                        />
                                    </Field>

                                    <Field label="Slug" error={errors.slug}>
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            className={inputCls(errors.slug)}
                                        />
                                    </Field>

                                    <Field label="Description" error={errors.description}>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            className={inputCls(errors.description)}
                                        />
                                    </Field>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Field label="Price (₱)" error={errors.price}>
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.price}
                                                onChange={(e) => setData('price', e.target.value)}
                                                className={inputCls(errors.price)}
                                            />
                                        </Field>

                                        <Field label="Category" error={errors.category}>
                                            <select
                                                value={data.category}
                                                onChange={(e) => setData('category', e.target.value)}
                                                className={inputCls(errors.category)}
                                            >
                                                <option value="">— Select —</option>
                                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </Field>
                                    </div>

                                    <Field label="Technologies" error={errors.technologies} hint="Comma-separated">
                                        <input
                                            type="text"
                                            value={data.technologies}
                                            onChange={(e) => setData('technologies', e.target.value)}
                                            className={inputCls(errors.technologies)}
                                        />
                                    </Field>

                                    <Field label="Demo URL" error={errors.demo_url}>
                                        <input
                                            type="url"
                                            value={data.demo_url}
                                            onChange={(e) => setData('demo_url', e.target.value)}
                                            placeholder="https://demo.example.com"
                                            className={inputCls(errors.demo_url)}
                                        />
                                    </Field>

                                    {/* Availability toggle */}
                                    <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            id="is_available"
                                            checked={data.is_available}
                                            onChange={(e) => setData('is_available', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                        />
                                        <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                                            Available for purchase
                                        </label>
                                        <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${data.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {data.is_available ? 'Active' : 'Hidden'}
                                        </span>
                                    </div>
                                </div>

                                {/* Download source */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Downloadable File</h2>

                                    {capstone.download_file && (
                                        <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                            Current: uploaded file stored securely on server.
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setDownloadMode('url')}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${downloadMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            External URL
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDownloadMode('file')}
                                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${downloadMode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Upload New File
                                        </button>
                                    </div>

                                    {downloadMode === 'url' ? (
                                        <Field label="Download URL" error={errors.download_url} hint="Real URL is proxied — never visible to buyers">
                                            <input
                                                type="url"
                                                value={data.download_url}
                                                onChange={(e) => setData('download_url', e.target.value)}
                                                placeholder="https://example.com/files/project.zip"
                                                className={inputCls(errors.download_url)}
                                            />
                                        </Field>
                                    ) : (
                                        <Field label="Upload ZIP / PDF" error={errors.download_file} hint="Max 100 MB. Replaces existing file.">
                                            <input
                                                type="file"
                                                accept=".zip,.pdf,.rar,.tar,.gz"
                                                onChange={(e) => setData('download_file', e.target.files?.[0] ?? null)}
                                                className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                                            />
                                        </Field>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Thumbnail</h2>

                                    {data.thumbnail ? (
                                        <img src={data.thumbnail} alt="Preview" className="aspect-video w-full rounded-xl object-cover" />
                                    ) : (
                                        <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-4xl text-gray-200">
                                            🖥️
                                        </div>
                                    )}

                                    <Field label="Thumbnail URL" error={errors.thumbnail} hint="Direct image link — leave blank to keep current">
                                        <input
                                            type="url"
                                            value={data.thumbnail}
                                            onChange={(e) => setData('thumbnail', e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            className={inputCls(errors.thumbnail)}
                                        />
                                    </Field>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {processing ? 'Saving…' : 'Save Changes'}
                                    </button>
                                    <Link
                                        href={route('admin.capstones.index')}
                                        className="w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                    >
                                        Cancel
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
}

function inputCls(error?: string) {
    return `w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
    }`;
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            {label && <label className="block text-xs font-semibold text-gray-600">{label}</label>}
            {children}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
