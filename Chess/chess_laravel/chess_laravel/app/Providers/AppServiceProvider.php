<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use PDOException;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $connection = config('database.default');
        $dbConfig   = config("database.connections.$connection");
        $database   = $dbConfig['database'];

        try {
            DB::connection()->getPdo();
        } catch (PDOException $exception) {
            $tempConfig = $dbConfig;
            unset($tempConfig['database']);

            config(["database.connections.temp" => $tempConfig]);
            $pdo = DB::connection('temp')->getPdo();

            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");

            DB::purge($connection);
        }

        if (!Schema::hasTable('migrations')) {
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
        }

        Inertia::share('auth', function () {
            return [
                'user' => Auth::user() ? Auth::user()->only('id', 'username') : null,
            ];
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}