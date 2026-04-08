<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;

// NOTE: ShouldQueue intentionally removed. When a Mailable implements ShouldQueue,
// Laravel queues it even on Mail::send() — so "sent successfully" was only logging
// "pushed to queue", not actual SMTP delivery. Synchronous sending makes SMTP errors
// immediately visible in logs and in the catch block.
class PurchaseConfirmationMail extends Mailable
{

    public function __construct(
        public readonly string $customerName,
        public readonly string $customerEmail,
        public readonly string $reference,
        public readonly string $capstoneTitle,
        public readonly string $amount,
        public readonly string $downloadToken,
        public readonly string $appUrl,
        public readonly string $supportEmail,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Purchase is Confirmed — Download Ready',
        );
    }

    public function content(): Content
    {
        return new Content(view: 'emails.purchase-confirmation');
    }

    public function attachments(): array
    {
        return [];
    }
}
