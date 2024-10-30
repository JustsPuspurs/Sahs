<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id('StatsID'); // Laravel's default 'id' method with renamed column
            $table->integer('Win')->default(0);
            $table->integer('Lose')->default(0);
            $table->integer('Draw')->default(0);

            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Simplified syntax
            $table->foreignId('game_id')->constrained('game_history')->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::table('statistics', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['game_id']);
        });
        Schema::dropIfExists('statistics');
    }
};
