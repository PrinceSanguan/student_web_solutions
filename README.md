# Student Web Solutions

Portfolio and catalog site for Student Web Solutions — ready-made capstone systems for Filipino
students — with an AI chatbot and an admin-only CMS for the catalog.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · no database.

This is a port of the Laravel 12 + Inertia 2 app at `D:\boilerplate\StudentWebSolutions`.

## Getting started

```bash
npm install
cp .env.example .env.local
```

Generate a session secret and put it in `.env.local` as `ADMIN_SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Create the admin account:

```bash
npm run set-admin-password -- you@example.com "your-password" "Your Name"
```

Then:

```bash
npm run dev        # http://localhost:3000
```

Sign in at `/login`, manage the catalog at `/admin/capstones`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run lint` | eslint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | prettier |
| `npm run set-admin-password -- <email> <password> [name]` | provision or reset the admin account |

## Routes

| Path | |
|---|---|
| `/` | landing page |
| `/capstone` | public catalog |
| `/capstone/[slug]` | project detail |
| `/login`, `/logout` | admin sign in / out |
| `/admin/dashboard` | stats and quick actions |
| `/admin/capstones` | list, create, edit, delete |
| `/admin/settings` | name and password |
| `/api/chatbot` | Gemini proxy (3 requests/min per IP) |
| `/api/clarity-analytics` | Microsoft Clarity proxy |
| `/robots.txt`, `/sitemap.xml` | generated |

## No database

Capstone records and the admin account are JSON files under `data/`, behind `lib/store/`:

```
data/
  capstones.json
  admin.json
  uploads/capstone-downloads/
```

Writes are atomic and serialised per file. `data/` is gitignored, so it is per-machine state — a
fresh clone starts with an empty catalog and no admin account.

**This means the app needs a writable filesystem and a single process.** `next start` on a PC or a
VPS is fine; Vercel and other read-only serverless hosts are not. `lib/store/` is the one seam to
replace if that changes.

## Deploying

Serve over **HTTPS**. In production the session cookie is set `Secure`, so a browser will not
store it over plain HTTP and login will silently fail to stick. (`localhost` is exempt — browsers
treat it as a secure context, so `npm start` works locally either way.)

Set `NEXT_PUBLIC_SITE_URL` to the real origin before building: it is baked into the canonical
URLs, the sitemap and the Open Graph tags.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_SESSION_SECRET` | yes | signs the session cookie |
| `NEXT_PUBLIC_SITE_URL` | yes in production | canonical URL, sitemap, Open Graph |
| `GEMINI_API_KEY` | for the chatbot | `/api/chatbot` returns 503 without it |
| `CLARITY_API_TOKEN` | optional | only the analytics proxy uses it |

## Contributing

`CLAUDE.md` documents the architecture, the conventions, and the places where this port
deliberately differs from the Laravel original. Read it before changing the data layer, the auth
flow, or anything under `components/ui/`.
