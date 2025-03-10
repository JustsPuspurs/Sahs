<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Skin;

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
        /** @var \App\Models\User $user */
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $skin = Skin::findOrFail($skinId);

        // Check if the user already owns this skin.
        if ($user->skins()->where('skin_id', $skin->id)->exists()) {
            return response()->json(['message' => 'Skin already purchased'], 400);
        }

        // Check if the user has enough coins.
        $wallet = $user->wallet;
        if (!$wallet || $wallet->coins < $skin->cost) {
            return response()->json(['message' => 'Insufficient coins'], 400);
        }

        // Deduct coins.
        $wallet->coins -= $skin->cost;
        $wallet->save();

        // Attach the skin with pivot 'equipped' = false.
        $user->skins()->attach($skin->id, ['equipped' => false]);

        return response()->json(['message' => 'Skin purchased successfully']);
    }

    /**
     * Equip a skin.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $skinId
     * @return \Illuminate\Http\JsonResponse
     */
    public function equip(Request $request, $skinId)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Check that user owns the skin.
        if (!$user->skins()->where('skin_id', $skinId)->exists()) {
            return response()->json(['message' => 'Skin not owned'], 400);
        }

        $skin = Skin::findOrFail($skinId);

        // For skins of the same piece type, unequip all first.
        $ownedSkins = $user->skins()->get();
        foreach ($ownedSkins as $ownedSkin) {
            if ($ownedSkin->piece_type === $skin->piece_type) {
                $user->skins()->updateExistingPivot($ownedSkin->id, ['equipped' => false]);
            }
        }
        // Equip the selected skin.
        $user->skins()->updateExistingPivot($skinId, ['equipped' => true]);

        return response()->json(['message' => 'Skin equipped successfully']);
    }

    /**
     * Unequip a skin.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $skinId
     * @return \Illuminate\Http\JsonResponse
     */
    public function unequip(Request $request, $skinId)
    {
        $user = Auth::user();
        /** @var \App\Models\User $user */
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        // Check that the skin is owned.
        if (!$user->skins()->where('skin_id', $skinId)->exists()) {
            return response()->json(['message' => 'Skin not owned'], 400);
        }

        // Set equipped to false.
        $user->skins()->updateExistingPivot($skinId, ['equipped' => false]);

        return response()->json(['message' => 'Skin unequipped successfully']);
    }
}