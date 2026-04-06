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
        Schema::table('orders', function (Blueprint $table) {
            // Real GCash URLs from Xendit can exceed 255 chars
            $table->text('payment_url')->nullable()->change();
            $table->text('transaction_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('payment_url')->nullable()->change();
            $table->string('transaction_id')->nullable()->change();
        });
    }
};
