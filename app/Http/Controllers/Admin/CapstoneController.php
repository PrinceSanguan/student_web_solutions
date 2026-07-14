<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capstone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CapstoneController extends Controller
{
    public function index()
    {
        $capstones = Capstone::orderByDesc('created_at')
            ->get()
            ->map(fn($c) => [
                'id'           => $c->id,
                'title'        => $c->title,
                'slug'         => $c->slug,
                'price'        => $c->price,
                'category'     => $c->category,
                'is_available' => $c->is_available,
                'thumbnail'    => $c->thumbnail,
            ]);

        $stats = [
            'total'     => Capstone::count(),
            'available' => Capstone::where('is_available', true)->count(),
            'unlisted'  => Capstone::where('is_available', false)->count(),
        ];

        return Inertia::render('Admin/Capstones/Index', [
            'capstones' => $capstones,
            'stats'     => $stats,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Capstones/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'         => ['required', 'string', 'max:150'],
            'slug'          => ['required', 'string', 'max:150', 'unique:capstones,slug', 'regex:/^[a-z0-9\-]+$/'],
            'description'   => ['required', 'string'],
            'price'         => ['required', 'numeric', 'min:0'],
            'category'      => ['nullable', 'string', 'max:100'],
            'technologies'  => ['nullable', 'string'],   // comma-separated
            'demo_url'      => ['nullable', 'url', 'max:500'],
            'download_url'  => ['nullable', 'url', 'max:1000'],
            'thumbnail'     => ['nullable', 'url', 'max:1000'],
            'download_file' => ['nullable', 'file', 'mimes:zip,pdf,rar,tar,gz', 'max:102400'], // max 100 MB
        ]);

        $thumbnailPath = $data['thumbnail'] ?? null;

        $downloadFilename = null;
        if ($request->hasFile('download_file')) {
            $file             = $request->file('download_file');
            $downloadFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('capstone-downloads', $downloadFilename, 'local');
        }

        $technologies = null;
        if (! empty($data['technologies'])) {
            $technologies = array_values(array_filter(array_map('trim', explode(',', $data['technologies']))));
        }

        Capstone::create([
            'title'         => $data['title'],
            'slug'          => $data['slug'],
            'description'   => $data['description'],
            'price'         => $data['price'],
            'category'      => $data['category'] ?? null,
            'technologies'  => $technologies,
            'demo_url'      => $data['demo_url'] ?? null,
            'download_url'  => $downloadFilename ? null : ($data['download_url'] ?? null),
            'download_file' => $downloadFilename,
            'thumbnail'     => $thumbnailPath,
            'is_available'  => true,
        ]);

        return redirect()->route('admin.capstones.index')
            ->with('success', 'Project created successfully.');
    }

    public function edit(Capstone $capstone)
    {
        return Inertia::render('Admin/Capstones/Edit', [
            'capstone' => [
                'id'            => $capstone->id,
                'title'         => $capstone->title,
                'slug'          => $capstone->slug,
                'description'   => $capstone->description,
                'price'         => $capstone->price,
                'category'      => $capstone->category,
                'technologies'  => is_array($capstone->technologies)
                    ? implode(', ', $capstone->technologies)
                    : ($capstone->technologies ?? ''),
                'demo_url'      => $capstone->demo_url,
                'download_url'  => $capstone->download_url,
                'download_file' => $capstone->download_file,
                'thumbnail'     => $capstone->thumbnail,
                'is_available'  => $capstone->is_available,
            ],
        ]);
    }

    public function update(Request $request, Capstone $capstone)
    {
        $data = $request->validate([
            'title'         => ['required', 'string', 'max:150'],
            'slug'          => ['required', 'string', 'max:150', 'regex:/^[a-z0-9\-]+$/', 'unique:capstones,slug,' . $capstone->id],
            'description'   => ['required', 'string'],
            'price'         => ['required', 'numeric', 'min:0'],
            'category'      => ['nullable', 'string', 'max:100'],
            'technologies'  => ['nullable', 'string'],
            'demo_url'      => ['nullable', 'url', 'max:500'],
            'download_url'  => ['nullable', 'url', 'max:1000'],
            'thumbnail'     => ['nullable', 'url', 'max:1000'],
            'download_file' => ['nullable', 'file', 'mimes:zip,pdf,rar,tar,gz', 'max:102400'],
            'is_available'  => ['boolean'],
        ]);

        $thumbnailPath = ! empty($data['thumbnail']) ? $data['thumbnail'] : $capstone->thumbnail;

        $downloadFilename = $capstone->download_file;
        $downloadUrl      = $capstone->download_url;

        if ($request->hasFile('download_file')) {
            // Delete old file if it exists
            if ($capstone->download_file) {
                Storage::disk('local')->delete('capstone-downloads/' . $capstone->download_file);
            }
            $file             = $request->file('download_file');
            $downloadFilename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('capstone-downloads', $downloadFilename, 'local');
            $downloadUrl = null; // uploaded file takes priority
        } elseif (! empty($data['download_url'])) {
            // New URL provided — clear any uploaded file
            if ($capstone->download_file && $data['download_url'] !== $capstone->download_url) {
                Storage::disk('local')->delete('capstone-downloads/' . $capstone->download_file);
                $downloadFilename = null;
            }
            $downloadUrl = $data['download_url'];
        }

        $technologies = $capstone->technologies;
        if (isset($data['technologies'])) {
            $technologies = empty($data['technologies'])
                ? null
                : array_values(array_filter(array_map('trim', explode(',', $data['technologies']))));
        }

        $capstone->update([
            'title'         => $data['title'],
            'slug'          => $data['slug'],
            'description'   => $data['description'],
            'price'         => $data['price'],
            'category'      => $data['category'] ?? null,
            'technologies'  => $technologies,
            'demo_url'      => $data['demo_url'] ?? null,
            'download_url'  => $downloadUrl,
            'download_file' => $downloadFilename,
            'thumbnail'     => $thumbnailPath,
            'is_available'  => $request->boolean('is_available', $capstone->is_available),
        ]);

        return redirect()->route('admin.capstones.index')
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Capstone $capstone)
    {
        // Delete uploaded download file from private storage
        if ($capstone->download_file) {
            Storage::disk('local')->delete('capstone-downloads/' . $capstone->download_file);
        }

        $capstone->delete();

        return redirect()->route('admin.capstones.index')
            ->with('success', 'Project deleted.');
    }
}
