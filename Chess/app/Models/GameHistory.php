<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameHistory extends Model
{
    use HasFactory;

    // Use this if your table name is not the plural "game_histories"
    protected $table = 'game_history';

    protected $fillable = [
        'moves', 'time', 'side', 'result', 'user_id'
    ];

    /**
     * A GameHistory record belongs to a User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}