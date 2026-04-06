<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capstone;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $stats = [
            'total_projects'   => Capstone::count(),
            'available'        => Capstone::where('is_available', true)->count(),
            'sold'             => Capstone::where('is_available', false)->count(),
            'total_orders'     => Order::count(),
            'paid_orders'      => Order::where('status', 'paid')->count(),
            'pending_orders'   => Order::where('status', 'pending')->count(),
            'total_revenue'    => Order::where('status', 'paid')->sum('amount'),
        ];

        $recentOrders = Order::with('capstone')
            ->where('status', 'paid')
            ->orderByDesc('paid_at')
            ->limit(5)
            ->get()
            ->map(fn($o) => [
                'reference'      => $o->reference,
                'customer_name'  => $o->customer_name,
                'capstone_title' => $o->capstone?->title,
                'amount'         => $o->amount,
                'paid_at'        => $o->paid_at?->diffForHumans(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'user'         => ['name' => $user->name, 'email' => $user->email],
            'stats'        => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}
