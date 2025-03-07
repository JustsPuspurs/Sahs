<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GameHistory extends Model
{
    protected $table = 'game_history';

    protected $fillable = [
        'user_id',
        'side',
        'result',
        'time',
        'moves'
    ];

    /**
     * Get the user that owns this game record.
     */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }
}