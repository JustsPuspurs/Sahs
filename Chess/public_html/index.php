<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// If in maintenance mode, point to the new folder path:
if (file_exists($maintenance = __DIR__.'/../chess_laravel/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Autoloader now in chess_laravel/vendor
require __DIR__.'/../chess_laravel/vendor/autoload.php';

// Bootstrap the app from chess_laravel/bootstrap
$app = require_once __DIR__.'/../chess_laravel/bootstrap/app.php';

// Handle the incoming request
$app->handleRequest(Request::capture());