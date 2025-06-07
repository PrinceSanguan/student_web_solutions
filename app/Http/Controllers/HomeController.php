<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;


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
        ];

        return Inertia::render('Welcome', $analyticsData);
    }

    /**
     * Track visitor information
     */
    private function trackVisitor(Request $request)
    {
        $ipAddress = $request->ip();
        $userAgent = $request->userAgent();
        $today = Carbon::today();

        // Only track one visit per IP per day
        Visitor::firstOrCreate([
            'ip_address' => $ipAddress,
            'visited_at' => $today,
        ], [
            'user_agent' => $userAgent,
        ]);
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

    public function getAnalytics()
    {
        try {
            $clarityApiToken = env('CLARITY_API_TOKEN'); // Add this to your .env file

            if (!$clarityApiToken) {
                return response()->json([
                    'success' => false,
                    'message' => 'Clarity API token not configured'
                ], 500);
            }

            // Fetch data from Microsoft Clarity API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $clarityApiToken,
                'Content-Type' => 'application/json'
            ])->get('https://www.clarity.ms/export-data/api/v1/project-live-insights', [
                'numOfDays' => 3,
                'dimension1' => 'Device',
                'dimension2' => 'Page'
            ]);

            if ($response->successful()) {
                $data = $response->json();

                // Process and format the data
                $formattedData = $this->formatClarityData($data);

                return response()->json([
                    'success' => true,
                    'data' => $formattedData
                ]);
            } else {
                Log::error('Clarity API Error: ' . $response->body());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to fetch data from Clarity API'
                ], $response->status());
            }
        } catch (\Exception $e) {
            Log::error('Clarity Analytics Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error fetching analytics data'
            ], 500);
        }
    }

    private function formatClarityData($rawData)
    {
        // Process the raw Clarity API response and format it for your frontend
        $totalSessions = $rawData['totalSessions'] ?? 0;
        $totalPageViews = $rawData['totalPageViews'] ?? 0;
        $uniqueUsers = $rawData['uniqueUsers'] ?? 0;
        $avgSessionDuration = $rawData['avgSessionDuration'] ?? 0;

        // Process device data
        $deviceData = [];
        if (isset($rawData['dimensions']) && isset($rawData['dimensions']['Device'])) {
            foreach ($rawData['dimensions']['Device'] as $device => $stats) {
                $deviceData[] = [
                    'dimension' => $device,
                    'sessions' => $stats['sessions'] ?? 0,
                    'pageViews' => $stats['pageViews'] ?? 0
                ];
            }
        }

        // Process daily data (last 3 days)
        $dailyData = [];
        if (isset($rawData['dailyBreakdown'])) {
            foreach ($rawData['dailyBreakdown'] as $date => $stats) {
                $dailyData[] = [
                    'date' => $date,
                    'sessions' => $stats['sessions'] ?? 0,
                    'pageViews' => $stats['pageViews'] ?? 0,
                    'users' => $stats['users'] ?? 0
                ];
            }
        }

        // Process top pages
        $topPages = [];
        if (isset($rawData['dimensions']) && isset($rawData['dimensions']['Page'])) {
            $pages = $rawData['dimensions']['Page'];
            arsort($pages); // Sort by views descending

            foreach (array_slice($pages, 0, 10) as $page => $stats) {
                $topPages[] = [
                    'page' => $page,
                    'views' => $stats['pageViews'] ?? 0
                ];
            }
        }

        return [
            'totalSessions' => $totalSessions,
            'totalPageViews' => $totalPageViews,
            'uniqueUsers' => $uniqueUsers,
            'bounceRate' => $rawData['bounceRate'] ?? 0,
            'avgSessionDuration' => $avgSessionDuration,
            'deviceData' => $deviceData,
            'dailyData' => $dailyData,
            'topPages' => $topPages
        ];
    }
}
