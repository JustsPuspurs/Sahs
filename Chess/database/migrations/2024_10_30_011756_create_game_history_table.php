<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('game_history', function (Blueprint $table) {
            $table->unsignedBigInteger('GameID')->primary();  // Primary key
            $table->text('Moves');
            $table->time('Time');
            $table->string('Side');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_history');
    }
};
