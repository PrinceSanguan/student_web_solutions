/**
 * Emits a JSON-LD block.
 *
 * A Server Component, so the schema is in the initial HTML where a crawler will
 * see it without executing JavaScript.
 *
 * `dangerouslySetInnerHTML` is the documented way to do this in Next.js — the
 * payload is built from typed builders in `lib/seo.ts`, never from user input.
 */
export function JsonLd({ data }: { data: object }) {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
