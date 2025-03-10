<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Skin extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'piece_type', 'cost', 'image'
    ];

    /**
     * The users that purchased this skin.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_skins')->withTimestamps();
    }
}