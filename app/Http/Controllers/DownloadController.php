<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
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

        $capstone      = $order->capstone;
        $downloadFile  = $capstone?->download_file;
        $downloadUrl   = $capstone?->download_url;

        if (! $downloadFile && ! $downloadUrl) {
            Log::error('Download attempted but capstone has no file or URL', [
                'order_reference' => $order->reference,
                'capstone_id'     => $order->capstone_id,
            ]);
            abort(503, 'File is not available. Please contact support.');
        }

        $cleanTitle = $this->sanitizeFilename($capstone->title);

        // Priority: uploaded file on disk → external URL proxy
        if ($downloadFile) {
            if (! Storage::disk('local')->exists('capstone-downloads/' . $downloadFile)) {
                Log::error('Download file missing from storage', [
                    'file'            => $downloadFile,
                    'order_reference' => $order->reference,
                ]);
                abort(503, 'File is not available. Please contact support.');
            }

            $extension = pathinfo($downloadFile, PATHINFO_EXTENSION) ?: 'bin';
            $filename  = $cleanTitle . '.' . $extension;
            $fullPath  = storage_path('app/capstone-downloads/' . $downloadFile);

            return response()->streamDownload(
                function () use ($fullPath) {
                    readfile($fullPath);
                },
                $filename,
                [
                    'Content-Type'        => 'application/octet-stream',
                    'Content-Disposition' => 'attachment; filename="' . $filename . '"',
                    'X-Robots-Tag'        => 'noindex',
                    'Cache-Control'       => 'no-store, no-cache, must-revalidate',
                ]
            );
        }

        // Proxy from external URL — real URL never leaves the server.
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
        $extension   = $this->guessExtension($contentType, $downloadUrl);
        $filename    = $cleanTitle . '.' . $extension;

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
