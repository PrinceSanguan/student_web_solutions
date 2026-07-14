<?php

use Illuminate\Support\Facades\Route;

// Middleware
use App\Http\Middleware\GuestMiddleware;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\UserMiddleware;

// Controllers
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ChatBotController;
use App\Http\Controllers\CapstoneController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\SocialAuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\CapstoneController as AdminCapstoneController;
use App\Http\Controllers\User\UserDashboardController;
use App\Http\Controllers\User\UserSettingsController;

/*
|--------------------------------------------------------------------------
| Web Routes - Throttled
|--------------------------------------------------------------------------
*/

Route::middleware(['web', 'throttle:10,1'])->group(function () {

  /*
    |------------------------------------------
    | Visitor-tracked public pages
    |------------------------------------------
    */

  Route::get('/', [HomeController::class, 'index'])->name('home');

  Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap');

  Route::get('/robots.txt', function () {
    $content = "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard\nDisallow: /user/\nDisallow: /login\nDisallow: /register\n\nSitemap: " . url('/sitemap.xml');
    return response($content, 200)->header('Content-Type', 'text/plain');
  });

  Route::get('/capstone', [CapstoneController::class, 'index'])->name('capstone.index');
  Route::get('/capstone/{slug}', [CapstoneController::class, 'show'])->name('capstone.show');

  Route::get('/project/{id}', [ProjectController::class, 'show'])->name('project.show');

  Route::get('/api/clarity-analytics', [HomeController::class, 'getAnalytics']);

  /*
    |------------------------------------------
    | ChatBot route (separate throttle rule)
    |------------------------------------------
    */
  Route::post('/chatbot', [ChatBotController::class, 'index'])
    ->middleware('throttle:chatbot')
    ->name('chatbot');

  /*
    |------------------------------------------
    | Authentication Routes
    |------------------------------------------
    */
  Route::get('login', [LoginController::class, 'index'])
    ->middleware(GuestMiddleware::class)
    ->name('auth.login');

  Route::post('login', [LoginController::class, 'store'])->name('auth.login.store');
  Route::get('logout', [LoginController::class, 'destroy'])->name('auth.logout');

  /*
    |------------------------------------------
    | Google OAuth
    |------------------------------------------
    */
  Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle'])->name('auth.google');
  Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');

  // Registration is disabled — the system is admin-only.

  /*
    |------------------------------------------
    | Admin Routes
    |------------------------------------------
    */
  Route::middleware([AdminMiddleware::class])->group(function () {
    Route::get('admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('admin/settings', [SettingsController::class, 'index'])->name('admin.settings');
    Route::put('admin/settings/profile', [SettingsController::class, 'updateProfile'])->name('admin.settings.updateProfile');
    Route::put('admin/settings/password', [SettingsController::class, 'updatePassword'])->name('admin.settings.updatePassword');

    // Capstone project management
    Route::get('admin/capstones', [AdminCapstoneController::class, 'index'])->name('admin.capstones.index');
    Route::get('admin/capstones/create', [AdminCapstoneController::class, 'create'])->name('admin.capstones.create');
    Route::post('admin/capstones', [AdminCapstoneController::class, 'store'])->name('admin.capstones.store');
    Route::get('admin/capstones/{capstone}/edit', [AdminCapstoneController::class, 'edit'])->name('admin.capstones.edit');
    Route::put('admin/capstones/{capstone}', [AdminCapstoneController::class, 'update'])->name('admin.capstones.update');
    Route::delete('admin/capstones/{capstone}', [AdminCapstoneController::class, 'destroy'])->name('admin.capstones.destroy');
  });

  /*
    |------------------------------------------
    | User Routes
    |------------------------------------------
    */
  Route::middleware([UserMiddleware::class])->group(function () {
    Route::get('dashboard', [UserDashboardController::class, 'index'])->name('user.dashboard');
    Route::get('user/settings', [UserSettingsController::class, 'index'])->name('user.settings');
    Route::put('user/settings/profile', [UserSettingsController::class, 'updateProfile'])->name('user.settings.updateProfile');
    Route::put('user/settings/password', [UserSettingsController::class, 'updatePassword'])->name('user.settings.updatePassword');
  });
});
