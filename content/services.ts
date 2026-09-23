import type { Service } from '@/lib/types';

/**
 * The service pages.
 *
 * This is copy, not code — edit it and redeploy, the same way `capstones.json`
 * works. It lives in TypeScript rather than JSON so the shape is checked at build
 * time and the prose can keep its apostrophes without escaping.
 *
 * Every page here exists because the site previously said nothing about three of
 * the four things the business actually sells. A page cannot rank for a phrase it
 * does not contain, and one page cannot rank for four unrelated phrases at once —
 * hence one page per service, each with its own title, description and FAQ.
 */
export const SERVICES: Service[] = [
    {
        slug: 'web-development',
        name: 'Web Development',
        /** Used in nav, cards and breadcrumbs. */
        shortName: 'Web Development',
        tagline: 'Capstone projects and custom business systems',
        icon: '🎓',
        accent: '#38bdf8',
        metaTitle: 'Capstone Projects & Custom Web Systems Philippines',
        metaDescription:
            'Capstone project maker in the Philippines. Ready-made thesis systems, library and POS systems, plus custom web applications built for real businesses. Delivered with source code and documentation.',
        heroHeading: 'Capstone Projects & Custom Web Systems',
        heroBody:
            'Ready-made capstone systems for Filipino students, and custom web applications for businesses that need software built properly the first time.',
        sections: [
            {
                heading: 'Capstone projects, ready to defend',
                body: [
                    'Every capstone in the catalog is a complete, working system — not a demo and not a template with the data pulled out. You get the full source code, the documentation, a setup guide, and a build that is ready to submit and defend.',
                    'The catalog covers the systems Filipino students are actually assigned: library and inventory management, school and student information systems, point-of-sale, hospital and clinic records, barangay and local government systems, and rental or booking platforms. Most are built on Laravel or Next.js with MySQL or PostgreSQL, which is what most Philippine schools expect to see.',
                    'If the system you need is not in the catalog, it gets built to your requirements. Scope and features are agreed up front so there are no surprises the week before your defence.',
                ],
            },
            {
                heading: 'Custom systems for real businesses',
                body: [
                    'The same work goes into client software. MASTERmind Chess Café in Angeles City runs its entire operation on a custom rating and café management system — player accounts, an Elo engine, a staff terminal, queueing, tournaments and monthly rewards, all managed by the owner without a developer on call.',
                    'Biyaherong Chess Coach is a subscription training platform with 10,000+ rated puzzles, AI coaches, engine analysis and an Android app on Google Play. SJA Martial Arts in Swansea, Wales is a booking and programme site for a UK academy — proof the work travels.',
                    'Whether it is a booking flow, an inventory system, a members area or a full SaaS, the deliverable is the same: software that runs in production and that you can actually operate.',
                ],
            },
            {
                heading: 'How the work runs',
                body: [
                    'Requirements first. We agree exactly what the system does, who uses it, and what each role can see, before any code is written. That conversation is what keeps the price honest.',
                    'Most ready-made capstone systems are delivered in one to two days once requirements are confirmed. Custom builds depend on scope and get their own timeline, agreed before starting.',
                    'You get the source code. There is no lock-in, no monthly fee to keep your own system running, and no hidden dependency you cannot replace.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Magkano ang capstone project?',
                a: 'Ready-made capstone systems start at around ₱10,000. Larger builds — school information systems, hospital systems, full e-commerce — run higher depending on the features. Final pricing is agreed on Messenger after we talk through your requirements, so you know the number before anything starts.',
            },
            {
                q: 'Kasama ba ang source code at documentation?',
                a: 'Yes. Every capstone is delivered with the complete source code, documentation, and a step-by-step setup guide, in a format ready for submission. Nothing is withheld.',
            },
            {
                q: 'Gaano katagal bago matapos?',
                a: 'Most ready-made systems are delivered in one to two days after requirements are confirmed. Custom builds are quoted with their own timeline before work begins.',
            },
            {
                q: 'Can you build a system that is not in the catalog?',
                a: 'Yes — custom builds are most of the work. Send the requirements, the school or client specification, or even a rough description, and you will get a scope and a price back.',
            },
            {
                q: 'Do you work with clients outside the Philippines?',
                a: 'Yes. SJA Martial Arts is a martial arts academy in Swansea, Wales, and the site was delivered from the Philippines. Remote work across time zones is normal here.',
            },
        ],
        relatedSlugs: ['mastermind-chess-cafe', 'biyaherong-chess-coach', 'hospital-management-system-with-patient-portal'],
    },
    {
        slug: 'ai-automation',
        name: 'Leads AI Automation',
        shortName: 'AI Automation',
        tagline: 'Stop losing enquiries you already paid for',
        icon: '🤖',
        accent: '#a78bfa',
        metaTitle: 'Leads AI Automation Philippines — Chatbots & Workflow Automation',
        metaDescription:
            'AI automation for Philippine businesses: Messenger and website chatbots that answer and qualify leads 24/7, automatic follow-up, and workflow automation that removes manual admin work.',
        heroHeading: 'Leads AI Automation',
        heroBody:
            'Most businesses do not have a traffic problem. They have a response problem — enquiries arrive at 11pm and get answered at noon the next day, by which time the customer has messaged someone else.',
        sections: [
            {
                heading: 'Answer every enquiry, immediately',
                body: [
                    'An AI assistant sits on your Facebook page and your website and answers the questions you get twenty times a week: what do you charge, where are you located, are you open on Sunday, do you have this in stock. It answers in English or Tagalog, in your own words, using prices and policies you set.',
                    'The point is not to replace you. It is to hold the conversation for the four hours between the customer messaging and you seeing it, so the lead is still warm when you arrive.',
                    'When a question needs a real person, the assistant hands over cleanly with the whole conversation attached, so you are not asking the customer to repeat themselves.',
                ],
            },
            {
                heading: 'Qualify and route automatically',
                body: [
                    'Not every enquiry is worth the same. The assistant asks the two or three questions that separate a serious buyer from someone browsing — budget, timeline, location, what exactly they need — and tags the conversation accordingly.',
                    'Qualified leads get pushed where you will actually see them: a Google Sheet, a CRM, an email, or a notification on your phone. Unqualified ones still get a polite, useful answer, which is how you avoid bad reviews from people who were never going to buy.',
                    'Follow-up runs on its own. A lead that went quiet gets a nudge after a day, and another after three, with messages you approve in advance.',
                ],
            },
            {
                heading: 'Automate the admin behind it',
                body: [
                    'The same plumbing removes manual work elsewhere: bookings written straight into a calendar, order confirmations sent without anyone typing them, daily sales or enquiry summaries delivered each morning, spreadsheets updated from form submissions.',
                    'These are built on the tools you already pay for — Facebook, Google Workspace, your existing website — rather than moving your whole operation onto a new platform you would have to learn.',
                    'Everything is documented, and you keep the accounts and the access. If we stop working together, nothing switches off.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Marunong bang mag-Tagalog ang AI?',
                a: 'Yes. The assistant replies in whichever language the customer uses — Tagalog, English, or a mix. The tone and the wording are set by you, so it sounds like your business and not like a robot.',
            },
            {
                q: 'Mapapalitan ba nito ang staff ko?',
                a: 'It is not meant to. It covers the hours nobody is at the desk and the repetitive questions that eat the day. Anything that needs judgement gets handed to a person with the full conversation attached.',
            },
            {
                q: 'What does it connect to?',
                a: 'Facebook Messenger, your website, Google Sheets and Calendar, email, and most CRMs. If you already use a tool, the usual answer is that it can be connected.',
            },
            {
                q: 'How much does AI automation cost?',
                a: 'It depends on how many channels it covers and how much it has to connect to. A Messenger assistant with lead capture is the usual starting point; full workflow automation costs more. Message on Facebook with what you want automated and you get a quote.',
            },
            {
                q: 'Paano kung mali ang sagot ng AI?',
                a: 'It answers from information you provide — your prices, your policies, your FAQs — not from guesswork. Anything outside that gets routed to you instead of invented. The answers are reviewed and adjusted after launch.',
            },
        ],
        relatedSlugs: ['mastermind-chess-cafe', 'biyaherong-chess-coach'],
    },
    {
        slug: 'facebook-ads',
        name: 'Facebook Ads Management',
        shortName: 'Facebook Ads',
        tagline: 'Where Filipino customers actually are',
        icon: '📘',
        accent: '#60a5fa',
        metaTitle: 'Facebook Ads Management Philippines — Lead Generation',
        metaDescription:
            'Facebook and Instagram ads management for Philippine businesses. Campaign setup, audience targeting, creative, pixel tracking and reporting — built to produce enquiries, not impressions.',
        heroHeading: 'Facebook Ads Management',
        heroBody:
            'Boosting a post is not advertising. A campaign with the right objective, the right audience and working conversion tracking is — and the difference shows up in your inbox.',
        sections: [
            {
                heading: 'Built for enquiries, not likes',
                body: [
                    'Facebook is where most Philippine buying decisions start, which is also why most Facebook budgets get wasted. Boosted posts optimise for engagement, so Facebook shows them to people who like and scroll — not to people who message and buy.',
                    'Campaigns here are set up for the outcome you actually want: messages to your page, form submissions, bookings, or purchases. The objective, the audience and the creative are chosen for that outcome and nothing else.',
                    'Tracking is installed properly — the Pixel and Conversions API together, so results are still measured when browsers block the Pixel. Without that you are guessing, and guessing is expensive.',
                ],
            },
            {
                heading: 'Targeting that matches your business',
                body: [
                    'Location targeting down to the city or a radius around your shop, so a barbershop in Angeles is not paying for clicks from Davao. Age, interest and behaviour layers built from who already buys from you.',
                    'Custom audiences from your existing customer list and page engagement, and lookalike audiences built from your best buyers — the single highest-leverage targeting available on the platform, and the one most accounts never turn on.',
                    'Retargeting for people who visited, watched, or messaged and did not finish. That audience is small, cheap and converts better than anything else you can buy.',
                ],
            },
            {
                heading: 'Creative, testing and reporting',
                body: [
                    'Ad creative written and designed for the offer — image and video, in Tagalog or English, with hooks tested against each other rather than chosen by opinion.',
                    'Several variations run at once, the losers get switched off, and budget moves to what works. This is the part that separates an account that improves from an account that plateaus.',
                    'Reporting shows cost per enquiry and cost per customer, not reach and impressions. If it is not producing leads at a price that works for you, we change it or stop it.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Magkano ang budget na kailangan sa Facebook Ads?',
                a: 'Ad spend goes to Facebook and is separate from management. Small local businesses often start around ₱300 to ₱500 a day, which is enough to gather real data. Starting far below that mostly produces noise. Management is quoted separately based on the number of campaigns.',
            },
            {
                q: 'Gaano katagal bago may resulta?',
                a: 'The first enquiries often arrive within days, but the first week or two is the algorithm learning. Real judgement comes after enough conversions to be meaningful — usually two to four weeks.',
            },
            {
                q: 'Sino ang may-ari ng ad account?',
                a: 'You do. Campaigns run inside your own Business Manager and ad account. If we stop working together, everything — the account, the audiences, the data — stays with you.',
            },
            {
                q: 'Boost post na lang, pwede na ba?',
                a: 'Boosting optimises for engagement, so Facebook finds people who react rather than people who buy. It is the reason so many businesses conclude "hindi effective ang FB ads" — the campaign was never pointed at the right outcome.',
            },
            {
                q: 'Gagawa rin ba kayo ng creative?',
                a: 'Yes. Ad copy and creative are part of the work, tested in variations. If you have photos or video of the real business, those usually outperform stock.',
            },
        ],
        relatedSlugs: ['sja-martial-arts', 'mastermind-chess-cafe'],
    },
    {
        slug: 'google-ads',
        name: 'Google Ads Management',
        shortName: 'Google Ads',
        tagline: 'Catch people already searching for you',
        icon: '🔍',
        accent: '#34d399',
        metaTitle: 'Google Ads Management Philippines — Search Campaigns',
        metaDescription:
            'Google Ads management for Philippine businesses. Search campaigns, keyword research, conversion tracking and landing pages built to turn high-intent searches into enquiries.',
        heroHeading: 'Google Ads Management',
        heroBody:
            'Facebook interrupts people. Google catches them at the exact moment they are looking for what you sell — which is why a search click is worth more than a scroll.',
        sections: [
            {
                heading: 'Intent is the whole advantage',
                body: [
                    'Someone typing "BJJ classes near me" or "pharmacy POS system Philippines" has already decided they want the thing. There is no persuading left to do — you only have to be there, and be credible.',
                    'Campaigns are built around the keywords that carry that intent, and just as importantly around the negative keywords that stop you paying for "free", "libre", "tutorial" and "jobs" — which is where a surprising share of untended budgets go.',
                    'This is not theory. SJA Martial Arts, the Swansea academy in the project catalog, runs Google Ads conversion tracking on its site so every enquiry is attributed to the campaign that produced it.',
                ],
            },
            {
                heading: 'Tracking that tells the truth',
                body: [
                    'Conversion tracking is installed before anything is spent. Calls, form submissions, bookings and messages are each counted as their own conversion, so you can see which one the money is actually buying.',
                    'Without it, Google optimises toward clicks and you optimise toward hope. With it, the campaign teaches itself which searches produce customers and shifts budget there.',
                    'Reporting is in the terms you care about: cost per enquiry, cost per customer, and which search terms produced them.',
                ],
            },
            {
                heading: 'Landing pages that finish the job',
                body: [
                    'A good ad pointed at a bad page is wasted money, and it also raises what Google charges you — Quality Score means a slow or irrelevant page costs more per click.',
                    'Where the existing site is the bottleneck, the landing page gets built as part of the work. That is the same skill as the rest of this business: fast, clear pages with one obvious next step.',
                    'Google Search and Maps for local businesses, with Performance Max where it genuinely fits rather than because it was the default.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Alin ang mas maganda, Google Ads o Facebook Ads?',
                a: 'They do different jobs. Google catches people already searching — higher intent, usually higher cost per click. Facebook creates demand among people who were not looking yet — cheaper clicks, more persuasion needed. Businesses selling something people actively search for should usually start with Google; businesses selling discovery products start with Facebook.',
            },
            {
                q: 'Magkano ang budget sa Google Ads?',
                a: 'Cost per click varies a lot by industry, so budget is set from your target cost per enquiry rather than a flat number. We work out what a customer is worth to you first, then set spend from that.',
            },
            {
                q: 'Kailangan ba ng bagong website?',
                a: 'Not always. If your current page loads fast and makes the next step obvious, it can work as it is. If it is the reason clicks are not converting, building a landing page is part of the service.',
            },
            {
                q: 'Akin ba ang Google Ads account?',
                a: 'Yes. Everything runs in your own account, and the history, conversion data and audiences stay with you.',
            },
            {
                q: 'Gaano katagal bago mag-rank sa Google?',
                a: 'Ads appear as soon as the campaign is approved, usually within a day — that is the point of paying. Ranking organically is a different job and takes months, which is why the two are often run together.',
            },
        ],
        relatedSlugs: ['sja-martial-arts'],
    },
];
