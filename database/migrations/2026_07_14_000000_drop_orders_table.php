<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * The GCash/Chessuno payment integration was removed — the capstone
     * catalog is now a showcase and clients contact the developer directly.
     * This drops the now-unused orders table on both fresh and existing DBs.
     */
    public function up(): void
    {
        Schema::dropIfExists('orders');
    }

    /**
     * Recreate the orders table shape for reversibility only.
     */
    public function down(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();
            $table->string('gateway_reference')->nullable()->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->decimal('amount', 8, 2);
            $table->string('status')->default('pending');
            $table->text('transaction_id')->nullable();
            $table->text('payment_url')->nullable();
            $table->json('webhook_payload')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('download_token', 64)->nullable()->unique();
            $table->timestamp('email_sent_at')->nullable();
            $table->timestamps();
            $table->index(['status', 'capstone_id']);
        });
    }
};
