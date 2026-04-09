<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name'      => 'Admin',
                'password'  => Hash::make('Feb252022'),
                'user_role' => 'admin',
            ]
        );
    }
}
