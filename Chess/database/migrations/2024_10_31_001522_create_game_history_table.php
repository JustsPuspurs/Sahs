<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('game_history', function (Blueprint $table) {
            $table->id();
            $table->text('moves'); // Store all moves as text
            $table->time('time'); // Duration of the game
            $table->enum('side', ['White', 'Black']); // Which side the user played
            $table->enum('result', ['Win', 'Lose', 'Draw']); // Outcome of the game
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('game_history');
    }
};
