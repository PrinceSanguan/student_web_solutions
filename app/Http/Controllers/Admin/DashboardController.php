<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capstone;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_projects' => Capstone::count(),
            'available'      => Capstone::where('is_available', true)->count(),
            'unlisted'       => Capstone::where('is_available', false)->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'user'  => ['name' => $user->name, 'email' => $user->email],
            'stats' => $stats,
        ]);
    }

}
