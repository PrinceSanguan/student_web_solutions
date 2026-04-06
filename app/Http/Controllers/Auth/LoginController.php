<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Display the Login Page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Handle the incoming authentication request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            // Only admin accounts are allowed to log in.
            if (Auth::user()->user_role !== 'admin') {
                Auth::logout();
                $request->session()->invalidate();
                throw ValidationException::withMessages([
                    'auth' => 'Access denied. Admin accounts only.',
                ]);
            }

            $request->session()->regenerate();
            return redirect()->route('admin.dashboard');
        }

        throw ValidationException::withMessages([
            'auth' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
