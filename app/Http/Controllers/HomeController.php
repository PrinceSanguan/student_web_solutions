<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Visitor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Jenssegers\Agent\Agent;

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
}
