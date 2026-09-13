'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { requireAdmin } from '@/lib/auth/require-admin';
import type { CapstoneFormState, CapstoneFormValues } from '@/lib/forms';
import { routes } from '@/lib/routes';
import * as capstones from '@/lib/store/capstones';
import { MAX_UPLOAD_BYTES, deleteDownloadFile, storeDownloadFile, uploadExtensionError } from '@/lib/store/uploads';

/**
 * Replaces the store / update / destroy methods of `Admin\CapstoneController`.
 *
 * Every action calls `requireAdmin()` first. A Server Action is reachable by a
 * direct POST that never touches a page route, so `proxy.ts` cannot be trusted as
 * the gate — this is the equivalent of Laravel's `AdminMiddleware` running on the
 * route rather than on the view.
 */

function readValues(formData: FormData): CapstoneFormValues {
    const text = (key: string) => String(formData.get(key) ?? '').trim();
    return {
        title: text('title'),
        slug: text('slug'),
        description: text('description'),
        price: text('price'),
        category: text('category'),
        technologies: text('technologies'),
        demo_url: text('demo_url'),
        download_url: text('download_url'),
        thumbnail: text('thumbnail'),
        // An unchecked checkbox is simply absent from the FormData.
        is_available: formData.get('is_available') !== null,
    };
}

