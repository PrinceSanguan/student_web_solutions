<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('capstone_id')->constrained()->cascadeOnDelete();
            $table->string('reference')->unique();          // e.g. SWS-20260406-0001
            $table->string('customer_name');
            $table->string('customer_email');
            $table->decimal('amount', 8, 2);
            $table->string('status')->default('pending');   // pending | paid | failed
            $table->string('transaction_id')->nullable();   // from chessuno webhook
            $table->string('payment_url')->nullable();      // chessuno redirect URL
            $table->json('webhook_payload')->nullable();    // raw webhook for audit
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'capstone_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
