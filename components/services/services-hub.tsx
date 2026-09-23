import Link from 'next/link';

import { FACEBOOK_URL } from '@/lib/site';
import type { Service } from '@/lib/types';

/**
 * The `/services` hub.
 *
 * Its job is twofold: rank for the broad "web developer / digital services
 * Philippines" intent, and pass link equity down to the four service pages that
 * chase the specific terms. Server Component — all of it is meant to be indexed.
 */

const PAGE_BG = '#ffffff';
const CARD_BG = '#0d1526';
const BORDER = 'rgba(0,0,0,0.08)';
const NAV_BG = 'rgba(255,255,255,0.95)';

export function ServicesHub({ services }: { services: Service[] }) {
    return (
        <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG, fontFamily: 'var(--font-dm-sans)' }}>
            <nav style={{ background: NAV_BG, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }} className="sticky top-0 z-50">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <span className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                        Student Web Solutions
                    </span>
                </div>
            </nav>

            <header className="mx-auto w-full max-w-6xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: '#0369a1' }}
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#38bdf8' }} />
                    Web development · AI automation · Paid ads
                </div>

                <h1
                    style={{ fontFamily: 'var(--font-syne)', lineHeight: 1.05, color: '#0f172a' }}
                    className="text-4xl font-extrabold sm:text-5xl lg:text-6xl"
                >
                    Services
                </h1>

                <p className="mt-5 max-w-2xl text-base" style={{ color: '#475569', lineHeight: 1.8 }}>
                    Four things, all pointed at the same outcome: more customers reaching you and less manual work getting in the way. Systems get
                    built, enquiries get answered around the clock, and paid campaigns bring people who were already looking.
                </p>

                <p className="mt-4 max-w-2xl text-base" style={{ color: '#475569', lineHeight: 1.8 }}>
                    The work runs from Philippine barangay systems to a martial arts academy in Swansea, Wales — the same standard either way.
                </p>
            </header>

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {services.map((service) => (
                        <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="group flex flex-col rounded-2xl p-6 transition hover:-translate-y-1"
                            style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                        >
                            <span
                                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                                style={{ background: `${service.accent}22`, border: `1px solid ${service.accent}55` }}
                                aria-hidden
                            >
                                {service.icon}
                            </span>
                            <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                                {service.name}
                            </h2>
                            <p className="mt-1 text-sm font-medium" style={{ color: service.accent }}>
                                {service.tagline}
                            </p>
                            <p className="mt-3 flex-1 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                                {service.heroBody}
                            </p>
                            <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium" style={{ color: service.accent }}>
                                Read more
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>

                <section className="mt-14 rounded-2xl p-8 text-center" style={{ background: CARD_BG }}>
                    <h2 className="text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: 'var(--font-syne)' }}>
                        Not sure which one you need?
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                        Describe the problem rather than the solution — &ldquo;walang pumapasok na customer&rdquo; or &ldquo;hindi ko masagot lahat ng
                        message&rdquo; is enough to start. You get an honest answer, including when the answer is that you do not need to spend
                        anything yet.
                    </p>
                    <a
                        href={FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                        style={{ background: 'linear-gradient(120deg, #38bdf8, #818cf8)' }}
                    >
                        Message the developer
                    </a>
                </section>

                <nav className="mt-12 flex justify-center text-sm">
                    <Link href="/capstone" className="rounded-full border px-4 py-2 text-slate-600 hover:bg-slate-50" style={{ borderColor: BORDER }}>
                        Browse the project catalog
                    </Link>
                </nav>
            </main>

            <footer className="py-7 text-center text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: '#64748b' }}>
                © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
            </footer>
        </div>
    );
}
