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
}

interface Props {
    capstone: Capstone;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Business System':   'bg-blue-500/10 text-blue-600 border-blue-200',
    'School System':     'bg-purple-500/10 text-purple-600 border-purple-200',
    'Government System': 'bg-orange-500/10 text-orange-600 border-orange-200',
    'Healthcare':        'bg-red-500/10 text-red-600 border-red-200',
    'Hospitality':       'bg-teal-500/10 text-teal-600 border-teal-200',
};

const INCLUDED = [
    { icon: '📁', label: 'Complete source code' },
    { icon: '📄', label: 'Full documentation (PDF)' },
    { icon: '▶️', label: 'Step-by-step setup tutorial' },
    { icon: '🎓', label: 'Submission-ready' },
];

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
    }>({
        customer_name:  '',
        customer_email: '',
    });

    function handleCheckout(e: React.FormEvent) {
        e.preventDefault();
        post(`/capstone/${capstone.slug}/checkout`);
    }

    return (
        <>
            <Head title={`${capstone.title} | Student Web Solutions`}>
                <meta name="description" content={capstone.description.slice(0, 155)} />
            </Head>

            <div className="min-h-screen bg-white">
                {/* Nav */}
                <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/capstone" className="flex items-center gap-2 text-sm text-gray-500 transition hover:text-gray-800">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Catalog
                        </Link>
                        <span className="text-sm font-semibold text-gray-800">Student Web Solutions</span>
                    </div>
                </nav>

                <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

                        {/* Left — Thumbnail + Included */}
                        <div className="space-y-4">
                            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-sm">
                                {capstone.thumbnail ? (
                                    <img
                                        src={capstone.thumbnail}
                                        alt={capstone.title}
                                        className="aspect-video w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex aspect-video w-full items-center justify-center text-6xl text-gray-200">🖥️</div>
                                )}
                            </div>

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    What's included
                                </h3>
                                <ul className="space-y-2">
                                    {INCLUDED.map((item) => (
                                        <li key={item.label} className="flex items-center gap-3 text-sm text-gray-700">
                                            <span className="text-base">{item.icon}</span>
                                            {item.label}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Right — Info + Checkout */}
                        <div className="flex flex-col">
                            {capstone.category && (
                                <span className={`mb-4 inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[capstone.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                    {capstone.category}
                                </span>
                            )}

                            <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                                {capstone.title}
                            </h1>

                            <p className="mb-6 leading-relaxed text-gray-600">{capstone.description}</p>

                            {capstone.technologies && capstone.technologies.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Tech Stack</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {capstone.technologies.map((tech) => (
                                            <span key={tech} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Price */}
                            <div className={`mb-6 rounded-2xl border px-5 py-4 ${capstone.is_available ? 'border-green-100 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-4xl font-bold ${capstone.is_available ? 'text-green-600' : 'text-gray-400'}`}>
                                        ₱{Number(capstone.price).toLocaleString()}
                                    </span>
                                    <span className={`text-sm ${capstone.is_available ? 'text-green-500' : 'text-gray-400'}`}>one-time payment</span>
                                </div>
                                {capstone.is_available ? (
                                    <p className="mt-1 text-xs text-green-600">💚 Pay via GCash — download link sent to your email after payment.</p>
                                ) : (
                                    <p className="mt-1 text-xs text-red-500">This project has already been sold and is no longer available.</p>
                                )}
                            </div>

                            {/* Checkout form or buttons */}
                            {alreadyBought ? (
                                <div className="flex flex-col gap-3">
                                    <div className="rounded-xl border border-green-100 bg-green-50 px-5 py-4 text-sm text-green-800">
                                        <p className="font-semibold">You already purchased this project.</p>
                                        <p className="mt-1 text-green-700">
                                            Check your email for the download link. Links expire 72 hours after payment.
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Didn't receive it?{' '}
                                            <a href="mailto:princesanguan44@gmail.com" className="underline">
                                                Contact support
                                            </a>.
                                        </p>
                                    </div>
                                    {capstone.demo_url && (
                                        <a
                                            href={capstone.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Demo
                                        </a>
                                    )}
                                </div>
                            ) : !capstone.is_available ? (
                                <div className="flex flex-col gap-3">
                                    {capstone.demo_url && (
                                        <a
                                            href={capstone.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Demo
                                        </a>
                                    )}
                                    <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                                        Sold Out — No Longer Available
                                    </div>
                                    <Link href="/capstone" className="text-center text-sm text-gray-500 hover:underline">
                                        Browse other projects →
                                    </Link>
                                </div>
                            ) : !showForm ? (
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    {capstone.demo_url && (
                                        <a
                                            href={capstone.demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
                                        >
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            View Demo
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        💳 Checkout via GCash
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleCheckout} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                                    <h3 className="mb-4 text-sm font-semibold text-gray-700">Enter your details to continue</h3>

                                    <div className="mb-3">
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Full Name</label>
                                        <input
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData('customer_name', e.target.value)}
                                            placeholder="e.g. Juan dela Cruz"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            required
                                        />
                                        {errors.customer_name && <p className="mt-1 text-xs text-red-500">{errors.customer_name}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Email Address</label>
                                        <input
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData('customer_email', e.target.value)}
                                            placeholder="e.g. juan@email.com"
                                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                            required
                                        />
                                        {errors.customer_email && <p className="mt-1 text-xs text-red-500">{errors.customer_email}</p>}
                                    </div>

                                    {errors.payment && (
                                        <p className="mb-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">
                                            {errors.payment}
                                        </p>
                                    )}

                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
                                        >
                                            {processing ? 'Redirecting…' : '💳 Pay ₱' + Number(capstone.price).toLocaleString()}
                                        </button>
                                    </div>

                                    <p className="mt-3 text-center text-xs text-gray-400">
                                        You'll be redirected to GCash to complete payment securely.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </main>

                <div className="border-t border-gray-100 bg-gray-50 py-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
                </div>
            </div>
        </>
    );
}
