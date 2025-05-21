<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Jenssegers\Agent\Agent;
use Illuminate\Support\Facades\Http;
use Pusher\Pusher;

class HomeController extends Controller
{
    /**
     * Display the homepage and track visitor analytics
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        // Track the visitor
        $this->trackVisitor($request);

        // Get analytics data
        $analyticsData = [
            'dailyVisitors' => $this->getDailyVisitors(),
            'monthlyVisitors' => $this->getMonthlyVisitors(),
            'monthlyVisitorsData' => $this->getMonthlyVisitorsData(),
            'dailyVisitorsData' => $this->getDailyVisitorsData(),
            'geographicalDistribution' => $this->getGeographicalDistribution(),
            'activeUsers' => $this->getActiveUsers(),
        ];

        // Broadcast active user for real-time tracking
        $this->broadcastActiveUser($request);

        return Inertia::render('Welcome', $analyticsData);
    }

    /**
     * Track visitor information
     */
    private function trackVisitor(Request $request)
    {
        $ip = $request->ip();
        $agent = new Agent();
        $agent->setUserAgent($request->header('User-Agent'));

        // Check if this IP has already visited today
        $existingVisit = Visitor::where('ip_address', $ip)
            ->whereDate('created_at', Carbon::today())
            ->first();

        if (!$existingVisit) {
            // Get country data based on IP
            $countryData = $this->getCountryFromIp($ip);

            Visitor::create([
                'ip_address' => $ip,
                'country' => $countryData ?? 'Unknown',
                'device_type' => $agent->isDesktop() ? 'Desktop' : ($agent->isTablet() ? 'Tablet' : 'Mobile'),
                'page_visited' => $request->path() ?: '/'
            ]);
        }
    }

    /**
     * Get country information from IP address
     */
    private function getCountryFromIp($ip)
    {
        try {
            // Using the free IP-API service
            $response = Http::get("http://ip-api.com/json/{$ip}");

            if ($response->successful()) {
                $data = $response->json();
                return $data['country'] ?? 'Unknown';
            }
        } catch (\Exception $e) {
            // Log the error but continue execution
            \Log::error('Error determining country from IP: ' . $e->getMessage());
        }

        return 'Unknown';
    }

    /**
     * Get daily unique visitors count
     */
    private function getDailyVisitors()
    {
        return Visitor::whereDate('created_at', Carbon::today())
            ->distinct('ip_address')
            ->count('ip_address');
    }

    /**
     * Get monthly unique visitors count
     */
    private function getMonthlyVisitors()
    {
        return Visitor::whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->distinct('ip_address')
            ->count('ip_address');
    }

    /**
     * Get daily visitors data for chart (last 7 days)
     */
    private function getDailyVisitorsData()
    {
        $results = [];

        // Get data for the last 7 days
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $count = Visitor::whereDate('created_at', $date)
                ->distinct('ip_address')
                ->count('ip_address');

            $results[] = [
                'date' => $date->format('m/d'),
                'visitors' => $count
            ];
        }

        return $results;
    }

    /**
     * Get monthly visitors data for chart (last 5 months)
     */
    private function getMonthlyVisitorsData()
    {
        $results = [];

        // Get data for the last 5 months
        for ($i = 4; $i >= 0; $i--) {
            $date = Carbon::now()->subMonths($i);
            $count = Visitor::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->distinct('ip_address')
                ->count('ip_address');

            $results[] = [
                'date' => $date->format('M'),
                'visitors' => $count
            ];
        }

        return $results;
    }

    /**
     * Get geographical distribution of visitors
     */
    private function getGeographicalDistribution()
    {
        $countries = Visitor::select('country', DB::raw('COUNT(DISTINCT ip_address) as visitors'))
            ->whereNotNull('country')
            ->where('country', '!=', 'Unknown')
            ->groupBy('country')
            ->orderBy('visitors', 'desc')
            ->limit(3)
            ->get()
            ->toArray();

        // Add "Other" category
        $topCountriesCount = array_sum(array_column($countries, 'visitors'));
        $totalCount = Visitor::distinct('ip_address')->count('ip_address');
        $otherCount = $totalCount - $topCountriesCount;

        if ($otherCount > 0) {
            $countries[] = [
                'country' => 'Other',
                'visitors' => $otherCount
            ];
        }

        return $countries;
    }

    /**
     * Get active users count
     */
    private function getActiveUsers()
    {
        // For simplicity, consider sessions active in the last 15 minutes
        $activeCount = Visitor::where('created_at', '>=', Carbon::now()->subMinutes(15))->count();

        // Get breakdown by page
        $pageBreakdown = Visitor::select('page_visited', DB::raw('COUNT(*) as count'))
            ->where('created_at', '>=', Carbon::now()->subMinutes(15))
            ->groupBy('page_visited')
            ->orderBy('count', 'desc')
            ->limit(3)
            ->get()
            ->toArray();

        return [
            'count' => $activeCount,
            'breakdown' => $pageBreakdown
        ];
    }

    /**
     * Broadcast active user for real-time updates
     */
    private function broadcastActiveUser(Request $request)
    {
        try {
            $pusher = new Pusher(
                env('PUSHER_APP_KEY', '5ccdc1968f9495836d5e'),
                env('PUSHER_APP_SECRET', '6a6036c2c6cd0f838d36'),
                env('PUSHER_APP_ID', '1995759'),
                [
                    'cluster' => env('PUSHER_APP_CLUSTER', 'mt1'),
                    'useTLS' => true
                ]
            );

            $pusher->trigger('visitor-channel', 'new-visitor', [
                'path' => $request->path() ?: '/',
                'timestamp' => Carbon::now()->toDateTimeString()
            ]);
        } catch (\Exception $e) {
            // Log error but continue execution
            \Log::error('Pusher error: ' . $e->getMessage());
        }
    }
}
