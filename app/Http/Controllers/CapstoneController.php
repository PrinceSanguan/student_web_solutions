<?php

namespace App\Http\Controllers;

use App\Models\Capstone;
use Inertia\Inertia;

class CapstoneController extends Controller
{
    public function index()
    {
        $capstones = Capstone::where('is_available', true)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn($c) => $this->publicFields($c));

        return Inertia::render('Capstone/Index', [
            'capstones' => $capstones,
        ]);
    }

    public function show(string $slug)
    {
        $capstone = Capstone::where('slug', $slug)->firstOrFail();

        return Inertia::render('Capstone/Show', [
            'capstone' => $this->publicFields($capstone),
        ]);
    }

    /**
     * Only expose fields safe for the public showcase — never internal
     * delivery fields (download_url, download_file) or pricing.
     */
    private function publicFields(Capstone $c): array
    {
        return [
            'id'           => $c->id,
            'title'        => $c->title,
            'slug'         => $c->slug,
            'description'  => $c->description,
            'demo_url'     => $c->demo_url,
            'thumbnail'    => $c->thumbnail,
            'category'     => $c->category,
            'technologies' => $c->technologies,
        ];
    }
}
