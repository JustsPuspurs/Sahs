<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Skin;
use App\Models\Wallet;

class HomeController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if ($user) {
            $user->load('wallet'); 
        }
        
        return Inertia::render('Home', [
            'auth'       => ['user' => Auth::user()],
            'flash'      => session('flash') ?? [],
            'skins'      => \App\Models\Skin::all(),
            'wallet'     => Auth::user() && Auth::user()->wallet ? Auth::user()->wallet : ['coins' => 0],
            'ownedSkins' => Auth::user() ? Auth::user()->skins : [],
        ]);                                    
    }
}