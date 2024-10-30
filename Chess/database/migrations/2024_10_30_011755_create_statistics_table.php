<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->unsignedBigInteger('StatsID')->primary();  // Primary key
            $table->integer('Win')->default(0);
            $table->integer('Lose')->default(0);
            $table->integer('Draw')->default(0);

            // Foreign keys
            $table->unsignedBigInteger('UserID');
            $table->unsignedBigInteger('GameID');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('UserID')->references('UserID')->on('users')->onDelete('cascade');
            $table->foreign('GameID')->references('GameID')->on('game_history')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('statistics');
    }
};
