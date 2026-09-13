'use client';

import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

import { deleteCapstone } from '@/app/admin/capstones/actions';

/**
 * Replaces Inertia's `router.delete(route('admin.capstones.destroy', id))`.
 *
 * A real form posting a Server Action, rather than a fetch — so it still works
 * with JavaScript disabled, and Next.js refreshes the list for us on the way back.
 *
 * The `confirm()` dialog is the one the Laravel page used. Keeping it means the
 * destructive action still needs a second deliberate click.
 */
export function DeleteCapstoneButton({ id, title }: { id: number; title: string }) {
    return (
        <form
            action={deleteCapstone}
            onSubmit={(event) => {
                if (!confirm(`Delete "${title}"? This cannot be undone.`)) event.preventDefault();
            }}
        >
            <input type="hidden" name="id" value={id} />
            <SubmitButton title={title} />
        </form>
    );
}

/**
 * Split out because `useFormStatus` only reports the status of the form it is
 * rendered inside — it has to live below the `<form>`, not alongside it.
 */
function SubmitButton({ title }: { title: string }) {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            aria-label={`Delete ${title}`}
            className="rounded-lg p-1.5 text-gray-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        >
            <Trash2 size={15} />
        </button>
    );
}
