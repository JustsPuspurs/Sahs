<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChessController;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return inertia('Home');
});

Route::post('/api/move', [ChessController::class, 'makeMove']);

// This serves the initial chessboard page
Route::get('/', function () {
    return Inertia::render('ChessBoard', [
        'initialBoard' => [
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.'],
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ],
    ]);
});

// API endpoint to process the move (optional)
Route::post('/api/move', function (Request $request) {
    $board = $request->input('board');
    // Perform AI calculations (optional), use the minimax algorithm or similar
    $newBoard = runMinimax($board);
    
    return response()->json(['newBoard' => $newBoard]);
});
