<?php

namespace App\Http\Controllers;

use App\Models\Capstone;
use Inertia\Inertia;

class CapstoneController extends Controller
{
    public function index()
    {
        $capstones = Capstone::where('is_available', true)
            ->withCount(['orders as buyers_count' => fn($q) => $q->where('status', 'paid')])
            ->orderBy('price')
            ->get();

        return Inertia::render('Capstone/Index', [
            'capstones' => $capstones,
        ]);
    }

    public function show(string $slug)
    {
        $capstone = Capstone::where('slug', $slug)
            ->withCount(['orders as buyers_count' => fn($q) => $q->where('status', 'paid')])
            ->firstOrFail();

        return Inertia::render('Capstone/Show', [
            'capstone' => $capstone,
        ]);
    }
}
