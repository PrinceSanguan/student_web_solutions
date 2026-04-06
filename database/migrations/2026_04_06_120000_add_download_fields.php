<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('capstones', function (Blueprint $table) {
            $table->text('download_url')->nullable()->after('demo_url');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('download_token', 64)->nullable()->unique()->after('paid_at');
        });

        // Populate download URL for the Inventory Management System capstone.
        // This runs for existing deployments that do not re-seed.
        DB::table('capstones')
            ->where('slug', 'inventory-management-system')
            ->update([
                'download_url' => 'https://media.biyaherongchesscoach.com/studentwebsolution/zip-files/The%20Mountain%20Boot%20Company%20%20-%20GBPEUR%20LHS%20KORF%20%20-%20030226.pdf',
            ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('download_token');
        });

        Schema::table('capstones', function (Blueprint $table) {
            $table->dropColumn('download_url');
        });
    }
};
