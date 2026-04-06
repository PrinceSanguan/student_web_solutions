<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DownloadController extends Controller
{
    public function download(Request $request, string $token): StreamedResponse
    {
        $order = Order::with('capstone')
            ->where('download_token', $token)
            ->first();

        if (! $order) {
            abort(404, 'Download link not found.');
        }

        if (! $order->isPaid()) {
            abort(403, 'Payment has not been confirmed for this order.');
        }

        if ($order->isDownloadExpired()) {
            abort(410, 'This download link has expired.');
        }

        $downloadUrl = $order->capstone?->download_url;

        if (! $downloadUrl) {
            Log::error('Download attempted but capstone has no download_url', [
                'order_reference' => $order->reference,
                'capstone_id'     => $order->capstone_id,
            ]);
            abort(503, 'File is not available. Please contact support.');
        }

        // Fetch file server-side — the real origin URL never leaves the server.
        $upstream = Http::timeout(30)->get($downloadUrl);

        if (! $upstream->successful()) {
            Log::error('Failed to fetch file from origin', [
                'status'          => $upstream->status(),
                'order_reference' => $order->reference,
            ]);
            abort(502, 'Could not retrieve file. Please try again later.');
        }

        $contentType = $upstream->header('Content-Type') ?? 'application/octet-stream';
        $fileBody    = $upstream->body();

        // Build a clean filename from the capstone title, not the real URL path.
        $extension = $this->guessExtension($contentType, $downloadUrl);
        $filename  = $this->sanitizeFilename($order->capstone->title) . '.' . $extension;

        return response()->streamDownload(
            function () use ($fileBody) {
                echo $fileBody;
            },
            $filename,
            [
                'Content-Type'        => $contentType,
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                'X-Robots-Tag'        => 'noindex',
                'Cache-Control'       => 'no-store, no-cache, must-revalidate',
            ]
        );
    }

    private function guessExtension(string $contentType, string $url): string
    {
        $map = [
            'application/pdf'              => 'pdf',
            'application/zip'              => 'zip',
            'application/x-zip-compressed' => 'zip',
            'application/octet-stream'     => 'zip',
        ];

        foreach ($map as $mime => $ext) {
            if (str_contains($contentType, $mime)) {
                return $ext;
            }
        }

        // Fallback: extract from URL path
        $path = parse_url($url, PHP_URL_PATH);
        return pathinfo((string) $path, PATHINFO_EXTENSION) ?: 'bin';
    }

    private function sanitizeFilename(string $title): string
    {
        // Replace any character that is not alphanumeric or hyphen with a hyphen
        return trim(preg_replace('/[^a-zA-Z0-9\-]+/', '-', $title), '-');
    }
}
