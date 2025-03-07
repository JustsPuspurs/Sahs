<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Models\GameHistory;

class GameController extends Controller
{   
    public function getGameHistory()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        // Retrieve only the games associated with the logged-in user.
        $gameHistory = GameHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($gameHistory);
    }

    public function storeResult(Request $request)
    {
        // Validate the incoming data.
        $data = $request->validate([
            'moves'  => 'required|string',
            'time'   => 'required|integer',
            'side'   => 'required|string',
            'result' => 'required|string',
        ]);

        // Ensure a user is authenticated.
        $user = Auth::user();
        /** @var \App\Models\User $user */
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        try {
            // Use the User model's helper method to record the game result and update wallet.
            $gameHistory = $user->recordGameResult(
                $data['result'],
                $data['moves'],
                $data['side'],
                $data['time']
            );

            return response()->json(['message' => 'Game saved successfully', 'game' => $gameHistory]);
        } catch (\Exception $e) {
            Log::error("Error storing game result: " . $e->getMessage());
            return response()->json(['message' => 'Failed to save game'], 500);
        }
    }
}