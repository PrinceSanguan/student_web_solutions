import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Capstone {
    id: number;
    title: string;
    slug: string;
    description: string;
    price: number;
    demo_url: string | null;
    thumbnail: string | null;
    category: string | null;
    technologies: string[] | null;
    is_available: boolean;
    buyers_count: number;
}

interface Props {
    capstone: Capstone;
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    'Business System':   { bg: 'rgba(59,130,246,0.1)',  text: '#93c5fd', border: 'rgba(59,130,246,0.2)',  dot: '#60a5fa' },
    'School System':     { bg: 'rgba(139,92,246,0.1)',  text: '#c4b5fd', border: 'rgba(139,92,246,0.2)',  dot: '#a78bfa' },
    'Government System': { bg: 'rgba(245,158,11,0.1)',  text: '#fcd34d', border: 'rgba(245,158,11,0.2)',  dot: '#fbbf24' },
    'Healthcare':        { bg: 'rgba(239,68,68,0.1)',   text: '#fca5a5', border: 'rgba(239,68,68,0.2)',   dot: '#f87171' },
    'Hospitality':       { bg: 'rgba(16,185,129,0.1)',  text: '#6ee7b7', border: 'rgba(16,185,129,0.2)',  dot: '#34d399' },
};

const INCLUDED = [
    { label: 'Complete source code' },
    { label: 'Full documentation (PDF)' },
    { label: 'Step-by-step setup guide' },
    { label: 'Submission-ready format' },
];

const PAGE_BG  = '#ffffff';
const CARD_BG  = '#0d1526';
const BORDER   = 'rgba(255,255,255,0.06)';
const BORDER2  = 'rgba(255,255,255,0.08)';
const NAV_BG   = 'rgba(255,255,255,0.95)';

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#070d1e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#e2e8f0',
    outline: 'none',
    transition: 'border-color 0.2s',
};

