<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Seed the application's admin user.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@viaandrenzo.co'],
            [
                'name' => 'Admin',
                'password' => '041668',
                'email_verified_at' => now(),
            ],
        );
    }
}
