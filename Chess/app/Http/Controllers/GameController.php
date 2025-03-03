<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class GameController extends Controller
{
    /**
     * Store the game result.
     */
    public function storeGameResult(Request $request)
    {
        $data = $request->validate([
            'moves'  => 'required|string',
            'time'   => 'required',          // e.g., "00:15:30"
            'side'   => 'required|in:White,Black',
            'result' => 'required|in:Win,Lose,Draw',
        ]);

        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $user->recordGameResult($data['result'], $data['moves'], $data['side'], $data['time']);

        return response()->json(['message' => 'Game result saved successfully.']);
    }
}