<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;
use PDOException;

class SetupDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'setup:database';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create the database if it does not exist, then run migrations and seeders';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $connection = config('database.default');
        $dbConfig = config("database.connections.$connection");
        $database = $dbConfig['database'];

        try {
            // Attempt to get a PDO connection. If the DB doesn't exist, this will throw a PDOException
            DB::connection()->getPdo();
            $this->info("Database '{$database}' exists. Proceeding with migrations and seeders...");
        } catch (PDOException $exception) {
            $this->warn("Database '{$database}' does not exist. Attempting to create it...");

            // Temporarily remove the 'database' key so we can connect to the server without specifying a DB
            $tempConfig = $dbConfig;
            unset($tempConfig['database']);

            // Add a new connection named 'temp'
            config(["database.connections.temp" => $tempConfig]);
            $pdo = DB::connection('temp')->getPdo();

            // Create the database
            $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$database}`");
            $this->info("Database '{$database}' created successfully.");

            // Purge the old connection so we reconnect to the new database
            DB::purge($connection);
        }

        // Run migrations
        Artisan::call('migrate', ['--force' => true]);
        $this->info(Artisan::output());

        // Run seeders
        Artisan::call('db:seed', ['--force' => true]);
        $this->info(Artisan::output());

        return 0;
    }
}