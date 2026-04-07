<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Controllers\WebhookController;
use App\Models\Capstone;
use App\Models\Order;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $appUrl    = config('app.url');
        $urlIsLocal = str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1');

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
            'user'        => ['name' => $user->name, 'email' => $user->email],
            'stats'       => $stats,
            'allOrders'   => $allOrders,
            'appUrl'      => $appUrl,
            'urlIsLocal'  => $urlIsLocal,
            'mailFrom'    => config('mail.from.address'),
        ]);
    }

    /**
     * Send a plain test email to verify SMTP is working end-to-end.
     */
    public function testEmail(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:150'],
        ]);

        $to      = $validated['email'];
        $appUrl  = config('app.url');
        $from    = config('mail.from.address');

        Log::info('[TestEmail] Admin triggered test email', [
            'to'      => $to,
            'from'    => $from,
            'app_url' => $appUrl,
        ]);

        try {
            Mail::raw(
                "This is a test email from Student Web Solutions.\n\n"
                . "If you received this, your SMTP configuration is working correctly.\n\n"
                . "Current APP_URL: {$appUrl}\n"
                . "Sent from: {$from}\n\n"
                . "Note: if APP_URL contains 'localhost', download links in purchase emails\n"
                . "will be broken. Update APP_URL in .env to your real domain.",
                function ($message) use ($to, $from) {
                    $message->to($to)
                            ->subject('Test Email — Student Web Solutions SMTP Check');
                }
            );

            Log::info('[TestEmail] Test email sent successfully', ['to' => $to]);
            return back()->with('success', "Test email sent to {$to}. Check your inbox (and spam folder).");

        } catch (\Throwable $e) {
            Log::error('[TestEmail] FAILED', [
                'to'    => $to,
                'error' => $e->getMessage(),
                'class' => get_class($e),
            ]);
            return back()->with('error', "SMTP error: {$e->getMessage()}");
        }
    }

    /**
     * Resend the purchase confirmation email for a specific paid order.
     */
    public function resendEmail(Order $order)
    {
        if (! $order->isPaid()) {
            return back()->with('error', "Order {$order->reference} is not paid — cannot resend.");
        }

        $order->update(['email_sent_at' => null]);
        $order->load('capstone');

        WebhookController::dispatchConfirmationEmail($order);

        return back()->with('success', "Confirmation email resent to {$order->customer_email}.");
    }
}
