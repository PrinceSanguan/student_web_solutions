import 'server-only';

import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * Private storage for capstone download files — the equivalent of Laravel's
 * `storage/app/capstone-downloads` on the `local` (non-public) disk.
 *
 * Note this is write-only by design, exactly as it was in Laravel: the controller
 * stored the file and recorded its name, but no route ever served it back (the
 * `DownloadController` went away with the orders feature). Nothing here regresses
 * that; it just keeps the admin form's behaviour intact.
 */

/**
 * Built from literal segments rooted at `process.cwd()`. Turbopack's static
 * analysis needs to see the whole path shape here — if it cannot, it conservatively
 * traces the entire project into the server bundle.
 */
function downloadPath(filename: string): string {
    return path.join(process.cwd(), 'data', 'uploads', 'capstone-downloads', filename);
}

function downloadDir(): string {
    return path.join(process.cwd(), 'data', 'uploads', 'capstone-downloads');
}

/** Same allow-list as the Laravel validator: `mimes:zip,pdf,rar,tar,gz`. */
const ALLOWED_EXTENSIONS = new Set(['zip', 'pdf', 'rar', 'tar', 'gz']);

/** `max:102400` in Laravel's validator is kilobytes, i.e. 100 MB. */
export const MAX_UPLOAD_BYTES = 100 * 1024 * 1024;

export function uploadExtensionError(filename: string): string | null {
    const ext = path.extname(filename).replace('.', '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return 'The file must be a zip, pdf, rar, tar or gz.';
    }
    return null;
}

/** Stores the file under a random name and returns that name. */
export async function storeDownloadFile(file: File): Promise<string> {
    const ext = path.extname(file.name).replace('.', '').toLowerCase();
    const filename = `${randomUUID()}.${ext}`;

    await mkdir(downloadDir(), { recursive: true });
    await writeFile(downloadPath(filename), Buffer.from(await file.arrayBuffer()));

    return filename;
}

/** Missing file is not an error — the record may point at something already gone. */
export async function deleteDownloadFile(filename: string | null): Promise<void> {
    if (!filename) return;
    try {
        await unlink(downloadPath(filename));
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
}