function isUrl(value: string): boolean {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Mirrors the Laravel rules field for field, including the max lengths — those
 * matched real column widths, and drifting from them would admit records the old
 * app would have rejected.
 */
async function validate(values: CapstoneFormValues, exceptId?: number): Promise<Record<string, string>> {
    const errors: Record<string, string> = {};

    if (!values.title) errors.title = 'The title field is required.';
    else if (values.title.length > 150) errors.title = 'The title may not be greater than 150 characters.';

    if (!values.slug) errors.slug = 'The slug field is required.';
    else if (values.slug.length > 150) errors.slug = 'The slug may not be greater than 150 characters.';
    else if (!/^[a-z0-9-]+$/.test(values.slug)) errors.slug = 'The slug may only contain lowercase letters, numbers and hyphens.';
    else if (await capstones.slugTaken(values.slug, exceptId)) errors.slug = 'The slug has already been taken.';

    if (!values.description) errors.description = 'The description field is required.';

    if (!values.price) errors.price = 'The price field is required.';
    else if (!Number.isFinite(Number(values.price)) || Number(values.price) < 0) errors.price = 'The price must be a number of at least 0.';

    if (values.category.length > 100) errors.category = 'The category may not be greater than 100 characters.';

    if (values.demo_url.length > 500) errors.demo_url = 'The demo url may not be greater than 500 characters.';
    else if (values.demo_url && !isUrl(values.demo_url)) errors.demo_url = 'The demo url must be a valid URL.';

    if (values.download_url.length > 1000) errors.download_url = 'The download url may not be greater than 1000 characters.';
    else if (values.download_url && !isUrl(values.download_url)) errors.download_url = 'The download url must be a valid URL.';

    if (values.thumbnail.length > 1000) errors.thumbnail = 'The thumbnail may not be greater than 1000 characters.';
    else if (values.thumbnail && !isUrl(values.thumbnail)) errors.thumbnail = 'The thumbnail must be a valid URL.';

    return errors;
}

/** "React, Laravel" becomes ['React', 'Laravel']; blank becomes null, as Laravel stored it. */
function parseTechnologies(raw: string): string[] | null {
    const list = raw
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
    return list.length ? list : null;
}

/** The upload input, or null when the browser sent an empty file part. */
function readUpload(formData: FormData): File | null {
    const file = formData.get('download_file');
    if (!(file instanceof File) || file.size === 0) return null;
    return file;
}

function uploadError(file: File): string | null {
    if (file.size > MAX_UPLOAD_BYTES) return 'The file may not be greater than 100 MB.';
    return uploadExtensionError(file.name);
}

/**
 * Everything a capstone write can make stale.
 *
 * `/capstone` and `/sitemap.xml` are prerendered, so without this a new project
 * would not appear until the next build. Slugs are passed when they change, since
 * an edit can orphan the old URL and create a new one.
 */
function revalidateCatalog(...slugs: (string | undefined)[]) {
    revalidatePath(routes.capstone.index);
    revalidatePath('/sitemap.xml');
    revalidatePath(routes.admin.capstones.index);
    for (const slug of new Set(slugs.filter(Boolean))) {
        revalidatePath(routes.capstone.show(slug as string));
    }
}

/* ── Create ─────────────────────────────────────────────────────────────── */

export async function createCapstone(_previous: CapstoneFormState, formData: FormData): Promise<CapstoneFormState> {
    await requireAdmin();

    const values = readValues(formData);
    const errors = await validate(values);

    const upload = readUpload(formData);
    if (upload) {
        const message = uploadError(upload);
        if (message) errors.download_file = message;
    }

    if (Object.keys(errors).length) return { errors, values };

    // An uploaded file takes priority over a pasted URL, matching the controller's
    // "downloadFilename ? null : download_url" rule.
    const downloadFile = upload ? await storeDownloadFile(upload) : null;

    await capstones.create({
        title: values.title,
        slug: values.slug,
        description: values.description,
        price: Number(values.price),
        category: values.category || null,
        technologies: parseTechnologies(values.technologies),
        demo_url: values.demo_url || null,
        download_url: downloadFile ? null : values.download_url || null,
        download_file: downloadFile,
        thumbnail: values.thumbnail || null,
        // The create form has no availability toggle, and the controller hardcoded
        // true, so that default is preserved.
        is_available: true,
    });

    revalidateCatalog();
    redirect(`${routes.admin.capstones.index}?flash=created`);
}

/* ── Update ─────────────────────────────────────────────────────────────── */

export async function updateCapstone(id: number, _previous: CapstoneFormState, formData: FormData): Promise<CapstoneFormState> {
    await requireAdmin();

    const values = readValues(formData);
    const errors = await validate(values, id);

    const existing = await capstones.findById(id);
    if (!existing) return { errors: { ...errors, title: 'This project no longer exists.' }, values };

    const upload = readUpload(formData);
    if (upload) {
        const message = uploadError(upload);
        if (message) errors.download_file = message;
    }

    if (Object.keys(errors).length) return { errors, values };

    let downloadFile = existing.download_file;
    let downloadUrl = existing.download_url;

    if (upload) {
        // Replace the stored file and drop any URL — the upload wins.
        await deleteDownloadFile(existing.download_file);
        downloadFile = await storeDownloadFile(upload);
        downloadUrl = null;
    } else if (values.download_url) {
        // A new URL supersedes a previously uploaded file.
        if (existing.download_file && values.download_url !== existing.download_url) {
            await deleteDownloadFile(existing.download_file);
            downloadFile = null;
        }
        downloadUrl = values.download_url;
    }

    await capstones.update(id, {
        title: values.title,
        slug: values.slug,
        description: values.description,
        price: Number(values.price),
        category: values.category || null,
        technologies: parseTechnologies(values.technologies),
        demo_url: values.demo_url || null,
        download_url: downloadUrl,
        download_file: downloadFile,
        // Laravel kept the previous thumbnail when the field came back empty.
        thumbnail: values.thumbnail || existing.thumbnail,
        is_available: values.is_available,
    });

    revalidateCatalog(existing.slug, values.slug);
    redirect(`${routes.admin.capstones.index}?flash=updated`);
}

/* ── Delete ─────────────────────────────────────────────────────────────── */

/**
 * Invoked from a plain form in the table row, so it takes FormData rather than an
 * id argument. Replaces Inertia's `router.delete(...)`.
 */
export async function deleteCapstone(formData: FormData): Promise<void> {
    await requireAdmin();

    const id = Number(formData.get('id'));
    if (!Number.isInteger(id)) return;

    const removed = await capstones.remove(id);
    // Drop the private upload alongside the record, as destroy() did.
    await deleteDownloadFile(removed?.download_file ?? null);

    revalidateCatalog(removed?.slug);
    redirect(`${routes.admin.capstones.index}?flash=deleted`);
}
