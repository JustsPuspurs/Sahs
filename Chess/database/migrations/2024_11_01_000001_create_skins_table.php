<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSkinsTable extends Migration
{
    public function up()
    {
        Schema::create('skins', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('piece_type'); // e.g. Pawn, Rook, Knight, etc.
            $table->integer('cost');      // Cost in coins
            $table->string('image')->nullable(); // Image path (optional)
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('skins');
    }
}
