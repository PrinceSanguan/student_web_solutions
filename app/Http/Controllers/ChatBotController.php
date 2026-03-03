<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Config;

class ChatBotController extends Controller
{
    public function index(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'conversation' => 'nullable|array',
        ]);

        $userMessage = $validated['message'];
        $conversation = $validated['conversation'] ?? [];

        // Define system prompt
        $systemPrompt = "You are the SWS AI Assistant — a smart, friendly, and professional chatbot for Student Web Solutions, a web development service run by Prince E. Sanguan, a developer with almost 3 years of experience in web development and 2 years in business.

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
        3. If a client seems serious or asks how to proceed, tell them: 'To finalize the pricing and get started, please send us a PM on Facebook: https://www.facebook.com/people/StudentwebSolution/61560390520092/ — just describe your project and we will reply right away!'
        4. Never give a hard fixed price — always say 'around' or 'starting at' and remind them the final price will be confirmed on Facebook.
        5. If they ask who built this or who runs SWS, mention Prince E. Sanguan, founder and lead developer.
        6. If they ask how long it takes, say most systems are delivered live in 1 to 2 days after requirements are confirmed.
        7. If someone wants to see examples of past work, tell them to check the projects section on this website.
        8. Only answer questions related to web development, systems, pricing, and SWS services. For off-topic questions, politely redirect them.
        9. If they speak in Tagalog, reply in Tagalog. If English, reply in English. Be warm, direct, and confident.
        10. Do NOT use markdown formatting like **, ***, or ### in your responses. Write in plain conversational text.";

        // Modify the first user message to include the system instructions
        $modifiedUserMessage = "$systemPrompt\n\nUser query: $userMessage";

        // Format messages for Gemini API
        $messages = [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $modifiedUserMessage]
                ]
            ]
        ];

        // Add conversation history if available, but don't add the first message if it exists
        if (!empty($conversation)) {
            array_unshift($messages, ...$conversation);
        }

        // Get the API key from config
        $apiKey = Config::get('services.gemini.api_key');

        \Log::info('[ChatBot] API Key loaded: ' . (empty($apiKey) ? 'MISSING ❌' : 'Found ✅'));
        \Log::info('[ChatBot] User message: ' . $userMessage);

        try {
            // Make request to Gemini API
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key={$apiKey}", [
                'contents' => $messages,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topP' => 0.95,
                    'topK' => 40,
                    'maxOutputTokens' => 1000,
                ]
            ]);

            // Check for successful response
            if ($response->successful()) {
                $result = $response->json();

                if (isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                    $botResponse = $result['candidates'][0]['content']['parts'][0]['text'];

                    $botResponse = $this->cleanMarkdownFormatting($botResponse);

                    return response()->json([
                        'success' => true,
                        'message' => $botResponse
                    ]);
                }
            }

            // Handle error response
            \Log::error('[ChatBot] Gemini API failed. Status: ' . $response->status());
            \Log::error('[ChatBot] Gemini response body: ' . $response->body());
            return response()->json([
                'success' => false,
                'message' => 'Sorry, I couldn\'t process your request. Please try again later.'
            ], 500);
        } catch (\Exception $e) {
            \Log::error('[ChatBot] Exception: ' . $e->getMessage());
            \Log::error('[ChatBot] Stack trace: ' . $e->getTraceAsString());
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while processing your request.'
            ], 500);
        }
    }

    /**
     * Clean up all markdown formatting from response content
     */
    private function cleanMarkdownFormatting($content)
    {
        // First, let's update the system prompt to instruct Gemini not to use markdown
        // (Add this to your system prompt in the message() method)
        // 'Do not use markdown formatting like ###, **, or * in your responses.'

        // Process the content by removing all markdown

        // Step 1: Remove all headers (lines starting with #)
        $cleaned = preg_replace('/^#{1,6}\s*(.*?)$/m', '$1', $content);

        // Step 2: Handle all asterisk patterns
        // This is a simpler but more effective approach that handles common cases
        $patterns = [
            '/\*{3}([^:*]+):/' => '$1:', // ***Text:
            '/\*{3}([^*]+)\*{3}/' => '$1', // ***Text***
            '/\*{2}([^*]+)\*{2}/' => '$1', // **Text**
            '/\*([^*]+)\*/' => '$1', // *Text*
            '/\*{3}([^*]+)/' => '$1', // ***Text (unclosed)
            '/\*{2}([^*]+)/' => '$1', // **Text (unclosed)
            '/\*([^*]+)/' => '$1', // *Text (unclosed)
        ];

        foreach ($patterns as $pattern => $replacement) {
            $cleaned = preg_replace($pattern, $replacement, $cleaned);
        }

        // Step 3: Remove any remaining asterisks
        $cleaned = str_replace(['***', '**', '*'], '', $cleaned);

        // Step 4: Normalize bullet points (optional - keep this if you want bullet formatting)
        $cleaned = preg_replace('/^\s*[\*\-]\s+/m', '• ', $cleaned);

        return $cleaned;
    }
}
