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
            // Tracks when the purchase confirmation email was successfully sent.
            // NULL = email not yet sent. Guarantees exactly-once delivery regardless
            // of whether the Chessuno webhook or the status-poll fallback fired first.
            $table->timestamp('email_sent_at')->nullable()->after('download_token');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('email_sent_at');
        });
    }
};
