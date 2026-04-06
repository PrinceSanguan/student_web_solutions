<?php

namespace App\Http\Controllers;

use App\Models\Capstone;
use Inertia\Inertia;

class CapstoneController extends Controller
{
    public function index()
    {
        // Only show projects still available for purchase.
        $capstones = Capstone::where('is_available', true)
            ->orderBy('price')
            ->get();

        return Inertia::render('Capstone/Index', [
            'capstones' => $capstones,
        ]);
    }

    public function show(string $slug)
    {
        $capstone = Capstone::where('slug', $slug)->firstOrFail();

        return Inertia::render('Capstone/Show', [
            'capstone' => $capstone,
        ]);
    }
}
