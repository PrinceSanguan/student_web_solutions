import Link from 'next/link';

import { listServices } from '@/lib/services';

/**
 * The services block on the landing page.
 *
 * A Server Component with real prose, deliberately. The homepage previously
 * carried 116 indexable words — everything else was canvas, video and animation,
 * which a crawler cannot read. This section and the FAQ beside it are what give
 * Google something to rank, and they are also the homepage's only links down into
 * the four service pages.
 */
export function ServicesSection() {
    const services = listServices();

    return (
        <section id="services" className="scroll-mt-20 bg-white py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        What we do
                    </h2>
                    <p className="mx-auto max-w-3xl text-gray-600" style={{ lineHeight: 1.85 }}>
                        Student Web Solutions builds software and brings customers to it. That means ready-made capstone projects and custom business
                        systems, AI automation that answers enquiries while you sleep, and Facebook and Google Ads campaigns that put your business in
                        front of people already looking for it.
                    </p>
                    <p className="mx-auto mt-4 max-w-3xl text-gray-600" style={{ lineHeight: 1.85 }}>
                        The work runs from Philippine barangay and school systems to a martial arts academy in Swansea, Wales — the same standard
                        either way.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((service) => (
                        <Link
                            key={service.slug}
                            href={`/services/${service.slug}`}
                            className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span
                                className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-xl"
                                style={{ background: `${service.accent}1f`, border: `1px solid ${service.accent}55` }}
                                aria-hidden
                            >
                                {service.icon}
                            </span>
                            <h3 className="text-base font-bold text-gray-900">{service.name}</h3>
                            <p className="mt-1 text-xs font-medium" style={{ color: service.accent }}>
                                {service.tagline}
                            </p>
                            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{service.heroBody}</p>
                            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold" style={{ color: service.accent }}>
                                Learn more
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 gap-6 rounded-2xl border border-gray-200 bg-gray-50 p-8 sm:grid-cols-3">
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">You own everything</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            Source code, ad accounts, domains and data stay in your name. There is no monthly fee to keep your own system running and
                            nothing switches off if we stop working together.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Priced before we start</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            Scope and price are agreed on Messenger before any work begins. Ready-made capstone systems start at ₱10,000; custom
                            builds and campaign management are quoted against what you actually need.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-gray-900">Built by one developer</h3>
                        <p className="mt-2 text-sm leading-relaxed text-gray-600">
                            You talk to the person writing the code, not an account manager. That is why most ready-made systems ship in one to two
                            days instead of waiting in a queue.
                        </p>
                    </div>
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        See all services
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
