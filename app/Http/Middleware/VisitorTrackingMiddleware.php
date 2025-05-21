<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Jobs\ProcessVisitorTracking;

class VisitorTrackingMiddleware
{
    /**
     * Process visitor tracking asynchronously to improve response time.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Don't track admin routes and API calls
        if (!$request->is('admin/*') && !$request->is('api/*')) {
            // Queue the tracking process instead of processing it inline
            ProcessVisitorTracking::dispatch(
                $request->ip(),
                $request->path(),
                $request->header('User-Agent')
            );
        }

        return $response;
    }
}
