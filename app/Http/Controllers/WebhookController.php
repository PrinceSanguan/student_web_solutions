<?php

namespace App\Http\Controllers;

use App\Mail\PurchaseConfirmationMail;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    /**
     * Handle incoming Chessuno payment webhook.
     *
     * Verification: HMAC-SHA256 of the raw request body using CHESSUNO_WEBHOOK_SECRET,
     * compared against the HTTP_X_CHESSPH_SIGNATURE header.
     */
    public function handle(Request $request)
    {
        // 1. Read raw body for signature verification
        $rawBody  = $request->getContent();
        $received = $request->header('X-Chessph-Signature');

        // 2. Verify signature
        $expected = hash_hmac('sha256', $rawBody, config('services.chessuno.webhook_secret'));

        if (! hash_equals($expected, (string) $received)) {
            Log::warning('Chessuno webhook: invalid signature', [
                'received' => $received,
            ]);
            return response('Unauthorized', 401);
        }

        // 3. Parse payload
        $payload = json_decode($rawBody, true);

        if (! is_array($payload)) {
            return response('Bad Request', 400);
        }

        Log::info('Chessuno webhook received', ['event' => $payload['event'] ?? 'unknown']);

        // 4. Handle payment.paid event
        $event = $payload['event'] ?? null;

        if ($event === 'payment.paid') {
            $this->handlePaymentPaid($payload);
        }

        return response('OK', 200);
    }

    private function handlePaymentPaid(array $payload): void
    {
        // Chessuno sends back their own reference (EXT_1_...), not our SWS-* reference.
        // We saved their reference as gateway_reference when creating the payment.
        $gatewayReference = $payload['reference'] ?? $payload['data']['reference'] ?? null;
        $transactionId    = $payload['transaction_id'] ?? $payload['data']['transaction_id'] ?? null;

        if (! $gatewayReference) {
            Log::error('Chessuno webhook: missing reference in payload', $payload);
            return;
        }

        $order = Order::where('gateway_reference', $gatewayReference)->first();

        if (! $order) {
            Log::error('Chessuno webhook: order not found', ['gateway_reference' => $gatewayReference]);
            return;
        }

        if ($order->isPaid()) {
            // Idempotent — already processed
            return;
        }

        $order->update([
            'status'          => 'paid',
            'transaction_id'  => $transactionId,
            'paid_at'         => now(),
            'webhook_payload' => $payload,
        ]);

        Log::info('Order marked as paid', [
            'reference'      => $order->reference,
            'transaction_id' => $transactionId,
            'capstone_id'    => $order->capstone_id,
        ]);

        // Generate a signed download token (64 random chars ≈ 380 bits of entropy).
        // The idempotency guard above ensures this runs exactly once per order.
        $downloadToken = Str::random(64);
        $order->update(['download_token' => $downloadToken]);

        Log::info('Download token generated', ['reference' => $order->reference]);

        // Load capstone for email content
        $order->load('capstone');

        // Dispatch purchase confirmation email via queue.
        // Failure here must never block the webhook response — the order is
        // already fully paid and the token is persisted.
        try {
            Mail::to($order->customer_email)->queue(
                new PurchaseConfirmationMail(
                    customerName:  $order->customer_name,
                    customerEmail: $order->customer_email,
                    reference:     $order->reference,
                    capstoneTitle: $order->capstone?->title ?? 'Your Project',
                    amount:        (string) $order->amount,
                    downloadToken: $downloadToken,
                    appUrl:        config('app.url'),
                    supportEmail:  config('mail.from.address'),
                )
            );

            Log::info('Purchase confirmation email queued', ['reference' => $order->reference]);
        } catch (\Throwable $e) {
            Log::error('Failed to queue purchase confirmation email', [
                'reference' => $order->reference,
                'error'     => $e->getMessage(),
            ]);
        }
    }
}
