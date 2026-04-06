# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Laravel 12 + React 19 + Inertia.js 2 + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix UI). The app is a portfolio/services site for "Student Web Solutions" with an AI chatbot (Google Gemini), visitor analytics, and role-based dashboards.

## Commands

**Start full dev environment (server + queue + logs + Vite):**
```bash
composer run dev
```

**Or run individually:**
```bash
php artisan serve          # Laravel dev server at http://127.0.0.1:8000
npm run dev                # Vite HMR
```

**Frontend:**
```bash
npm run build              # Production build
npm run build:ssr          # SSR build
npm run lint               # ESLint with auto-fix
npm run types              # TypeScript type check (no emit)
npm run format             # Prettier (write)
npm run format:check       # Prettier (check only)
```

**PHP:**
```bash
php artisan migrate                    # Run migrations
php artisan migrate:fresh --seed       # Reset DB and seed
vendor/bin/phpunit                     # Run all tests
vendor/bin/phpunit --filter TestName   # Run a single test
vendor/bin/pint                        # PHP code style fixer
```

**Tests use SQLite in-memory** (configured in `phpunit.xml`) — no DB setup needed.

## Architecture

### Inertia.js Data Flow

Laravel controllers return `Inertia::render('PageName', $props)` — there are no separate API routes for page data. The page name maps directly to `resources/js/pages/PageName.tsx`. Shared data (auth user, flash messages, app name, Ziggy routes) is injected globally in `HandleInertiaRequests::share()`.

Flash messages are passed via `->with('success'|'error'|'info', ...)` on redirects and consumed from `usePage().props.flash` on the frontend.

### Role-Based Access

`User.user_role` is either `'admin'` or a regular user (no explicit string). Three custom middleware classes gate routes:
- `AdminMiddleware` — requires `user_role === 'admin'`
- `UserMiddleware` — requires authenticated non-admin user
- `GuestMiddleware` — blocks authenticated users (login/register pages)

### Route Groups

All routes are wrapped in `throttle:10,1`. The chatbot has its own `throttle:chatbot` limit. Route names follow the pattern: `auth.*`, `admin.*`, `user.*`.

### Frontend Structure

```
resources/js/
  pages/
    Welcome.tsx          # Public landing page
    Auth/Login.tsx       # Auth/Register.tsx
    Admin/Dashboard.tsx  # Admin panel
    User/Dashboard.tsx   # User panel
  layouts/
    app-layout.tsx       # Delegates to app/app-sidebar-layout.tsx
    auth-layout.tsx      # Delegates to auth/
  components/
    ui/                  # shadcn/ui primitives (Radix-based)
    landing/
      sections/          # HeroLanding, ProjectShowcase, LiveProject
      animations/        # CustomCursor, ParticleBackground, GSAP/Framer components
      cards/             # InteractiveCard, TiltCard
      chat-bot.tsx       # AI chatbot UI (posts to /chatbot)
```

The `components/` directory at the project root (alongside `resources/`) contains additional demo/UI components used separately from the main app.

### Path Aliases

`@/` resolves to `resources/js/` (configured in Vite).

### ChatBot

`POST /chatbot` → `ChatBotController` → Google Gemini API (`gemini-2.5-flash-lite`). Requires `GEMINI_API_KEY` in `.env` (accessed via `config('services.gemini.api_key')`). Conversation history is passed as the `conversation` array in the request body.

### Analytics

`GET /api/clarity-analytics` proxies to the Microsoft Clarity API. Requires `CLARITY_API_TOKEN` in `.env`. The `Visitor` model tracks unique daily visitors by IP.

### Theme

Dark mode is intentionally disabled. `app.tsx` forcibly removes the `dark` class from `<html>` on load. Do not re-enable the `initializeTheme()` import without understanding this constraint.

### Social Auth

Google OAuth is handled by `SocialAuthController` via Laravel Socialite. Requires `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `.env`.
