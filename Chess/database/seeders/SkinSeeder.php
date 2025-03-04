<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skin;

class SkinSeeder extends Seeder
{
    public function run()
    {
        Skin::create([
            'name' => 'Classic Pawn',
            'piece_type' => 'Pawn',
            'cost' => 50,
        ]);        

        Skin::create([
            'name' => 'Golden Rook',
            'piece_type' => 'Rook',
            'cost' => 150,
        ]);

        // Add more skins as needed.
    }
}