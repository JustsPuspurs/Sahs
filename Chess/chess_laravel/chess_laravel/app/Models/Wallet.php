<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class Wallet extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'coins'];

    public function user()
    {
        return $this->belongsTo(User::class);
        return Inertia::render('Home', [
            'auth'   => Auth::user(),
            'flash'  => session('flash'),
            'skins'  => \App\Models\Skin::all(),
            'wallet' => Auth::user()->wallet ?? ['coins' => 0],
        ]);
        
    }
}
