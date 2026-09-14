import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CapstoneDetail } from '@/components/capstone/detail';
import { findPublicBySlug, listSlugs } from '@/lib/capstones';

interface Props {
    params: Promise<{ slug: string }>;
}

/**
 * The catalog is static content, so every detail page can be built ahead of time
 * and served from the CDN. `dynamicParams = false` makes an unknown slug a plain
 * 404 instead of an on-demand render.
 */
export function generateStaticParams() {
    return listSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

/**
 * Was `<Head title={...}><meta name="description" …>` inside the page component.
 * Generating it on the server means crawlers and link unfurlers see the real title
 * and description in the initial HTML.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const capstone = findPublicBySlug(slug);
    if (!capstone) return { title: 'Project Not Found' };

    // Descriptions are multi-line, and a meta tag must not carry raw newlines —
    // collapse the whitespace before trimming to length.
    const summary = capstone.description.replace(/\s+/g, ' ').trim().slice(0, 155);

    return {
        title: capstone.title,
        description: summary,
        alternates: { canonical: `/capstone/${capstone.slug}` },
        openGraph: {
            title: capstone.title,
            description: summary,
            url: `/capstone/${capstone.slug}`,
            ...(capstone.thumbnail ? { images: [{ url: capstone.thumbnail, alt: capstone.title }] } : {}),
        },
    };
}

/**
 * Ported from `CapstoneController::show`.
 *
 * `firstOrFail()` became `notFound()` — a 404 page rather than Laravel's 500-ish
 * abort. Note this does not filter on `is_available`: an unlisted project stays
 * reachable by its direct URL, exactly as the Laravel query behaved.
 */
export default async function CapstoneShowPage({ params }: Props) {
    const { slug } = await params;
    const capstone = findPublicBySlug(slug);
    if (!capstone) notFound();

    return <CapstoneDetail capstone={capstone} />;
}
