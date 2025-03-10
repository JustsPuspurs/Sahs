<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGameHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('game_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Associate game with a user
            $table->string('side');
            $table->string('result');
            $table->bigInteger('time')->nullable(); // Game duration in milliseconds
            $table->text('moves');
            $table->timestamps();

            // Set up the foreign key constraint with the users table.
            $table->foreign('user_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('game_history');
    }
}