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
        // Log every incoming webhook attempt for full visibility
        Log::info('[Webhook] Incoming request', [
            'ip'      => $request->ip(),
            'method'  => $request->method(),
            'headers' => [
                'x-chessph-signature' => $request->header('X-Chessph-Signature') ? 'present' : 'MISSING',
                'content-type'        => $request->header('Content-Type'),
            ],
        ]);

        // 1. Read raw body for signature verification
        $rawBody  = $request->getContent();
        $received = $request->header('X-Chessph-Signature');

        Log::info('[Webhook] Raw body length', ['bytes' => strlen($rawBody)]);

        // 2. Verify signature
        $expected = hash_hmac('sha256', $rawBody, config('services.chessuno.webhook_secret'));

        if (! hash_equals($expected, (string) $received)) {
            Log::warning('[Webhook] Signature FAILED — rejected', [
                'received'        => $received,
                'expected_prefix' => substr($expected, 0, 10) . '...',
            ]);
            return response('Unauthorized', 401);
        }

        Log::info('[Webhook] Signature verified OK');

        // 3. Parse payload
        $payload = json_decode($rawBody, true);

        if (! is_array($payload)) {
            Log::error('[Webhook] Body is not valid JSON');
            return response('Bad Request', 400);
        }

        $event = $payload['event'] ?? 'unknown';
        Log::info('[Webhook] Event received', ['event' => $event, 'payload_keys' => array_keys($payload)]);

        // 4. Handle payment.paid event
        if ($event === 'payment.paid') {
            $this->handlePaymentPaid($payload);
        } else {
            Log::info('[Webhook] Event not handled — ignoring', ['event' => $event]);
        }

        return response('OK', 200);
    }

    private function handlePaymentPaid(array $payload): void
    {
        // Chessuno sends back their own reference (EXT_1_...), not our SWS-* reference.
        // We saved their reference as gateway_reference when creating the payment.
        $gatewayReference = $payload['reference'] ?? $payload['data']['reference'] ?? null;
        $transactionId    = $payload['transaction_id'] ?? $payload['data']['transaction_id'] ?? null;

        Log::info('[Webhook] handlePaymentPaid called', [
            'gateway_reference' => $gatewayReference,
            'transaction_id'    => $transactionId,
        ]);

        if (! $gatewayReference) {
            Log::error('[Webhook] Missing gateway_reference in payload', ['payload_keys' => array_keys($payload)]);
            return;
        }

        $order = Order::where('gateway_reference', $gatewayReference)->first();

        if (! $order) {
            Log::error('[Webhook] Order NOT FOUND for gateway_reference', [
                'gateway_reference' => $gatewayReference,
            ]);
            return;
        }

        Log::info('[Webhook] Order found', [
            'order_id'   => $order->id,
            'reference'  => $order->reference,
            'status'     => $order->status,
            'email'      => $order->customer_email,
        ]);

        if ($order->isPaid()) {
            // Idempotent — already processed, but still check if email needs sending
            Log::info('[Webhook] Order already paid — checking if email still needs to be sent', [
                'reference'     => $order->reference,
                'email_sent_at' => $order->email_sent_at,
            ]);

            if (! $order->email_sent_at) {
                $order->load('capstone');
                static::dispatchConfirmationEmail($order);
            }
            return;
        }

        $order->update([
            'status'          => 'paid',
            'transaction_id'  => $transactionId,
            'paid_at'         => now(),
            'webhook_payload' => $payload,
        ]);

        Log::info('[Webhook] Order marked as paid', [
            'reference'      => $order->reference,
            'transaction_id' => $transactionId,
        ]);

        $downloadToken = Str::random(64);
        $order->update(['download_token' => $downloadToken]);

        Log::info('[Webhook] Download token generated', [
            'reference'    => $order->reference,
            'token_length' => strlen($downloadToken),
        ]);

        // Load capstone for email content and dispatch confirmation
        $order->load('capstone');
        static::dispatchConfirmationEmail($order);
    }

    /**
     * Send the purchase confirmation email for a paid order.
     *
     * Shared by WebhookController (webhook-triggered) and CheckoutController::status()
     * (polling fallback for localhost/dev where the webhook URL is unreachable).
     *
     * Marks order.email_sent_at on success. Idempotent — callers should check
     * email_sent_at is null before calling.
     */
    public static function dispatchConfirmationEmail(Order $order): void
    {
        $appUrl        = config('app.url');
        $downloadLink  = $order->download_token ? $appUrl . '/download/' . $order->download_token : null;

        // Critical: APP_URL must be the public-facing domain, not localhost.
        // If it is localhost the download link in the email will be unreachable
        // by the buyer and will also trigger spam filters.
        if (str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1')) {
            Log::warning('[Email] APP_URL is localhost — download link in email will NOT work for external recipients! Update APP_URL in .env to your real domain.', [
                'app_url'       => $appUrl,
                'download_link' => $downloadLink,
            ]);
        }

        Log::info('[Email] Attempting to send purchase confirmation', [
            'reference'     => $order->reference,
            'to'            => $order->customer_email,
            'capstone'      => $order->capstone?->title,
            'download_link' => $downloadLink,   // exact URL that will be in the email
            'mail_mailer'   => config('mail.default'),
            'mail_host'     => config('mail.mailers.smtp.host'),
            'mail_from'     => config('mail.from.address'),
        ]);

        if (! $order->download_token) {
            Log::error('[Email] Skipping — order has no download_token yet', [
                'reference' => $order->reference,
            ]);
            return;
        }

        try {
            Mail::to($order->customer_email)->send(
                new PurchaseConfirmationMail(
                    customerName:  $order->customer_name,
                    customerEmail: $order->customer_email,
                    reference:     $order->reference,
                    capstoneTitle: $order->capstone?->title ?? 'Your Project',
                    amount:        (string) $order->amount,
                    downloadToken: $order->download_token,
                    appUrl:        config('app.url'),
                    supportEmail:  config('mail.from.address'),
                )
            );

            // Mark as sent — prevents duplicate sends via the polling fallback
            $order->update(['email_sent_at' => now()]);

            Log::info('[Email] Purchase confirmation sent successfully', [
                'reference' => $order->reference,
                'to'        => $order->customer_email,
            ]);

        } catch (\Throwable $e) {
            Log::error('[Email] FAILED to send purchase confirmation', [
                'reference'  => $order->reference,
                'to'         => $order->customer_email,
                'error'      => $e->getMessage(),
                'class'      => get_class($e),
                'file'       => $e->getFile() . ':' . $e->getLine(),
                // Full trace for deep debugging:
                'trace'      => collect($e->getTrace())->take(6)->map(
                    fn($f) => ($f['file'] ?? '?') . ':' . ($f['line'] ?? '?') . ' ' . ($f['class'] ?? '') . ($f['type'] ?? '') . ($f['function'] ?? '')
                )->toArray(),
            ]);
        }
    }
}
