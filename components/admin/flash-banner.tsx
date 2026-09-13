/**
 * The success banner Laravel rendered from `usePage().props.flash.success`.
 *
 * Same markup as before; the message now arrives from `?flash=<key>` resolved
 * through `lib/flash.ts`. A Server Component — there is nothing interactive here.
 */
export function FlashBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>;
}
