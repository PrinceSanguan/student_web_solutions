<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PurchaseConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

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
