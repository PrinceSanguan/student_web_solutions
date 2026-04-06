<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('capstones', function (Blueprint $table) {
            // Tracks whether this project is still available for purchase.
            // Set to false automatically when a paid order is received.
            $table->boolean('is_available')->default(true)->after('download_url');

            // Path to an uploaded file in private storage (alternative to download_url).
            // Served through DownloadController — never exposed publicly.
            $table->string('download_file')->nullable()->after('is_available');
        });
    }

    public function down(): void
    {
        Schema::table('capstones', function (Blueprint $table) {
            $table->dropColumn(['is_available', 'download_file']);
        });
    }
};
