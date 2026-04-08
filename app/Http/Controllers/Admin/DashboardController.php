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

        $appUrl = config('app.url');

        $stats = [
            'total_projects'   => Capstone::count(),
            'available'        => Capstone::where('is_available', true)->count(),
            'unlisted'         => Capstone::where('is_available', false)->count(),
            'total_orders'     => Order::count(),
            'paid_orders'      => Order::where('status', 'paid')->count(),
            'pending_orders'   => Order::where('status', 'pending')->count(),
            'total_revenue'    => Order::where('status', 'paid')->sum('amount'),
        ];

        $allOrders = Order::with('capstone')
            ->where('status', 'paid')
            ->orderByDesc('paid_at')
            ->get()
            ->map(fn($o) => [
                'id'             => $o->id,
                'reference'      => $o->reference,
                'customer_name'  => $o->customer_name,
                'customer_email' => $o->customer_email,
                'capstone_title' => $o->capstone?->title,
                'amount'         => $o->amount,
                'paid_at'        => $o->paid_at?->toISOString(),
                'email_sent_at'  => $o->email_sent_at?->toISOString(),
            ]);

        return Inertia::render('Admin/Dashboard', [
            'user'      => ['name' => $user->name, 'email' => $user->email],
            'stats'     => $stats,
            'allOrders' => $allOrders,
            'appUrl'    => $appUrl,
        ]);
    }

}
