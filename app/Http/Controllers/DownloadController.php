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
        // 1. Validate token format before hitting the DB (64 alphanumeric chars only)
        if (! preg_match('/^[a-zA-Z0-9]{64}$/', $token)) {
            abort(404, 'Download link not found.');
        }

        $order = Order::with('capstone')
            ->where('download_token', $token)
            ->first();

        if (! $order) {
            abort(404, 'Download link not found.');
        }

        // 2. Local database check — order must be paid
        if (! $order->isPaid()) {
            abort(403, 'Payment has not been confirmed for this order.');
        }

        // 3. Remote verification — confirm payment status with Chessuno gateway
        //    before serving the file. This ensures we cannot be tricked by a
        //    manually-altered database record.
        $this->verifyPaymentWithGateway($order);

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

    /**
     * Verify payment status with the Chessuno gateway in real-time.
     *
     * This is a belt-and-suspenders check on top of the webhook-based flow.
     * If the gateway reports the payment is NOT paid, we abort even if the
     * local DB says paid (guards against tampered records).
     *
     * If the gateway is unreachable we log and allow the local status to stand —
     * the webhook-verified DB record is authoritative in that case.
     */
    private function verifyPaymentWithGateway(Order $order): void
    {
        $gatewayRef = $order->gateway_reference;

        if (! $gatewayRef) {
            // No gateway reference stored — webhook may not have supplied one.
            // Fall back to trusting the local paid status.
            return;
        }

        try {
            $gatewayUrl = rtrim(config('services.chessuno.gateway_url'), '/');
            $response   = Http::withHeaders([
                'X-API-Key'    => config('services.chessuno.api_key'),
                'X-API-Secret' => config('services.chessuno.api_secret'),
                'Accept'       => 'application/json',
            ])->timeout(10)->get("{$gatewayUrl}/api/v1/payments/{$gatewayRef}");

            if (! $response->successful()) {
                // Gateway error — log and allow local status to stand.
                Log::warning('Chessuno payment verification returned non-2xx; trusting local record', [
                    'http_status'      => $response->status(),
                    'order_reference'  => $order->reference,
                    'gateway_reference' => $gatewayRef,
                ]);
                return;
            }

            $data          = $response->json();
            $gatewayStatus = $data['status'] ?? $data['payment_status'] ?? null;

            if ($gatewayStatus !== null && strtolower($gatewayStatus) !== 'paid') {
                Log::warning('Chessuno reports payment NOT paid at download time', [
                    'gateway_status'    => $gatewayStatus,
                    'order_reference'   => $order->reference,
                    'gateway_reference' => $gatewayRef,
                ]);
                abort(403, 'Payment has not been confirmed by the payment gateway.');
            }

        } catch (\Throwable $e) {
            // Network / timeout — log and allow local status to stand.
            Log::warning('Chessuno payment verification request failed; trusting local record', [
                'error'            => $e->getMessage(),
                'order_reference'  => $order->reference,
            ]);
        }
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
