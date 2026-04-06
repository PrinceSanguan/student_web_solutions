<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
        $reference     = $payload['reference'] ?? $payload['data']['reference'] ?? null;
        $transactionId = $payload['transaction_id'] ?? $payload['data']['transaction_id'] ?? null;

        if (! $reference) {
            Log::error('Chessuno webhook: missing reference in payload', $payload);
            return;
        }

        $order = Order::where('reference', $reference)->first();

        if (! $order) {
            Log::error('Chessuno webhook: order not found', ['reference' => $reference]);
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

        // TODO: Trigger automatic ZIP download link generation here
        // e.g. event(new OrderPaid($order));
    }
}
