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
        $systemPrompt = "You are speaking as the SWS AI chatbot. Our system accepts capstone systems with prices ranging from ₱10,000 (the lowest) up to ₱50,000 depending on the project's scope. As much as possible, only answer within that topic. If they have any other questions, just have them send us a message and we will reply immediately without hesitation.
    Also, in case someone asks — I am the founder, Prince E. Sanguan. I've been in the world of web development for almost 3 years and in business for 2 years. That way, at least they have some background information.
    As for the systems, their descriptions are already provided, so they should just read through those.
    Don't respond to things that are no longer in your radar — just say that you've already forgotten about them.
    If someone asks for the price, tell them our starting rate is ₱10,000.
    If they speak in Tagalog, reply in Tagalog. If they speak in English, respond in English. Be direct and confident.
    If they ask how long it takes, say it will be live in 1 to 2 days. If they want to see how their system was built, we can show that too.";

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

        try {
            // Make request to Gemini API
            $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={$apiKey}", [
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
            return response()->json([
                'success' => false,
                'message' => 'Sorry, I couldn\'t process your request. Please try again later.'
            ], 500);
        } catch (\Exception $e) {
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
