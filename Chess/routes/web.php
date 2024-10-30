<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\RegisterController;
use Inertia\Inertia;

// Root route that redirects to home
Route::get('/', function () {
    return Inertia::render('Home'); // Ensure 'Home' component exists
})->name('home');

// Alternatively, define a specific /home route
Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

Route::post('/login', [LoginController::class, 'login'])->name('login');
Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
Route::post('/register', [RegisterController::class, 'register'])->name('register');


