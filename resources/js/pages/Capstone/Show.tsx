import { Head, Link } from '@inertiajs/react';

interface Capstone {
    id: number;
    title: string;
    slug: string;
    description: string;
    demo_url: string | null;
    thumbnail: string | null;
    category: string | null;
    technologies: string[] | null;
}

interface Props {
    capstone: Capstone;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'Business System': { bg: 'rgba(59,130,246,0.08)', text: '#1d4ed8', border: 'rgba(59,130,246,0.25)', dot: '#3b82f6' },
    'School System': { bg: 'rgba(139,92,246,0.08)', text: '#6d28d9', border: 'rgba(139,92,246,0.25)', dot: '#8b5cf6' },
    'Government System': { bg: 'rgba(245,158,11,0.08)', text: '#92400e', border: 'rgba(245,158,11,0.25)', dot: '#d97706' },
    Healthcare: { bg: 'rgba(239,68,68,0.08)', text: '#b91c1c', border: 'rgba(239,68,68,0.25)', dot: '#ef4444' },
    Hospitality: { bg: 'rgba(16,185,129,0.08)', text: '#065f46', border: 'rgba(16,185,129,0.25)', dot: '#10b981' },
};

const INCLUDED = [
    { label: 'Complete source code' },
    { label: 'Full documentation (PDF)' },
    { label: 'Step-by-step setup guide' },
    { label: 'Submission-ready format' },
];

const PAGE_BG = '#ffffff';
const CARD_BG = '#0d1526';
const BORDER = 'rgba(255,255,255,0.06)';
const NAV_BG = 'rgba(255,255,255,0.95)';

export default function CapstoneShow({ capstone }: Props) {
    const catStyle = capstone.category ? CATEGORY_STYLES[capstone.category] : null;

    return (
        <>
            <Head title={`${capstone.title} | Student Web Solutions`}>
                <meta name="description" content={capstone.description.slice(0, 155)} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG, fontFamily: "'DM Sans', sans-serif" }}>
                {/* ── Nav ── */}
                <nav
                    style={{ background: NAV_BG, backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
                    className="sticky top-0 z-50"
                >
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link
                            href="/capstone"
                            className="flex items-center gap-2 text-sm transition"
                            style={{ color: '#64748b' }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Catalog
                        </Link>
                        <span className="text-sm font-semibold" style={{ fontFamily: "'Syne', sans-serif", color: '#0f172a' }}>
                            Student Web Solutions
                        </span>
                    </div>
                </nav>

                {/* ── Main content ── */}
                <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
                        {/* ── Left: Thumbnail + Included ── */}
                        <div className="space-y-4">
                            {/* Thumbnail */}
                            <div className="overflow-hidden rounded-2xl" style={{ background: '#111a2e', border: `1px solid ${BORDER}` }}>
                                {capstone.thumbnail ? (
                                    <img src={capstone.thumbnail} alt={capstone.title} className="aspect-video w-full object-cover" />
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center">
                                        <svg
                                            className="h-20 w-20"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={0.6}
                                            viewBox="0 0 24 24"
                                            style={{ color: '#1e3a5f' }}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* What's included */}
                            <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                                <p className="mb-4 text-xs font-semibold tracking-widest uppercase" style={{ color: '#334155' }}>
                                    What's included
                                </p>
                                <ul className="space-y-3">
                                    {INCLUDED.map((item) => (
                                        <li key={item.label} className="flex items-center gap-3 text-sm" style={{ color: '#94a3b8' }}>
                                            <span
                                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}
                                            >
                                                <svg
                                                    className="h-3 w-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    style={{ color: '#34d399' }}
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── Right: Info + Contact ── */}
                        <div className="flex flex-col">
                            {/* Category badge */}
                            {capstone.category && catStyle && (
                                <span
                                    className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                                    style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}
                                >
                                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: catStyle.dot }} />
                                    {capstone.category}
                                </span>
                            )}

                            {/* Title */}
                            <h1
                                className="mb-4 font-extrabold"
                                style={{
                                    fontFamily: "'Syne', sans-serif",
                                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                    lineHeight: 1.1,
                                    color: '#0f172a',
                                }}
                            >
                                {capstone.title}
                            </h1>

                            {/* Description */}
                            <p className="mb-6 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                                {capstone.description}
                            </p>

                            {/* Tech stack */}
                            {capstone.technologies && capstone.technologies.length > 0 && (
                                <div className="mb-6">
                                    <p className="mb-2.5 text-xs font-semibold tracking-widest uppercase" style={{ color: '#334155' }}>
                                        Tech Stack
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {capstone.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-full px-3 py-1 text-xs font-medium"
                                                style={{
                                                    background: 'rgba(14,165,233,0.08)',
                                                    color: '#0369a1',
                                                    border: '1px solid rgba(14,165,233,0.2)',
                                                }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ── Contact / pricing CTA ── */}
                            <div className="mt-auto rounded-2xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                                <p className="text-base font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                                    Interested in this project?
                                </p>
                                <p className="mt-2 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                                    Every system is tailored to your needs. Message the developer directly to discuss pricing, customizations, and
                                    turnaround — you'll get a personal reply and a quote for exactly what you're looking for.
                                </p>

                                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                                    {capstone.demo_url && <DemoButton href={capstone.demo_url} flex />}
                                    <a
                                        href="https://www.facebook.com/Grandmaster1997/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
                                        style={{
                                            background: 'linear-gradient(120deg, #38bdf8, #818cf8)',
                                            boxShadow: '0 0 24px rgba(56,189,248,0.2)',
                                        }}
                                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(56,189,248,0.35)')}
                                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(56,189,248,0.2)')}
                                    >
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                        </svg>
                                        Contact the Developer
                                    </a>
                                </div>

                                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs" style={{ color: '#475569' }}>
                                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.8}
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Typically replies within a few hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </main>

                {/* ── Footer (anchored by flex-col + flex-1 on main) ── */}
                <footer
                    className="py-7 text-center text-sm"
                    style={{ borderTop: '1px solid rgba(0,0,0,0.08)', background: '#ffffff', color: '#1e293b' }}
                >
                    © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
                </footer>
            </div>
        </>
    );
}

function DemoButton({ href, flex }: { href: string; flex?: boolean }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${flex ? 'flex-1' : 'w-full'}`}
            style={{ background: 'rgba(255,255,255,0.04)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            }}
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
            </svg>
            View Demo
        </a>
    );
}
