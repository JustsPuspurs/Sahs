<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use Notifiable, HasFactory;

    protected $fillable = ['username', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'password' => 'hashed',
    ];

    /**
     * A user has one Statistic record.
     */
    public function statistic()
    {
        return $this->hasOne(Statistic::class);
    }

    /**
     * A user has many GameHistory records.
     */
    public function gameHistories()
    {
        return $this->hasMany(GameHistory::class);
    }

    /**
     * Helper to record a game result.
     *
     * @param string $result   'Win', 'Lose', or 'Draw'
     * @param string $moves    The game moves (text or JSON)
     * @param string $side     'White' or 'Black'
     * @param string $time     Game duration or time string
     *
     * @return \App\Models\GameHistory
     */
    public function recordGameResult($result, $moves, $side, $time)
    {
        // Create a game history record associated with this user
        $gameHistory = $this->gameHistories()->create([
            'moves'  => $moves,
            'time'   => $time,
            'side'   => $side,
            'result' => $result,
        ]);

        // Retrieve or create a statistic record for this user.
        $statistic = $this->statistic;
        if (!$statistic) {
            $statistic = $this->statistic()->create([
                'win'  => 0,
                'lose' => 0,
                'draw' => 0,
            ]);
        }

        // Update statistics based on the result.
        switch (strtolower($result)) {
            case 'win':
                $statistic->increment('win');
                break;
            case 'lose':
                $statistic->increment('lose');
                break;
            case 'draw':
                $statistic->increment('draw');
                break;
        }

        // Optionally, record the game_history_id on the statistic record.
        $statistic->game_history_id = $gameHistory->id;
        $statistic->save();

        return $gameHistory;
    }
}