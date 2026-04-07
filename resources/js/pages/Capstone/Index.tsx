import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

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
    buyers_count: number;
}

interface Props {
    capstones: Capstone[];
}

const CATEGORY_COLORS: Record<string, string> = {
    'Business System': 'bg-blue-500/10 text-blue-600 border-blue-200',
    'School System': 'bg-purple-500/10 text-purple-600 border-purple-200',
    'Government System': 'bg-orange-500/10 text-orange-600 border-orange-200',
    'Healthcare': 'bg-red-500/10 text-red-600 border-red-200',
    'Hospitality': 'bg-teal-500/10 text-teal-600 border-teal-200',
};

const CATEGORIES = ['All', 'Business System', 'School System', 'Government System', 'Healthcare', 'Hospitality'];

export default function CapstoneIndex({ capstones }: Props) {
    const [activeCategory, setActiveCategory] = useState('All');

    const filtered = activeCategory === 'All'
        ? capstones
        : capstones.filter((c) => c.category === activeCategory);

    return (
        <>
            <Head title="Capstone Projects | Student Web Solutions">
                <meta name="description" content="Browse ready-made capstone projects and web systems. Starting at ₱499." />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Nav */}
                <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-800">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Home
                        </Link>
                        <span className="text-sm font-semibold text-gray-800">Student Web Solutions</span>
                    </div>
                </nav>

                {/* Header */}
                <header className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8">
                    <h1 className="mb-3 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl">
                        Capstone Projects
                    </h1>
                    <p className="max-w-xl text-gray-500">
                        Ready-made, fully documented capstone systems. Pick one, pay via GCash, and download instantly.
                        Starting at <span className="font-bold text-green-600">₱499</span>.
                    </p>
                </header>

                {/* Category filter */}
                <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                                    activeCategory === cat
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-gray-200 bg-white text-gray-600 hover:border-blue-300 hover:text-blue-600'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <main className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((capstone) => (
                            <Link
                                key={capstone.id}
                                href={`/capstone/${capstone.slug}`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                {/* Thumbnail */}
                                <div className="aspect-video overflow-hidden bg-gray-100">
                                    {capstone.thumbnail ? (
                                        <img
                                            src={capstone.thumbnail}
                                            alt={capstone.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">🖥️</div>
                                    )}
                                </div>

                                {/* Card body */}
                                <div className="flex flex-1 flex-col p-5">
                                    {/* Category */}
                                    {capstone.category && (
                                        <span className={`mb-3 inline-flex w-fit rounded-full border px-2.5 py-0.5 text-xs font-medium ${CATEGORY_COLORS[capstone.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {capstone.category}
                                        </span>
                                    )}

                                    <h2 className="mb-2 text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {capstone.title}
                                    </h2>
                                    <p className="mb-4 line-clamp-2 flex-1 text-sm text-gray-500">
                                        {capstone.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-lg font-bold text-green-600">
                                                ₱{Number(capstone.price).toLocaleString()}
                                            </span>
                                            {capstone.buyers_count > 0 && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                    </svg>
                                                    {capstone.buyers_count} {capstone.buyers_count === 1 ? 'buyer' : 'buyers'}
                                                </span>
                                            )}
                                        </div>
                                        <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:gap-2 transition-all">
                                            View Details
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            No projects found in this category.
                        </div>
                    )}
                </main>

                {/* Footer strip */}
                <div className="border-t border-gray-100 bg-gray-50 py-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
                </div>
            </div>
        </>
    );
}