export default function CapstoneShow({ capstone }: Props) {
    const [showForm, setShowForm] = useState(false);
    const [alreadyBought, setAlreadyBought] = useState(false);

    useEffect(() => {
        if (localStorage.getItem(`sws_purchased_${capstone.slug}`) === '1') {
            setAlreadyBought(true);
        }
    }, [capstone.slug]);

    const { data, setData, post, processing, errors } = useForm<{
        customer_name: string;
        customer_email: string;
        payment?: string;
    }>({ customer_name: '', customer_email: '' });

    function handleCheckout(e: React.FormEvent) {
        e.preventDefault();
        post(`/capstone/${capstone.slug}/checkout`);
    }

    const catStyle = capstone.category ? CATEGORY_STYLES[capstone.category] : null;

    return (
        <>
            <Head title={`${capstone.title} | Student Web Solutions`}>
                <meta name="description" content={capstone.description.slice(0, 155)} />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
            </Head>

            <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG, fontFamily: "'DM Sans', sans-serif" }}>

                {/* ── Nav ── */}
                <nav style={{ background: NAV_BG, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }}
                    className="sticky top-0 z-50">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/capstone" className="flex items-center gap-2 text-sm transition"
                            style={{ color: '#64748b' }}
                            onMouseEnter={e => (e.currentTarget.style.color = '#f1f5f9')}
                            onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>
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
                                    <img
                                        src={capstone.thumbnail}
                                        alt={capstone.title}
                                        className="aspect-video w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center">
                                        <svg className="h-20 w-20" fill="none" stroke="currentColor" strokeWidth={0.6}
                                            viewBox="0 0 24 24" style={{ color: '#1e3a5f' }}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* What's included */}
                            <div className="rounded-2xl p-5" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                                <p className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
                                    What's included
                                </p>
                                <ul className="space-y-3">
                                    {INCLUDED.map((item) => (
                                        <li key={item.label} className="flex items-center gap-3 text-sm" style={{ color: '#94a3b8' }}>
                                            <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                                                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}>
                                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    style={{ color: '#34d399' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </span>
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* ── Right: Info + Checkout ── */}
                        <div className="flex flex-col">
                            {/* Category badge */}
                            {capstone.category && catStyle && (
                                <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
                                    style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}>
                                    <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: catStyle.dot }} />
                                    {capstone.category}
                                </span>
                            )}

                            {/* Title */}
                            <h1 className="mb-4 font-extrabold text-white"
                                style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}>
                                {capstone.title}
                            </h1>

                            {/* Description */}
                            <p className="mb-6 text-sm leading-relaxed" style={{ color: '#64748b' }}>
                                {capstone.description}
                            </p>

                            {/* Tech stack */}
                            {capstone.technologies && capstone.technologies.length > 0 && (
                                <div className="mb-6">
                                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-widest" style={{ color: '#334155' }}>
                                        Tech Stack
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {capstone.technologies.map((tech) => (
                                            <span key={tech} className="rounded-full px-3 py-1 text-xs font-medium"
                                                style={{ background: 'rgba(56,189,248,0.08)', color: '#7dd3fc', border: '1px solid rgba(56,189,248,0.15)' }}>
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price box */}
                            <div className="mb-6 rounded-2xl p-5"
                                style={{
                                    background: capstone.is_available ? 'rgba(52,211,153,0.06)' : CARD_BG,
                                    border: capstone.is_available ? '1px solid rgba(52,211,153,0.18)' : `1px solid ${BORDER}`,
                                }}>
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="font-extrabold"
                                        style={{ fontFamily: "'Syne', sans-serif", fontSize: '2.25rem', color: capstone.is_available ? '#34d399' : '#475569' }}>
                                        ₱{Number(capstone.price).toLocaleString()}
                                    </span>
                                    <span className="text-sm" style={{ color: capstone.is_available ? '#6ee7b7' : '#334155' }}>
                                        one-time
                                    </span>
                                </div>
                                {capstone.is_available ? (
                                    <p className="text-xs" style={{ color: '#6ee7b7' }}>
                                        Pay via GCash — download link sent to your email after payment.
                                    </p>
                                ) : (
                                    <p className="text-xs" style={{ color: '#f87171' }}>
                                        This project has already been sold and is no longer available.
                                    </p>
                                )}
                                {capstone.buyers_count > 0 && (
                                    <p className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: '#334155' }}>
                                        <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                        </svg>
                                        {capstone.buyers_count} {capstone.buyers_count === 1 ? 'person has' : 'people have'} purchased this
                                    </p>
                                )}
                            </div>

                            {/* CTA area */}
                            {alreadyBought ? (
                                <div className="space-y-3">
                                    <div className="rounded-2xl p-4 text-sm"
                                        style={{ background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)', color: '#6ee7b7' }}>
                                        <p className="font-semibold text-emerald-300">You already purchased this project.</p>
                                        <p className="mt-1 text-xs" style={{ color: '#6ee7b7' }}>
                                            Check your email for the download link. Links expire 72 hours after payment.
                                        </p>
                                        <p className="mt-2 text-xs" style={{ color: '#334155' }}>
                                            Didn't receive it?{' '}
                                            <a href="mailto:princesanguan44@gmail.com"
                                                className="underline" style={{ color: '#64748b' }}>
                                                Contact support
                                            </a>.
                                        </p>
                                    </div>
                                    {capstone.demo_url && (
                                        <DemoButton href={capstone.demo_url} />
                                    )}
                                </div>

                            ) : !capstone.is_available ? (
                                <div className="space-y-3">
                                    {capstone.demo_url && <DemoButton href={capstone.demo_url} />}
                                    <div className="rounded-xl px-4 py-3 text-center text-sm font-medium"
                                        style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}>
                                        Sold Out — No Longer Available
                                    </div>
                                    <Link href="/capstone" className="block text-center text-sm transition"
                                        style={{ color: '#334155' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#64748b')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>
                                        Browse other projects →
                                    </Link>
                                </div>

                            ) : !showForm ? (
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {capstone.demo_url && <DemoButton href={capstone.demo_url} flex />}
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition"
                                        style={{ background: 'linear-gradient(120deg, #38bdf8, #818cf8)', boxShadow: '0 0 24px rgba(56,189,248,0.2)' }}
                                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(56,189,248,0.35)')}
                                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(56,189,248,0.2)')}
                                    >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Buy via GCash — ₱{Number(capstone.price).toLocaleString()}
                                    </button>
                                </div>

                            ) : (
                                <form onSubmit={handleCheckout} className="rounded-2xl p-5 space-y-4"
                                    style={{ background: CARD_BG, border: `1px solid ${BORDER2}` }}>
                                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
                                        Enter your details to continue
                                    </p>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium" style={{ color: '#475569' }}>Full Name</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            placeholder="e.g. Juan dela Cruz"
                                            style={inputStyle}
                                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)')}
                                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                                            required
                                        />
                                        {errors.customer_name && (
                                            <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>{errors.customer_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium" style={{ color: '#475569' }}>Email Address</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            placeholder="e.g. juan@email.com"
                                            style={inputStyle}
                                            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)')}
                                            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                                            required
                                        />
                                        {errors.customer_email && (
                                            <p className="mt-1.5 text-xs" style={{ color: '#f87171' }}>{errors.customer_email}</p>
                                        )}
                                    </div>

                                    {errors.payment && (
                                        <p className="rounded-xl px-3 py-2.5 text-xs"
                                            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', color: '#fca5a5' }}>
                                            {errors.payment}
                                        </p>
                                    )}

                                    <div className="flex gap-3 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition"
                                            style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.08)' }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition"
                                            style={{
                                                background: processing ? 'rgba(56,189,248,0.4)' : 'linear-gradient(120deg, #38bdf8, #818cf8)',
                                                opacity: processing ? 0.7 : 1,
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Redirecting…
                                                </>
                                            ) : (
                                                <>Pay ₱{Number(capstone.price).toLocaleString()}</>
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-center text-xs" style={{ color: '#1e293b' }}>
                                        You'll be redirected to GCash to complete payment securely.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </main>

                {/* ── Footer (anchored by flex-col + flex-1 on main) ── */}
                <footer className="py-7 text-center text-sm" style={{ borderTop: '1px solid rgba(0,0,0,0.08)', background: '#ffffff', color: '#1e293b' }}>
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
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                (e.currentTarget as HTMLElement).style.color = '#94a3b8';
            }}
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Demo
        </a>
    );
}
