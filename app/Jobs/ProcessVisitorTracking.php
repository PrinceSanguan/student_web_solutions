<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Visitor;
use Carbon\Carbon;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Http;

class ProcessVisitorTracking implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $ip;
    protected $path;
    protected $userAgent;

    /**
     * Create a new job instance.
     */
    public function __construct($ip, $path, $userAgent)
    {
        $this->ip = $ip;
        $this->path = $path;
        $this->userAgent = $userAgent;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $agent = new Agent();
        $agent->setUserAgent($this->userAgent);

        // Check if this IP has already visited today
        $existingVisit = Visitor::where('ip_address', $this->ip)
            ->whereDate('created_at', Carbon::today())
            ->first();

        if (!$existingVisit) {
            // Get country data based on IP
            $countryData = $this->getCountryFromIp($this->ip);

            Visitor::create([
                'ip_address' => $this->ip,
                'country' => $countryData ?? 'Unknown',
                'device_type' => $agent->isDesktop() ? 'Desktop' : ($agent->isTablet() ? 'Tablet' : 'Mobile'),
                'page_visited' => $this->path ?: '/'
            ]);
        }
    }

    /**
     * Get country information from IP address
     */
    private function getCountryFromIp($ip)
    {
        try {
            // Using a more reliable IP geolocation API
            $response = Http::get("https://ipapi.co/{$ip}/json/");

            if ($response->successful()) {
                $data = $response->json();
                return $data['country_name'] ?? 'Unknown';
            }
        } catch (\Exception $e) {
            // Log the error but continue execution
            \Log::error('Error determining country from IP: ' . $e->getMessage());
        }

        return 'Unknown';
    }
}
