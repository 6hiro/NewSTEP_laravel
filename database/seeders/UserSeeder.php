<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \DB::table('users')->insert([
            [
                'id' => 'b9f643af-6bad-4b73-8d1e-87aa2e73474e',
                'name' => 'admin',
                'email' => 'admin@admin.admin',
                'email_verified_at' => now(),
                'password' => \Hash::make('aabbccdd'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '7e935307-a62c-428c-bf89-bac0c46fc014',
                'name' => 'test1',
                'email' => 'test@test.test',
                'email_verified_at' => now(),
                'password' => \Hash::make('aabbccdd'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => '3f098988-807e-4a20-aa30-afb51504db65',
                'name' => 'test2',
                'email' => 'test2@test.test',
                'email_verified_at' => now(),
                'password' => \Hash::make('aabbccdd'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
