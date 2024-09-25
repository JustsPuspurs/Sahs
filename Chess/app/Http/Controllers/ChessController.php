<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ChessController extends Controller
{
    public function makeMove(Request $request)
    {
        // Receive the current state of the chessboard
        $board = $request->input('board');

        // Get the AI move (basic AI that moves pawns forward)
        $move = $this->getBasicAIMove($board);

        // Return the AI move
        return response()->json(['move' => $move]);
    }

    // Example AI function that moves a pawn
    private function getBasicAIMove($board)
    {
        // Basic AI logic: Move a black pawn forward if the square is empty
        for ($i = 1; $i < 8; $i++) {
            for ($j = 0; $j < 8; $j++) {
                if ($board[$i][$j] == 'p' && $board[$i - 1][$j] == '.') {
                    return ['from' => [$i, $j], 'to' => [$i - 1, $j]];
                }
            }
        }

        return null;  // No move found (can be expanded for a more complex AI)
    }
}
