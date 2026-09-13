'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';

import { type CapstoneFormState, type CapstoneFormValues, emptyCapstoneValues } from '@/lib/forms';
import { routes } from '@/lib/routes';

/**
 * The project form, shared by /admin/capstones/new and /admin/capstones/[id]/edit.
 *
 * The Laravel versions were two near-identical 300-line files that differed in
 * their submit target, their button labels, and whether the availability toggle
 * was present. One component with a `mode` covers both.
 *
 * Inertia's `useForm` became `useActionState`. The inputs stay controlled because
 * two things need live state: the slug auto-derives from the title, and the
 * thumbnail preview follows the URL field as you type.
 */

const CATEGORIES = ['Business System', 'School System', 'Government System', 'Healthcare', 'Hospitality', 'Other'];

type Mode = 'create' | 'edit';

interface Props {
    mode: Mode;
    /** Bound with the capstone id on the edit page. */
    action: (state: CapstoneFormState, formData: FormData) => Promise<CapstoneFormState>;
    initialValues?: CapstoneFormValues;
    /** Shown as a reminder that a private file is already attached. */
    hasStoredFile?: boolean;
}

export function CapstoneForm({ mode, action, initialValues = emptyCapstoneValues, hasStoredFile = false }: Props) {
    const [state, formAction, isPending] = useActionState(action, { errors: {}, values: initialValues });

    // Server-rejected input wins, so nothing typed is lost on a failed submit.
    const [values, setValues] = useState<CapstoneFormValues>(state.values);
    const { errors } = state;

    function set<K extends keyof CapstoneFormValues>(key: K, value: CapstoneFormValues[K]) {
        setValues((prev) => ({ ...prev, [key]: value }));
    }

    /** Title drives the slug, as it did in both Laravel forms. */
    function handleTitleChange(value: string) {
        setValues((prev) => ({
            ...prev,
            title: value,
            slug: value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, ''),
        }));
    }

    const [downloadMode, setDownloadMode] = useState<'url' | 'file'>(hasStoredFile ? 'file' : 'url');

    return (
        <form action={formAction}>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Left column — main fields */}
                <div className="space-y-5 lg:col-span-2">
                    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
                        <h2 className="font-semibold text-gray-800">Project Info</h2>

                        <Field label="Title" error={errors.title}>
                            <input
                                type="text"
                                name="title"
                                value={values.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Inventory Management System"
                                className={inputCls(errors.title)}
                            />
                        </Field>

                        <Field label="Slug" error={errors.slug} hint="URL-friendly identifier (auto-generated)">
                            <input
                                type="text"
                                name="slug"
                                value={values.slug}
                                onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                placeholder="inventory-management-system"
                                className={inputCls(errors.slug)}
                            />
                        </Field>

                        <Field label="Description" error={errors.description}>
                            <textarea
                                name="description"
                                value={values.description}
                                onChange={(e) => set('description', e.target.value)}
                                rows={4}
                                placeholder="Describe what's included, use case, and features…"
                                className={inputCls(errors.description)}
                            />
                        </Field>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Price (₱)" error={errors.price} hint="Internal reference — not shown to visitors">
                                <input
                                    type="number"
                                    name="price"
                                    step="0.01"
                                    min="0"
                                    value={values.price}
                                    onChange={(e) => set('price', e.target.value)}
                                    placeholder="499"
                                    className={inputCls(errors.price)}
                                />
                            </Field>

                            <Field label="Category" error={errors.category}>
                                <select
                                    name="category"
                                    value={values.category}
                                    onChange={(e) => set('category', e.target.value)}
                                    className={inputCls(errors.category)}
                                >
                                    <option value="">— Select —</option>
                                    {CATEGORIES.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <Field label="Technologies" error={errors.technologies} hint="Comma-separated, e.g. Laravel, MySQL, Tailwind CSS">
                            <input
                                type="text"
                                name="technologies"
                                value={values.technologies}
                                onChange={(e) => set('technologies', e.target.value)}
                                placeholder="Laravel, MySQL, Tailwind CSS"
                                className={inputCls(errors.technologies)}
                            />
                        </Field>

                        <Field label="Demo URL" error={errors.demo_url} hint="Optional — live demo link">
                            <input
                                type="url"
                                name="demo_url"
                                value={values.demo_url}
                                onChange={(e) => set('demo_url', e.target.value)}
                                placeholder="https://demo.example.com"
                                className={inputCls(errors.demo_url)}
                            />
                        </Field>

                        {/* Availability lives only on the edit form, as before: a new
                            project is always created listed. */}
                        {mode === 'edit' && (
                            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <input
                                    type="checkbox"
                                    id="is_available"
                                    name="is_available"
                                    checked={values.is_available}
                                    onChange={(e) => set('is_available', e.target.checked)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600"
                                />
                                <label htmlFor="is_available" className="text-sm font-medium text-gray-700">
                                    Show in public catalog
                                </label>
                                <span
                                    className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        values.is_available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}
                                >
                                    {values.is_available ? 'Listed' : 'Hidden'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Download source */}
                    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
                        <h2 className="font-semibold text-gray-800">Delivery File (private)</h2>
                        <p className="text-xs text-gray-500">
                            Optional source-code file kept privately for this project — you send it to the client manually after a deal is closed.
                            Choose one method.
                        </p>

                        {hasStoredFile && (
                            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                                Current: uploaded file stored privately on the server.
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setDownloadMode('url')}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    downloadMode === 'url' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                External URL
                            </button>
                            <button
                                type="button"
                                onClick={() => setDownloadMode('file')}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                                    downloadMode === 'file' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {mode === 'edit' ? 'Upload New File' : 'Upload File'}
                            </button>
                        </div>

                        {/* Both inputs stay mounted so switching tabs does not silently
                            discard what was already entered in the other one. The
                            hidden one is disabled, which keeps it out of the FormData. */}
                        <div className={downloadMode === 'url' ? '' : 'hidden'}>
                            <Field label="Download URL" error={errors.download_url} hint="Kept private for your reference — not shown publicly">
                                <input
                                    type="url"
                                    name="download_url"
                                    disabled={downloadMode !== 'url'}
                                    value={values.download_url}
                                    onChange={(e) => set('download_url', e.target.value)}
                                    placeholder="https://example.com/files/project.zip"
                                    className={inputCls(errors.download_url)}
                                />
                            </Field>
                        </div>

                        <div className={downloadMode === 'file' ? '' : 'hidden'}>
                            <Field
                                label="Upload ZIP / PDF"
                                error={errors.download_file}
                                hint={
                                    mode === 'edit'
                                        ? 'Max 100 MB. Replaces existing file.'
                                        : 'Max 100 MB. Stored privately — not publicly accessible.'
                                }
                            >
                                <input
                                    type="file"
                                    name="download_file"
                                    disabled={downloadMode !== 'file'}
                                    accept=".zip,.pdf,.rar,.tar,.gz"
                                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100"
                                />
                            </Field>
                        </div>
                    </div>
                </div>

                {/* Right column — thumbnail */}
                <div className="space-y-5">
                    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6">
                        <h2 className="font-semibold text-gray-800">Thumbnail</h2>

                        {values.thumbnail ? (
                            <img src={values.thumbnail} alt="Preview" className="aspect-video w-full rounded-xl object-cover" />
                        ) : (
                            <div className="flex aspect-video w-full items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-4xl text-gray-200">
                                🖥️
                            </div>
                        )}

                        <Field
                            label="Thumbnail URL"
                            error={errors.thumbnail}
                            hint={mode === 'edit' ? 'Direct image link — leave blank to keep current' : 'Direct image link (JPG, PNG, WebP)'}
                        >
                            <input
                                type="url"
                                name="thumbnail"
                                value={values.thumbnail}
                                onChange={(e) => set('thumbnail', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                className={inputCls(errors.thumbnail)}
                            />
                        </Field>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                        >
                            {mode === 'edit' ? (isPending ? 'Saving…' : 'Save Changes') : isPending ? 'Creating…' : 'Create Project'}
                        </button>
                        <Link
                            href={routes.admin.capstones.index}
                            className="w-full rounded-xl border border-gray-200 py-3 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

/* ── Shared helpers (unchanged from the Laravel forms) ───────────────────── */

function inputCls(error?: string) {
    return `w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-200 focus:outline-none ${
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
