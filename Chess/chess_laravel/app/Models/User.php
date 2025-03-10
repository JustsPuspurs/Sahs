<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use App\Models\Skin;
use App\Models\Statistic;
use App\Models\GameHistory;
use App\Models\Wallet;

class User extends Authenticatable
{
    use Notifiable, HasFactory;

    // Allow mass assignment for username and password
    protected $fillable = ['username', 'password'];
    
    // Hide sensitive attributes
    protected $hidden = ['password', 'remember_token'];
    
    // Automatically hash passwords on set (PHP 8.2 feature with 'hashed' cast)
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
     * A user has one Wallet.
     */
    public function wallet()
    {
        return $this->hasOne(Wallet::class);
    }

    /**
     * A user can have many purchased skins.
     *
     * The pivot table 'user_skins' should have an 'equipped' boolean column.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function skins(): BelongsToMany
    {
        return $this->belongsToMany(Skin::class, 'user_skins')
                    ->withTimestamps()
                    ->withPivot('equipped');
    }

    /**
     * Helper to record a game result.
     *
     * @param string $result   'Win', 'Lose', or 'Draw'
     * @param string $moves    The game moves (text or JSON)
     * @param string $side     'White' or 'Black'
     * @param int    $time     Game duration in milliseconds
     * @return \App\Models\GameHistory
     */
    public function recordGameResult($result, $moves, $side, $time)
    {
        // Create a game history record associated with this user.
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
        $resultLower = strtolower($result);
        if ($resultLower === 'win') {
            $statistic->win += 1;
        } elseif ($resultLower === 'lose') {
            $statistic->lose += 1;
        } elseif ($resultLower === 'draw') {
            $statistic->draw += 1;
        }
        $statistic->game_history_id = $gameHistory->id;
        $statistic->save();

        // Reward coins based on game result.
        $reward = 0;
        if ($resultLower === 'win') {
            $reward = 10;
        } elseif ($resultLower === 'lose') {
            $reward = 2;
        } elseif ($resultLower === 'draw') {
            $reward = 5;
        }

        $wallet = $this->wallet;
        if (!$wallet) {
            $wallet = $this->wallet()->create(['coins' => 0]);
        }
        $wallet->coins += $reward;
        $wallet->save();

        return $gameHistory;
    }
}