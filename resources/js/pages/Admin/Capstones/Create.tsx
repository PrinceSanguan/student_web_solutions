import { Header } from '@/components/admin/header';
import { Sidebar } from '@/components/admin/sidebar';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChangeEvent, FormEvent, useState } from 'react';

interface User { name: string; email: string; }
interface PageProps { auth: { user: User }; [key: string]: unknown; }

const CATEGORIES = ['Business System', 'School System', 'Government System', 'Healthcare', 'Hospitality', 'Other'];

export default function CapstoneCreate() {
    const { auth } = usePage<PageProps>().props;
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [downloadMode, setDownloadMode] = useState<'url' | 'file'>('url');

    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        slug: string;
        description: string;
        price: string;
        category: string;
        technologies: string;
        demo_url: string;
        download_url: string;
        thumbnail: File | null;
        download_file: File | null;
    }>({
        title: '',
        slug: '',
        description: '',
        price: '',
        category: '',
        technologies: '',
        demo_url: '',
        download_url: '',
        thumbnail: null,
        download_file: null,
    });

    // Auto-generate slug from title
    function handleTitleChange(value: string) {
        setData((prev) => ({
            ...prev,
            title: value,
            slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }));
    }

    function handleThumbnailChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        setData('thumbnail', file);
        if (file) setThumbnailPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        post(route('admin.capstones.store'), {
            forceFormData: true,
        });
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar user={auth.user} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={auth.user} />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Head title="New Project | Admin" />

                    <div className="mb-6 flex items-center gap-3">
                        <Link href={route('admin.capstones.index')} className="text-sm text-gray-500 hover:text-gray-700">
                            ← Projects
                        </Link>
                        <span className="text-gray-300">/</span>
                        <h1 className="text-xl font-bold text-gray-900">New Project</h1>
                    </div>

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            {/* Left column — main fields */}
                            <div className="space-y-5 lg:col-span-2">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Project Info</h2>

                                    <Field label="Title" error={errors.title}>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                            placeholder="Inventory Management System"
                                            className={inputCls(errors.title)}
                                        />
                                    </Field>

                                    <Field label="Slug" error={errors.slug} hint="URL-friendly identifier (auto-generated)">
                                        <input
                                            type="text"
                                            value={data.slug}
                                            onChange={(e) => setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                            placeholder="inventory-management-system"
                                            className={inputCls(errors.slug)}
                                        />
                                    </Field>

                                    <Field label="Description" error={errors.description}>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            rows={4}
                                            placeholder="Describe what's included, use case, and features…"
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
                                                placeholder="499"
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

                                    <Field label="Technologies" error={errors.technologies} hint="Comma-separated, e.g. Laravel, MySQL, Tailwind CSS">
                                        <input
                                            type="text"
                                            value={data.technologies}
                                            onChange={(e) => setData('technologies', e.target.value)}
                                            placeholder="Laravel, MySQL, Tailwind CSS"
                                            className={inputCls(errors.technologies)}
                                        />
                                    </Field>

                                    <Field label="Demo URL" error={errors.demo_url} hint="Optional — live demo link">
                                        <input
                                            type="url"
                                            value={data.demo_url}
                                            onChange={(e) => setData('demo_url', e.target.value)}
                                            placeholder="https://demo.example.com"
                                            className={inputCls(errors.demo_url)}
                                        />
                                    </Field>
                                </div>

                                {/* Download source */}
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Downloadable File</h2>
                                    <p className="text-xs text-gray-500">The source code delivered to buyers after payment. Choose one method.</p>

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
                                            Upload File
                                        </button>
                                    </div>

                                    {downloadMode === 'url' ? (
                                        <Field label="Download URL" error={errors.download_url} hint="The real URL is never shown to buyers — it's proxied server-side">
                                            <input
                                                type="url"
                                                value={data.download_url}
                                                onChange={(e) => setData('download_url', e.target.value)}
                                                placeholder="https://example.com/files/project.zip"
                                                className={inputCls(errors.download_url)}
                                            />
                                        </Field>
                                    ) : (
                                        <Field label="Upload ZIP / PDF" error={errors.download_file} hint="Max 100 MB. Stored privately — not publicly accessible.">
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

                            {/* Right column — thumbnail */}
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
                                    <h2 className="font-semibold text-gray-800">Thumbnail</h2>

                                    {thumbnailPreview ? (
                                        <img src={thumbnailPreview} alt="Preview" className="aspect-video w-full rounded-xl object-cover" />
                                    ) : (
                                        <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-4xl text-gray-200">
                                            🖥️
                                        </div>
                                    )}

                                    <Field label="" error={errors.thumbnail} hint="Max 2 MB — JPG, PNG, WebP">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                                        />
                                    </Field>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                    >
                                        {processing ? 'Creating…' : 'Create Project'}
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

// ---- Shared helpers ----
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
