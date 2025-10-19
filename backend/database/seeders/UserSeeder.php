<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Demo User 1',
            'email' => 'demo1@example.com',
            'password' => Hash::make('password'),
        ]);

        User::create([
            'name' => 'Demo User 2',
            'email' => 'demo2@example.com',
            'password' => Hash::make('password'),
        ]);
    }
}
