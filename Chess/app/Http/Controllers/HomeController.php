<?php
namespace App\Http\Controllers;

use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
    {
        return Inertia::render('Home');

        $user = Auth::user();
        // Eager load the wallet relationship so it's available
        $user->load('wallet');
        return Inertia::render('Home', [
            'auth'   => $user,
            'flash'  => session('flash'),
            'skins'  => Skin::all(),  // All available skins
            'wallet' => $user->wallet ?? ['coins' => 0], // Provide default if wallet is null
        ]);
    }
}

