import 'server-only';

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * A JSON file on disk, used where the Laravel app used Postgres.
 *
 * Two things make this safe enough for a one-admin CMS:
 *
 *   1. Writes are atomic — the new content goes to a temp file and is then
 *      renamed over the target, so a crash mid-write cannot leave a truncated
 *      JSON file behind. `rename` is atomic within a filesystem on Windows too.
 *
 *   2. Writes to the same file are serialised through a promise chain. Two
 *      Server Actions firing at once would otherwise read-modify-write over each
 *      other and silently lose a record.
 *
 * The lock is per-process. One `next dev` / `next start` is one process, which is
 * how this app runs; a multi-instance deployment needs a real database instead.
 */

const DATA_DIR = path.join(process.cwd(), 'data');

/** Serialises access per file path. */
const locks = new Map<string, Promise<unknown>>();

function withLock<T>(file: string, job: () => Promise<T>): Promise<T> {
    const previous = locks.get(file) ?? Promise.resolve();
    // Swallow the predecessor's rejection so one failure does not poison the queue.
    const next = previous.then(job, job);
    locks.set(
        file,
        next.catch(() => undefined),
    );
    return next;
}

function resolve(file: string): string {
    return path.join(DATA_DIR, file);
}

/** Returns `fallback` when the file does not exist yet — first run is not an error. */
export async function readJson<T>(file: string, fallback: T): Promise<T> {
    try {
        const raw = await readFile(resolve(file), 'utf8');
        return JSON.parse(raw) as T;
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return fallback;
        throw error;
    }
}

export async function writeJson<T>(file: string, value: T): Promise<void> {
    const target = resolve(file);
    await mkdir(path.dirname(target), { recursive: true });

    const temp = `${target}.${process.pid}.tmp`;
    await writeFile(temp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
    await rename(temp, target);
}

/**
 * Read, transform, write — under the lock, so the read and the write cannot be
 * split by another caller.
 */
export async function updateJson<T, R>(file: string, fallback: T, mutate: (current: T) => Promise<[T, R]> | [T, R]): Promise<R> {
    return withLock(file, async () => {
        const current = await readJson(file, fallback);
        const [next, result] = await mutate(current);
        await writeJson(file, next);
        return result;
    });
}
