<?php

namespace App\Http\Controllers;

use App\Models\Capstone;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    /**
     * Initiate a GCash checkout via the Chessuno payment gateway.
     */
    public function checkout(Request $request, string $slug)
    {
        Log::info('[Checkout] Request received', [
            'slug'   => $slug,
            'input'  => $request->only('customer_name', 'customer_email'),
            'method' => $request->method(),
            'url'    => $request->fullUrl(),
        ]);

        $validated = $request->validate([
            'customer_name'  => ['required', 'string', 'max:100'],
            'customer_email' => ['required', 'email', 'max:150'],
        ]);

        Log::info('[Checkout] Validation passed', $validated);

        $capstone = Capstone::where('slug', $slug)->firstOrFail();

        Log::info('[Checkout] Capstone found', [
            'capstone_id' => $capstone->id,
            'title'       => $capstone->title,
            'price'       => $capstone->price,
        ]);

        // Create a pending order
        $order = Order::create([
            'capstone_id'    => $capstone->id,
            'reference'      => Order::generateReference(),
            'customer_name'  => $request->customer_name,
            'customer_email' => $request->customer_email,
            'amount'         => $capstone->price,
            'status'         => 'pending',
        ]);

        Log::info('[Checkout] Order created', [
            'order_id'  => $order->id,
            'reference' => $order->reference,
            'amount'    => $order->amount,
        ]);

        // Build the API request payload
        $payload = [
            'reference'    => $order->reference,
            'amount'       => (float) $order->amount,
            'currency'     => 'PHP',
            'description'  => "Purchase: {$capstone->title}",
            'customer'     => [
                'name'  => $order->customer_name,
                'email' => $order->customer_email,
            ],
            'redirect_url' => route('payment.success', ['ref' => $order->reference]),
            'webhook_url'  => route('chessuno.webhook'),
        ];

        $gatewayUrl = config('services.chessuno.gateway_url') . '/api/v1/payments/create';

        Log::info('[Checkout] Calling Chessuno API', [
            'url'          => $gatewayUrl,
            'payload'      => $payload,
            'api_key_set'  => ! empty(config('services.chessuno.api_key')),
            'secret_set'   => ! empty(config('services.chessuno.api_secret')),
        ]);

        try {
            $response = Http::withHeaders([
                'X-API-Key'    => config('services.chessuno.api_key'),
                'X-API-Secret' => config('services.chessuno.api_secret'),
                'Content-Type' => 'application/json',
                'Accept'       => 'application/json',
            ])->timeout(15)->post($gatewayUrl, $payload);

            Log::info('[Checkout] Chessuno API response received', [
                'http_status' => $response->status(),
                'body'        => $response->body(),
            ]);

        } catch (\Throwable $e) {
            Log::error('[Checkout] HTTP request to Chessuno threw an exception', [
                'error'   => $e->getMessage(),
                'order'   => $order->reference,
            ]);

            return back()->withErrors(['payment' => 'Could not reach the payment gateway. Please try again.']);
        }

        if (! $response->successful()) {
            Log::error('[Checkout] Chessuno returned non-2xx status', [
                'http_status' => $response->status(),
                'body'        => $response->body(),
                'order'       => $order->reference,
            ]);

            return back()->withErrors(['payment' => 'Payment gateway rejected the request (HTTP ' . $response->status() . '). Please try again.']);
        }

        $data = $response->json();

        Log::info('[Checkout] Chessuno response parsed', ['data' => $data]);

        $paymentUrl = $data['payment_url'] ?? $data['url'] ?? null;

        if (! $paymentUrl) {
            Log::error('[Checkout] No payment URL in Chessuno response', [
                'response' => $data,
                'order'    => $order->reference,
            ]);

            return back()->withErrors(['payment' => 'Payment gateway did not return a payment URL. Please try again.']);
        }

        $order->update(['payment_url' => $paymentUrl]);

        Log::info('[Checkout] Redirecting to payment URL', [
            'order'       => $order->reference,
            'payment_url' => $paymentUrl,
        ]);

        // Inertia::location() sends a 409 + X-Inertia-Location header,
        // which tells the Inertia client to do a full window.location redirect
        // to an external URL (redirect()->away() gets swallowed by Inertia XHR).
        return Inertia::location($paymentUrl);
    }

    /**
     * Success landing page after redirect from Chessuno.
     */
    public function success(Request $request)
    {
        $ref = $request->query('ref');

        Log::info('[Payment Success] Redirect received', ['ref' => $ref]);

        $order = Order::with('capstone')
            ->where('reference', $ref)
            ->first();

        Log::info('[Payment Success] Order lookup', [
            'ref'   => $ref,
            'found' => $order !== null,
            'status' => $order?->status,
        ]);

        return Inertia::render('Payment/ThankYou', [
            'order' => $order ? [
                'reference'      => $order->reference,
                'status'         => $order->status,
                'amount'         => $order->amount,
                'customer_name'  => $order->customer_name,
                'capstone_title' => $order->capstone?->title,
                'capstone_slug'  => $order->capstone?->slug,
            ] : null,
        ]);
    }
}
