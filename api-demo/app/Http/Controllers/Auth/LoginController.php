<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    /**
     * Handle an authentication attempt.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        // $credentials['active'] = 1;
        // $user->createToken('Laravel Password Grant Client')->accessToken;
        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            $user = Auth::user();
            return response()->json([
                'status' => 302,
                'user' => $user,
                'token' => $user->createToken('Laravel Password Grant Client')->accessToken,
            ]);
        } else {
            return response()->json([
                'status' => 401,
            ]);
        }
 
        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    public function authUser()
    {
        if (Auth::user()) {
            return response()->json([
                'status' => 200,
                'user' => Auth::user()
            ]);
        }
    }

    public function logout(Request $request)
    {
        Auth::logout();
     
        $request->session()->invalidate();
     
        $request->session()->regenerateToken();
     
        return response()->json([
            'status' => 'Logout'
        ]);
    }
}
