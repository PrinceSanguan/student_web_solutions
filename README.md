# Student Web Solutions

Portfolio and catalog site for Student Web Solutions — ready-made capstone systems for Filipino
students.

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · fully static, no database.

Ported from the Laravel 12 + Inertia 2 app at `D:\boilerplate\StudentWebSolutions`.

## Getting started

```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_SITE_URL
npm run dev                    # http://localhost:3000
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | dev server |
| `npm run build` | production build |
| `npm start` | serve the production build |
| `npm run lint` | eslint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | prettier |

## Routes

| Path | |
|---|---|
| `/` | landing page |
| `/capstone` | catalog |
| `/capstone/[slug]` | project detail — one prerendered page per project |
| `/services` | services hub |
| `/services/[slug]` | one page per service — web development, AI automation, Facebook Ads, Google Ads |
| `/api/clarity-analytics` | Microsoft Clarity proxy (optional, unused by the UI) |
| `/robots.txt`, `/sitemap.xml` | generated |

Everything except the Clarity proxy is prerendered at build time and served as static HTML.

## Editing the services

The four service pages live in **`content/services.ts`** — hero copy, body sections, FAQs, and
which projects to show as proof. Add an object to the array and the route, sitemap entry, schema,
footer link and homepage card all follow automatically.

Each page needs at least 600 words of real copy to rank. The FAQ array is rendered on the page
*and* used to build the `FAQPage` schema, so both stay in sync by construction.

## Editing the catalog

The catalog lives in **`content/capstones.json`** — one object per project. Edit it, commit, and
redeploy; that is the whole workflow. There is no admin panel and no database.

A project needs at least:

```json
{
  "id": 7,
  "title": "Payroll Management System",
  "slug": "payroll-management-system",
  "description": "What it does.\n\nKey Features:\n• Bullet lists work — newlines are preserved.",
  "price": 0,
  "category": "Business System",
  "technologies": ["Laravel 12", "React 19"],
  "demo_url": "https://demo.example.com",
  "download_url": null,
  "download_file": null,
  "thumbnail": "https://example.com/screenshot.png",
  "is_available": true,
  "created_at": "2026-09-14T00:00:00.000Z",
  "updated_at": "2026-09-14T00:00:00.000Z"
}
```

- `id` must be unique. `slug` becomes the URL and must be lowercase letters, numbers and hyphens.
- `category` drives the filter pills: `Business System`, `School System`, `Government System`,
  `Healthcare`, `Hospitality`. Anything else still renders but gets no coloured badge.
- `is_available: false` hides a project from the grid and the sitemap; its direct URL still works.
- `created_at` orders the grid, newest first.
- `price`, `download_url` and `download_file` are internal — they are never rendered publicly.
- The description supports line breaks and `•` / `-` bullet lists on the detail page.

## Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | **yes in production** | canonical URLs, sitemap, Open Graph, JSON-LD |
| `CLARITY_API_TOKEN` | optional | only the analytics proxy uses it |

`NEXT_PUBLIC_SITE_URL` is read **at build time**. If it is unset the site falls back to
`http://localhost:3000` and publishes that to Google — set it in your host's environment
variables and redeploy.

## Deploying

Static output, so anywhere works — Vercel included. Vercel Web Analytics and Speed Insights are
already wired into the root layout and start reporting once deployed there.

## Contributing

`CLAUDE.md` documents the architecture and the places where this port deliberately differs from
the Laravel original.
