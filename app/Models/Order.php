<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'capstone_id',
        'reference',
        'gateway_reference',
        'customer_name',
        'customer_email',
        'amount',
        'status',
        'transaction_id',
        'payment_url',
        'webhook_payload',
        'paid_at',
        'download_token',
        'email_sent_at',
    ];

    protected $casts = [
        'amount'          => 'decimal:2',
        'webhook_payload' => 'array',
        'paid_at'         => 'datetime',
        'email_sent_at'   => 'datetime',
    ];

    public function capstone(): BelongsTo
    {
        return $this->belongsTo(Capstone::class);
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isDownloadExpired(): bool
    {
        return $this->paid_at === null
            || $this->paid_at->lt(now()->subHours(72));
    }

    public static function generateReference(): string
    {
        $date = now()->format('Ymd');
        $count = self::whereDate('created_at', today())->count() + 1;
        return sprintf('SWS-%s-%04d', $date, $count);
    }
}
