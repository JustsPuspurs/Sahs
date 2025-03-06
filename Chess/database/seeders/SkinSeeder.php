<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SkinSeeder extends Seeder
{
    public function run()
    {
        // Disable foreign key checks to allow truncating the table
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        DB::table('skins')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        DB::table('skins')->insert([
            // Blue Pawn Skin
            [
                'name'       => 'Blue Pawn',
                'piece_type' => 'Pawn',
                'cost'       => 100,
                'image'      => 'images/blue_pawn.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blue Rook Skin
            [
                'name'       => 'Blue Rook',
                'piece_type' => 'Rook',
                'cost'       => 150,
                'image'      => 'images/blue_rook.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blue Knight Skin
            [
                'name'       => 'Blue Knight',
                'piece_type' => 'Knight',
                'cost'       => 200,
                'image'      => 'images/blue_knight.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blue Bishop Skin
            [
                'name'       => 'Blue Bishop',
                'piece_type' => 'Bishop',
                'cost'       => 200,
                'image'      => 'images/blue_bishop.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blue Queen Skin
            [
                'name'       => 'Blue Queen',
                'piece_type' => 'Queen',
                'cost'       => 250,
                'image'      => 'images/blue_queen.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            // Blue King Skin
            [
                'name'       => 'Blue King',
                'piece_type' => 'King',
                'cost'       => 300,
                'image'      => 'images/blue_king.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}