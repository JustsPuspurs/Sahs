<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Statistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'win', 'lose', 'draw', 'user_id', 'game_history_id'
    ];

    /**
     * A Statistic belongs to a User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A Statistic belongs to a GameHistory record.
     */
    public function gameHistory()
    {
        return $this->belongsTo(GameHistory::class, 'game_history_id');
    }
}
