import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Order {
    reference: string;
    status: string;
    amount: number;
    customer_name: string;
    capstone_title: string | null;
    capstone_slug: string | null;
    download_token: string | null;
}

interface Props {
    order: Order | null;
}

export default function ThankYou({ order }: Props) {
    const [localStatus, setLocalStatus] = useState(order?.status ?? 'pending');
    const [localToken, setLocalToken] = useState(order?.download_token ?? null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const isPaid = localStatus === 'paid';

    // Poll /payment/status every 5 seconds when order is still pending.
    // Stops automatically once paid, or when the component unmounts.
    useEffect(() => {
        if (isPaid || !order?.reference) return;

        intervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/payment/status?ref=${encodeURIComponent(order.reference)}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await res.json();

                if (data.status === 'paid') {
                    setLocalStatus('paid');
                    setLocalToken(data.download_token ?? null);
                    if (intervalRef.current) clearInterval(intervalRef.current);
                }
            } catch {
                // Silent fail — polling is best-effort
            }
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Head title="Thank You | Student Web Solutions" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
                <div className="w-full max-w-md text-center">

                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
                        {isPaid ? '✅' : '⏳'}
                    </div>

                    {/* Heading */}
                    <h1 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                        {isPaid ? 'Payment Confirmed!' : 'Thank you for your purchase!'}
                    </h1>

                    <p className="mb-8 text-gray-500">
                        {isPaid
                            ? "Your payment was received. Download your source code below."
                            : 'Your order has been received and is being processed.'}
                    </p>

                    {/* Order card */}
                    {order && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-left">
                            <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Reference</span>
                                    <span className="font-mono font-semibold text-gray-800">{order.reference}</span>
                                </div>
                                {order.capstone_title && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Project</span>
                                        <span className="font-medium text-gray-800">{order.capstone_title}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Amount</span>
                                    <span className="font-bold text-green-600">₱{Number(order.amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                        isPaid
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {isPaid ? 'Paid' : 'Pending'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Download section */}
                    {isPaid && localToken ? (
                        <div className="mb-8">
                            <a
                                href={`/download/${localToken}`}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                                ⬇ Download Source Code
                            </a>
                            <p className="mt-2 text-center text-xs text-gray-400">
                                Link expires 72 hours after payment.
                            </p>
                        </div>
                    ) : isPaid ? (
                        <div className="mb-8 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                            Payment confirmed — generating your download link…
                        </div>
                    ) : (
                        <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
                            Waiting for payment confirmation. This page will update automatically.
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href="/capstone"
                            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Browse More Projects
                        </Link>
                        <Link
                            href="/"
                            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>

                <p className="mt-12 text-xs text-gray-400">
                    © {new Date().getFullYear()} Student Web Solutions. All rights reserved.
                </p>
            </div>
        </>
    );
}
