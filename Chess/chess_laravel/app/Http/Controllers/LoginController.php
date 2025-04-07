<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        // Validate the request input
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Attempt to authenticate with the provided credentials
        if (Auth::attempt($credentials)) {
            // Regenerate session to prevent fixation attacks
            $request->session()->regenerate();
            return redirect()->intended('/');
        }

        // If authentication fails, return back with an error
        return back()->withErrors([
            'username' => 'Invalid username or password.',
        ]);
    }

    public function logout(Request $request)
    {
        // Logout the user
        Auth::logout();
        
        // Invalidate the current session and regenerate the token
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        // Redirect to home after logout
        return redirect('/');
    }
}