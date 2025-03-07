<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\SkinController;

// Set the home page as the landing page, accessible by anyone
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::post('/register', [RegisterController::class, 'registerUser'])->name('register');
Route::post('/game/result', [GameController::class, 'storeResult']);
Route::middleware(['auth'])->group(function () {
    Route::post('/skins/{skinId}/purchase', [SkinController::class, 'purchase']);
    Route::post('/skins/{skinId}/equip', [SkinController::class, 'equip']);
    Route::post('/skins/{skinId}/unequip', [SkinController::class, 'unequip']);
    Route::get('/game-history', [GameController::class, 'getGameHistory']);
});


