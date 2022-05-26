<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $user = User::where('name', 'admin')->get();
        \DB::table('users')->insert([
            [
                'id' => '550e8400-e29b-41d4-a716-446655440000',
                'content' => 'content1',
                'created_at' => now(),
                'updated_at' => now(),
                'user_id' => 'b9f643af-6bad-4b73-8d1e-87aa2e73474e',
            ],
            [
                'id' => '7e935307-e29b-41d4-a716-446655440000',
                'content' => 'content2',
                'created_at' => now(),
                'updated_at' => now(),
                'user_id' => 'b9f643af-6bad-4b73-8d1e-87aa2e73474e',
            ],
            [
                'id' => 'b9f643af-e29b-41d4-a716-446655440000',
                'content' => 'content3',
                'created_at' => now(),
                'updated_at' => now(),
                'user_id' => '7e935307-a62c-428c-bf89-bac0c46fc014',
            ],
        ]);
    }
}
