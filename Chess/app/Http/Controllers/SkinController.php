<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Skin; // Import the Skin model

class SkinController extends Controller
{
    /**
     * Purchase a skin.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $skinId
     * @return \Illuminate\Http\JsonResponse
     */
    public function purchase(Request $request, $skinId)
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Find the skin by its ID.
        $skin = Skin::findOrFail($skinId);

        // Check if the user already owns this skin.
        if ($user->skins()->where('skin_id', $skin->id)->exists()) {
            return response()->json(['message' => 'Skin already purchased'], 400);
        }

        // Check if the user has enough coins in their wallet.
        $wallet = $user->wallet;
        if (!$wallet || $wallet->coins < $skin->cost) {
            return response()->json(['message' => 'Insufficient coins'], 400);
        }

        // Deduct the cost from the wallet.
        $wallet->coins -= $skin->cost;
        $wallet->save();

        // Attach the skin to the user.
        $user->skins()->attach($skin->id);

        return response()->json(['message' => 'Skin purchased successfully']);
    }
}