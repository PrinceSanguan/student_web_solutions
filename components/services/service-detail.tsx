import Link from 'next/link';

import { FACEBOOK_URL } from '@/lib/site';
import type { PublicCapstone, Service } from '@/lib/types';

/**
 * A service page.
 *
 * A Server Component on purpose: every word here exists to be indexed, so it must
 * be in the initial HTML. Nothing on the page needs interactivity — the FAQ uses
 * native `<details>` rather than a client-side accordion, which means the answers
 * are in the markup even when collapsed. A JS accordion that mounts empty would
 * defeat the point of the `FAQPage` schema.
 */

const PAGE_BG = '#ffffff';
const CARD_BG = '#0d1526';
const BORDER = 'rgba(0,0,0,0.08)';
const NAV_BG = 'rgba(255,255,255,0.95)';

export function ServiceDetail({ service, related }: { service: Service; related: PublicCapstone[] }) {
    return (
        <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG, fontFamily: 'var(--font-dm-sans)' }}>
            {/* ── Nav ── */}
            <nav style={{ background: NAV_BG, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }} className="sticky top-0 z-50">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/services" className="flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        All Services
                    </Link>
                    <Link href="/" className="text-sm font-semibold text-slate-900" style={{ fontFamily: 'var(--font-syne)' }}>
                        Student Web Solutions
                    </Link>
                </div>
            </nav>

            {/* Visible breadcrumb — matches the BreadcrumbList schema on the page. */}
            <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
                <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <li>
                        <Link href="/" className="hover:text-slate-700">
                            Home
                        </Link>
                    </li>
                    <li aria-hidden>/</li>
                    <li>
                        <Link href="/services" className="hover:text-slate-700">
                            Services
                        </Link>
                    </li>
                    <li aria-hidden>/</li>
                    <li className="text-slate-600">{service.shortName}</li>
                </ol>
            </nav>

            {/* ── Hero ── */}
            <header className="mx-auto w-full max-w-5xl px-4 pt-8 pb-10 sm:px-6 lg:px-8">
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ background: `${service.accent}1a`, border: `1px solid ${service.accent}55`, color: '#334155' }}
                >
                    <span aria-hidden>{service.icon}</span>
                    {service.tagline}
                </div>

                <h1
                    style={{ fontFamily: 'var(--font-syne)', lineHeight: 1.08, color: '#0f172a' }}
                    className="text-4xl font-extrabold sm:text-5xl lg:text-6xl"
                >
                    {service.heroHeading}
                </h1>

                <p className="mt-5 max-w-2xl text-base" style={{ color: '#475569', lineHeight: 1.8 }}>
                    {service.heroBody}
                </p>

                <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ background: 'linear-gradient(120deg, #38bdf8, #818cf8)' }}
                >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                    Message us on Facebook
                </a>
            </header>

            {/* ── Body ── */}
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-20 sm:px-6 lg:px-8">
                <div className="space-y-12">
                    {service.sections.map((section) => (
                        <section key={section.heading}>
                            <h2 className="mb-4 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--font-syne)', color: '#0f172a' }}>
                                {section.heading}
                            </h2>
                            <div className="space-y-4">
                                {section.body.map((paragraph) => (
                                    <p key={paragraph.slice(0, 40)} className="max-w-3xl text-base" style={{ color: '#475569', lineHeight: 1.85 }}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* ── FAQ ── */}
                <section className="mt-16">
                    <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--font-syne)', color: '#0f172a' }}>
                        Frequently asked questions
                    </h2>
                    <div className="divide-y rounded-2xl border" style={{ borderColor: BORDER }}>
                        {service.faqs.map((faq) => (
                            <details key={faq.q} className="group p-5">
                                <summary className="cursor-pointer list-none text-base font-semibold text-slate-800 marker:content-none">
                                    <span className="flex items-start justify-between gap-4">
                                        {faq.q}
                                        <span className="mt-1 shrink-0 text-slate-400 transition group-open:rotate-45" aria-hidden>
                                            +
                                        </span>
                                    </span>
                                </summary>
                                <p className="mt-3 max-w-3xl text-sm" style={{ color: '#64748b', lineHeight: 1.8 }}>
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* ── Proof ── */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="mb-6 text-2xl font-bold sm:text-3xl" style={{ fontFamily: 'var(--font-syne)', color: '#0f172a' }}>
                            Work that backs this up
                        </h2>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((project) => (
                                <Link
                                    key={project.id}
                                    href={`/capstone/${project.slug}`}
                                    className="group flex flex-col overflow-hidden rounded-2xl transition hover:-translate-y-1"
                                    style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}
                                >
                                    <div className="aspect-video overflow-hidden" style={{ background: '#111a2e' }}>
                                        {project.thumbnail && (
                                            <img
                                                src={project.thumbnail}
                                                alt={project.title}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                                            {project.title}
                                        </p>
                                        <p className="mt-1 line-clamp-2 text-xs" style={{ color: '#94a3b8' }}>
                                            {project.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* ── CTA ── */}
                <section className="mt-16 rounded-2xl p-8 text-center" style={{ background: CARD_BG }}>
                    <h2 className="text-xl font-bold text-white sm:text-2xl" style={{ fontFamily: 'var(--font-syne)' }}>
                        Let&apos;s talk about your {service.shortName.toLowerCase()}
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm" style={{ color: '#94a3b8', lineHeight: 1.8 }}>
                        Send a message describing what you need. You get a straight answer on scope, timeline and price — no sales call, no
                        obligation.
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

                {/* Internal links out — every page should pass equity on. */}
                <nav className="mt-12 flex flex-wrap justify-center gap-3 text-sm">
                    <Link href="/capstone" className="rounded-full border px-4 py-2 text-slate-600 hover:bg-slate-50" style={{ borderColor: BORDER }}>
                        Browse the project catalog
                    </Link>
                    <Link href="/services" className="rounded-full border px-4 py-2 text-slate-600 hover:bg-slate-50" style={{ borderColor: BORDER }}>
                        All services
                    </Link>
                </nav>
            </main>

            <footer className="py-7 text-center text-sm" style={{ borderTop: `1px solid ${BORDER}`, color: '#64748b' }}>
                © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
            </footer>
        </div>
    );
}
