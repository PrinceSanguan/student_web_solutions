import Link from 'next/link';

/**
 * The homepage FAQ.
 *
 * Two jobs. It answers the questions that actually arrive on Messenger, and it
 * backs the `FAQPage` schema emitted alongside it — which is what produces the
 * expandable question list under a Google result.
 *
 * Native `<details>` rather than a client-side accordion, so every answer is in
 * the initial HTML even while collapsed. Schema that describes text a crawler
 * cannot find is a structured-data error, not a rich result.
 */

/** Exported so `app/page.tsx` can feed the identical array to `faqJsonLd()`. */
export const HOME_FAQS = [
    {
        q: 'Magkano ang capstone project?',
        a: 'Ready-made capstone systems start at around ₱10,000. Bigger builds — school information systems, hospital systems, e-commerce — go higher depending on the features. Final pricing is agreed on Messenger after we talk through the requirements, so you know the number before anything starts.',
    },
    {
        q: 'Gaano katagal bago matapos ang system?',
        a: 'Most ready-made capstone systems are delivered in one to two days once requirements are confirmed. Custom builds get their own timeline, agreed before work begins.',
    },
    {
        q: 'Kasama ba ang source code at documentation?',
        a: 'Yes. Complete source code, documentation, and a step-by-step setup guide, in a format ready for submission. Nothing is held back.',
    },
    {
        q: 'Hindi lang ba capstone ang ginagawa ninyo?',
        a: 'No. Alongside capstone projects there are custom business systems, leads AI automation, and Facebook and Google Ads management. Live clients include MASTERmind Chess Café in Angeles City, the Biyaherong Chess Coach training platform, and SJA Martial Arts in Swansea, Wales.',
    },
    {
        q: 'Ano ang leads AI automation?',
        a: 'An AI assistant on your Facebook page and website that answers customer questions in Tagalog or English around the clock, qualifies the serious enquiries, and hands them to you with the whole conversation attached — so nothing sits unanswered overnight.',
    },
    {
        q: 'Nag-hahandle ba kayo ng Facebook Ads at Google Ads?',
        a: 'Yes. Campaigns are set up for enquiries rather than likes, with conversion tracking installed before anything is spent. Everything runs inside your own ad account, so the data and the audiences stay yours.',
    },
    {
        q: 'Paano magsimula?',
        a: 'Message on Facebook and describe what you need — even a rough description works. You get a straight answer on scope, timeline and price, with no sales call.',
    },
];

export function FaqSection() {
    return (
        <section id="faq" className="scroll-mt-20 bg-gray-50 py-16 sm:py-20 md:py-24">
            <div className="mx-auto max-w-4xl px-3 sm:px-4 md:px-6 lg:px-8">
                <div className="mb-10 text-center">
                    <h2 className="mb-4 bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                        Frequently asked questions
                    </h2>
                    <p className="mx-auto max-w-2xl text-gray-600">
                        The questions that come up most on Messenger, answered here so you do not have to ask.
                    </p>
                </div>

                <div className="divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                    {HOME_FAQS.map((faq) => (
                        <details key={faq.q} className="group p-5">
                            <summary className="cursor-pointer list-none text-base font-semibold text-gray-800 marker:content-none">
                                <span className="flex items-start justify-between gap-4">
                                    {faq.q}
                                    <span className="mt-1 shrink-0 text-gray-400 transition group-open:rotate-45" aria-hidden>
                                        +
                                    </span>
                                </span>
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600">{faq.a}</p>
                        </details>
                    ))}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        Read more about each service
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
