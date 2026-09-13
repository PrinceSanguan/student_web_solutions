'use client';

import Link from 'next/link';
import { useState } from 'react';

import { routes } from '@/lib/routes';
import type { PublicCapstone } from '@/lib/types';

/**
 * Ported from `pages/Capstone/Index.tsx`.
 *
 * The page itself is a Server Component that reads the store; only the category
 * filter and the hover state need the client, so that is all this holds.
 *
 * The `'Syne'` / `'DM Sans'` families are now `var(--font-*)` tokens supplied by
 * next/font in the root layout — the same faces, self-hosted instead of fetched
 * from Google on every visit.
 */

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
    'Business System': { bg: 'rgba(59,130,246,0.08)', text: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
    'School System': { bg: 'rgba(139,92,246,0.08)', text: '#6d28d9', border: 'rgba(139,92,246,0.25)' },
    'Government System': { bg: 'rgba(245,158,11,0.08)', text: '#92400e', border: 'rgba(245,158,11,0.25)' },
    Healthcare: { bg: 'rgba(239,68,68,0.08)', text: '#b91c1c', border: 'rgba(239,68,68,0.25)' },
    Hospitality: { bg: 'rgba(16,185,129,0.08)', text: '#065f46', border: 'rgba(16,185,129,0.25)' },
};

const CATEGORY_DOTS: Record<string, string> = {
    'Business System': '#60a5fa',
    'School System': '#a78bfa',
    'Government System': '#fbbf24',
    Healthcare: '#f87171',
    Hospitality: '#34d399',
};

const CATEGORIES = ['All', 'Business System', 'School System', 'Government System', 'Healthcare', 'Hospitality'];

const PAGE_BG = '#ffffff';
const CARD_BG = '#0d1526';
const BORDER = 'rgba(0,0,0,0.08)';
const NAV_BG = 'rgba(255,255,255,0.95)';

export function CapstoneCatalog({ capstones }: { capstones: PublicCapstone[] }) {
    const [activeCategory, setActiveCategory] = useState('All');
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    const filtered = activeCategory === 'All' ? capstones : capstones.filter((c) => c.category === activeCategory);

    return (
        <div className="flex min-h-screen flex-col" style={{ background: PAGE_BG, fontFamily: 'var(--font-dm-sans)' }}>
            {/* ── Nav ── */}
            <nav style={{ background: NAV_BG, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${BORDER}` }} className="sticky top-0 z-50">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link
                        href={routes.home}
                        className="flex items-center gap-2 text-sm transition"
                        style={{ color: '#64748b' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>
                    <span className="text-sm font-semibold" style={{ fontFamily: 'var(--font-syne)', letterSpacing: '0.01em', color: '#0f172a' }}>
                        Student Web Solutions
                    </span>
                </div>
            </nav>

            {/* ── Hero ── */}
            <header className="mx-auto w-full max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
                <div
                    className="mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                    style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.2)', color: '#0369a1' }}
                >
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: '#38bdf8' }} />
                    Ready-made systems + custom builds
                </div>

                <h1
                    style={{ fontFamily: 'var(--font-syne)', lineHeight: 1.05, color: '#0f172a' }}
                    className="text-5xl font-extrabold sm:text-6xl lg:text-7xl"
                >
                    Capstone
                    <br />
                    <span
                        style={{
                            background: 'linear-gradient(120deg, #38bdf8 0%, #818cf8 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Projects
                    </span>
                </h1>

                <p className="mt-5 max-w-md text-base" style={{ color: '#64748b', lineHeight: 1.75 }}>
                    Ready-made, fully documented web systems built for Filipino students — or a custom build made to your exact requirements. Message
                    the developer to discuss your project and get a quote.
                </p>
            </header>

            {/* ── Filter pills ── */}
            <div className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                        const active = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="rounded-full px-4 py-1.5 text-sm font-medium transition-all"
                                style={
                                    active
                                        ? {
                                              background: 'linear-gradient(120deg, #38bdf8, #818cf8)',
                                              color: '#fff',
                                              border: '1px solid transparent',
                                              boxShadow: '0 0 20px rgba(56,189,248,0.25)',
                                          }
                                        : {
                                              background: 'rgba(0,0,0,0.04)',
                                              color: '#475569',
                                              border: '1px solid rgba(0,0,0,0.1)',
                                          }
                                }
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Grid ── */}
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 sm:px-6 lg:px-8">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32" style={{ color: '#94a3b8' }}>
                        <svg className="mb-4 h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <p className="text-sm">No projects found in this category.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((capstone) => {
                            const catStyle = capstone.category ? CATEGORY_STYLES[capstone.category] : null;
                            const catDot = capstone.category ? CATEGORY_DOTS[capstone.category] : null;
                            const isHovered = hoveredId === capstone.id;

                            return (
                                <Link
                                    key={capstone.id}
                                    href={routes.capstone.show(capstone.slug)}
                                    className="group flex flex-col overflow-hidden rounded-2xl"
                                    style={{
                                        background: CARD_BG,
                                        border: isHovered ? '1px solid rgba(56,189,248,0.22)' : `1px solid ${BORDER}`,
                                        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                                        boxShadow: isHovered ? '0 24px 48px rgba(56,189,248,0.08), 0 4px 16px rgba(0,0,0,0.4)' : 'none',
                                        transition: 'transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease',
                                    }}
                                    onMouseEnter={() => setHoveredId(capstone.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                >
                                    {/* Thumbnail */}
                                    <div className="aspect-video overflow-hidden" style={{ background: '#111a2e' }}>
                                        {capstone.thumbnail ? (
                                            <img
                                                src={capstone.thumbnail}
                                                alt={capstone.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <svg
                                                    className="h-14 w-14"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={0.75}
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

                                    {/* Body */}
                                    <div className="flex flex-1 flex-col p-5">
                                        {capstone.category && catStyle && (
                                            <span
                                                className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                                style={{ background: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}
                                            >
                                                <span
                                                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                                                    style={{ background: catDot ?? '#64748b' }}
                                                />
                                                {capstone.category}
                                            </span>
                                        )}

                                        <h2 className="mb-2 text-base leading-snug font-bold text-white" style={{ fontFamily: 'var(--font-syne)' }}>
                                            {capstone.title}
                                        </h2>

                                        <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                                            {capstone.description}
                                        </p>

                                        <div className="flex items-end justify-between">
                                            <span className="text-xs font-medium" style={{ color: '#64748b' }}>
                                                Contact for pricing
                                            </span>
                                            <span
                                                className="flex items-center gap-1 text-xs font-medium transition-all"
                                                style={{ color: isHovered ? '#38bdf8' : '#64748b', gap: isHovered ? '6px' : '4px' }}
                                            >
                                                View
                                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="py-7 text-center text-sm" style={{ borderTop: `1px solid ${BORDER}`, background: '#ffffff', color: '#64748b' }}>
                © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
            </footer>
        </div>
    );
}
