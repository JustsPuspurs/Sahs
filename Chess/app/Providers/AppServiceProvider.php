<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Inertia::share('auth', function () {
            return [
                'user' => Auth::user() ? Auth::user()->only('id', 'username') : null,
            ];
        });
    }
}
