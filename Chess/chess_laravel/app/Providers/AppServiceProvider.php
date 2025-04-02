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

        // Check if the 'database' key exists
        if (!array_key_exists('database', $dbConfig)) {
            throw new \Exception("Database key not found in configuration for connection '{$connection}'.");
        }

        $database = $dbConfig['database'];

        try {
            // Attempt to get a PDO instance (this fails if the database doesn't exist)
            DB::connection()->getPdo();
        } catch (PDOException $exception) {
            // Prepare a temporary configuration without the 'database' key
            $tempConfig = $dbConfig;
            unset($tempConfig['database']);

            // Create a temporary connection to allow database creation
            config(["database.connections.temp" => $tempConfig]);
            $pdo = DB::connection('temp')->getPdo();

            // Create the database if it doesn't exist
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");

            // Purge the original connection so that Laravel reconnects using the updated configuration
            DB::purge($connection);
        }

        // Run migrations and seeders if the migrations table does not exist
        if (!Schema::hasTable('migrations')) {
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
        }

        // Share authenticated user data with Inertia
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