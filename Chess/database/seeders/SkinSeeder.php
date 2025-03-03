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
            'image' => 'images/skins/classic_pawn.png',
        ]);

        Skin::create([
            'name' => 'Golden Rook',
            'piece_type' => 'Rook',
            'cost' => 150,
            'image' => 'images/skins/golden_rook.png',
        ]);

        // Add more skins as needed.
    }
}