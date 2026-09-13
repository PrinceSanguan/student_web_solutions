import type { NextRequest } from 'next/server';

import { clientIp, hit } from '@/lib/rate-limit';

/**
 * Replaces `ChatBotController` and the `throttle:chatbot` rate limiter.
 *
 * The system prompt, the model, the generation settings and the markdown stripper
 * are all carried over unchanged — the prices it quotes are the business's real
 * price list and must stay in step with the JSON-LD in `lib/site.ts`.
 */

const MODEL = 'gemini-2.5-flash-lite';

/** `Limit::perMinute(3)` from `AppServiceProvider::boot`. */
const RATE_LIMIT = 3;
const RATE_WINDOW_SECONDS = 60;

const SYSTEM_PROMPT = `You are the SWS AI Assistant — a smart, friendly, and professional chatbot for Student Web Solutions, a web development service run by Prince E. Sanguan, a developer with almost 3 years of experience in web development and 2 years in business.

        Your job is to help potential clients understand our services and pricing, and guide serious clients toward booking.

        PRICING GUIDE (always give these as estimates, final price is discussed on Facebook):
        - Basic website (landing page, portfolio, simple business site): ₱10,000 - ₱15,000
        - Library System (basic with borrowing, return, inventory): ₱15,000
        - Library System with AI integration (smart search, recommendations, chatbot): ₱20,000
        - School / Student Information System: ₱18,000 - ₱25,000
        - POS / Inventory System: ₱15,000 - ₱20,000
        - Capstone systems (general): ₱10,000 - ₱50,000 depending on scope and features
        - E-commerce / Online Shop: ₱20,000 - ₱35,000
        - Custom SAAS or complex systems: ₱30,000 - ₱50,000+
        - Adding AI integration to any system: add ₱5,000 - ₱10,000 to the base price
        - Delivery time: 1 to 2 days for most systems after full requirements are confirmed

        RULES:
        1. Always clarify that prices are ESTIMATES only. Final pricing is discussed and finalized on Facebook Messenger.
        2. If a client asks about a specific system not listed, make a smart estimate based on complexity — simpler systems start at ₱10,000, more complex ones go higher.
        3. If a client seems serious or asks how to proceed, tell them: 'To discuss pricing and get started, please send us a PM on Facebook: https://www.facebook.com/Grandmaster1997/ — just describe your project and we will reply right away!'
        4. Never give a hard fixed price — always say 'around' or 'starting at' and remind them the final price will be confirmed on Facebook.
        5. If they ask who built this or who runs SWS, mention Prince E. Sanguan, founder and lead developer.
        6. If they ask how long it takes, say most systems are delivered live in 1 to 2 days after requirements are confirmed.
        7. If someone wants to see examples of past work, tell them to check the projects section on this website.
        8. Only answer questions related to web development, systems, pricing, and SWS services. For off-topic questions, politely redirect them.
        9. If they speak in Tagalog, reply in Tagalog. If English, reply in English. Be warm, direct, and confident.
        10. Do NOT use markdown formatting like **, ***, or ### in your responses. Write in plain conversational text.`;

interface GeminiPart {
    text: string;
}

interface GeminiMessage {
    role: 'user' | 'model';
    parts: GeminiPart[];
}

/**
 * The browser sends its own transcript, so it cannot be trusted as-is. Anything
 * that is not a well-formed turn is dropped rather than forwarded.
 */
function sanitizeConversation(raw: unknown): GeminiMessage[] {
    if (!Array.isArray(raw)) return [];

    return raw.flatMap((entry): GeminiMessage[] => {
        if (typeof entry !== 'object' || entry === null) return [];
        const { role, parts } = entry as { role?: unknown; parts?: unknown };
        if (role !== 'user' && role !== 'model') return [];
        if (!Array.isArray(parts)) return [];

        const texts = parts.flatMap((part) => {
            const text = (part as { text?: unknown })?.text;
            return typeof text === 'string' ? [{ text: text.slice(0, 4000) }] : [];
        });
        if (!texts.length) return [];

        return [{ role, parts: texts }];
    });
}

/**
 * Strips markdown the model emits despite being asked not to. Ported verbatim from
 * `cleanMarkdownFormatting` — the chat bubbles render plain text, so a stray `**`
 * would show up literally.
 */
function cleanMarkdownFormatting(content: string): string {
    let cleaned = content.replace(/^#{1,6}\s*(.*?)$/gm, '$1');

    const patterns: [RegExp, string][] = [
        [/\*{3}([^:*]+):/g, '$1:'],
        [/\*{3}([^*]+)\*{3}/g, '$1'],
        [/\*{2}([^*]+)\*{2}/g, '$1'],
        [/\*([^*]+)\*/g, '$1'],
        [/\*{3}([^*]+)/g, '$1'],
        [/\*{2}([^*]+)/g, '$1'],
        [/\*([^*]+)/g, '$1'],
    ];
    for (const [pattern, replacement] of patterns) {
        cleaned = cleaned.replace(pattern, replacement);
    }

    cleaned = cleaned.split('***').join('').split('**').join('').split('*').join('');
    cleaned = cleaned.replace(/^\s*[*-]\s+/gm, '• ');

    return cleaned;
}

export async function POST(request: NextRequest) {
    const ip = clientIp(request.headers);
    const limit = hit(`chatbot:${ip}`, RATE_LIMIT, RATE_WINDOW_SECONDS);
    if (!limit.ok) {
        // `retryAfter` is in the body because the chat UI reads it from there.
        return Response.json(
            { success: false, message: 'Too many messages.', retryAfter: limit.retryAfter },
            { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return Response.json({ success: false, message: 'Invalid request body.' }, { status: 400 });
    }

    const { message, conversation } = (body ?? {}) as { message?: unknown; conversation?: unknown };

    // Same rules as the Laravel validator: required, string, max 1000.
    if (typeof message !== 'string' || !message.trim()) {
        return Response.json({ success: false, message: 'A message is required.' }, { status: 422 });
    }
    if (message.length > 1000) {
        return Response.json({ success: false, message: 'The message may not be greater than 1000 characters.' }, { status: 422 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[ChatBot] GEMINI_API_KEY is missing.');
        return Response.json({ success: false, message: 'The assistant is not configured yet. Please try again later.' }, { status: 503 });
    }

    // The system prompt rides along with the user's message because Gemini's
    // v1beta generateContent has no separate system role in this shape. Same
    // approach the controller used.
    const messages: GeminiMessage[] = [
        ...sanitizeConversation(conversation),
        { role: 'user', parts: [{ text: `${SYSTEM_PROMPT}\n\nUser query: ${message}` }] },
    ];

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Header rather than a query string, so the key cannot leak into logs.
                'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
                contents: messages,
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.95,
                    topK: 40,
                    maxOutputTokens: 1000,
                },
            }),
        });

        if (!response.ok) {
            console.error(`[ChatBot] Gemini API failed. Status: ${response.status}`);
            console.error(`[ChatBot] Gemini response body: ${await response.text()}`);
            return Response.json({ success: false, message: "Sorry, I couldn't process your request. Please try again later." }, { status: 502 });
        }

        const result = (await response.json()) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
        };

        const reply = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
            console.error('[ChatBot] Gemini returned no candidate text.');
            return Response.json({ success: false, message: "Sorry, I couldn't process your request. Please try again later." }, { status: 502 });
        }

        return Response.json({ success: true, message: cleanMarkdownFormatting(reply) });
    } catch (error) {
        console.error('[ChatBot] Exception:', error);
        return Response.json({ success: false, message: 'An error occurred while processing your request.' }, { status: 500 });
    }
}
