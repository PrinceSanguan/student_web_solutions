@AGENTS.md

# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui (Radix) and a
handful of Aceternity components. A portfolio and catalog site for "Student Web Solutions" —
ready-made capstone systems for Filipino students.

**The site is fully static: no database, no auth, no writes.** The catalog is a JSON file in the
repo. Everything except one optional API proxy is prerendered at build time.

This is a port of a Laravel 12 + Inertia 2 app that still lives at
`D:\boilerplate\StudentWebSolutions`. When something here looks arbitrary, that is usually why —
check the original before "fixing" it.

## Commands

```bash
npm run dev                 # http://localhost:3000
npm run build               # the only reliable client/server boundary check
npm start                   # serve the production build
npm run lint
npm run typecheck
npm run format
```

There are no tests. `npm run build` is the gate that catches what matters — `npm run dev`
tolerates server/client boundary errors the build rejects.

## Content lives in `content/`

Two files, both edited-and-redeployed — there is no CMS:

- `content/capstones.json` — the project catalog
- `content/services.ts` — the four service pages (TypeScript so the shape is
  checked at build time and the prose keeps its apostrophes unescaped)

## The catalog

`content/capstones.json` is the whole CMS. `lib/capstones.ts` imports it directly — no
filesystem, no `server-only` boundary — and exposes three functions:

- `listAvailable()` — the grid and the sitemap
- `findPublicBySlug(slug)` — the detail page
- `listSlugs()` — feeds `generateStaticParams`

`toPublic()` strips `price`, `download_url` and `download_file` before anything reaches a
component. That projection is the only thing keeping internal fields off the public pages —
**keep it that way** when adding a field.

`findPublicBySlug` deliberately ignores `is_available`, so an unlisted project stays reachable by
its direct URL and only drops out of the grid. That matches the Laravel `firstOrFail()` query.

### Adding a service

Append to `content/services.ts`. The route, sitemap entry, schema, footer link and
homepage card all derive from that array — nothing else needs touching.

### Adding a capstone field

`lib/types.ts` then `lib/capstones.ts` (`toPublic`, if it is public) then the components. Adding
a field to `PublicCapstone` exposes it; leaving it out keeps it internal.

## Architecture

```
app/
  layout.tsx              html/body, next/font, all the SEO metadata, LocalBusiness JSON-LD,
                          Vercel Analytics + Speed Insights
  page.tsx                landing page
  robots.ts sitemap.ts    file conventions — no plugin, no Blade template
  capstone/               catalog + detail (both prerendered)
  services/               hub + one page per service (all prerendered)
  api/clarity-analytics/  Microsoft Clarity proxy
components/
  ui/                     shadcn + Aceternity primitives — vendored third-party code
  landing/ capstone/
content/capstones.json    the catalog
lib/
  capstones.ts            read-only accessors over the JSON
  services.ts             read-only accessors over content/services.ts
  seo.ts                  JSON-LD builders (Service, FAQPage, Breadcrumb, ItemList)
  routes.ts               every internal path (replaces Ziggy's route())
  site.ts types.ts rate-limit.ts utils.ts
```

### Pages are Server Components

A page reads `lib/capstones.ts` and passes plain props to a client component. The interactive
parts are thin and separate: `components/capstone/catalog.tsx` holds the category filter,
`components/capstone/detail.tsx` holds the hover animations.

### Everything is prerendered

`/capstone/[slug]` uses `generateStaticParams` plus `dynamicParams = false`, so all six pages are
built ahead of time and an unknown slug is a plain 404. There is no ISR window and nothing to
revalidate — the data cannot change without a rebuild. If the catalog ever becomes dynamic again,
that is the assumption to revisit.

### Dark mode is off

Deliberately. The Laravel app stripped the `dark` class in JS on every load; here `globals.css`
pins `color-scheme: light` so there is no flash of the wrong theme before hydration. The `.dark`
tokens stay defined because many components still carry `dark:` variants — they never activate.

### `components/ui/` is vendored

shadcn and Aceternity code, pasted in rather than authored here. It is excluded from Prettier
(see `.prettierignore`) so a future `npx shadcn@latest add x` produces a clean diff. Several
files carry `react-hooks/exhaustive-deps` warnings that would need the animation logic
restructured; prefer leaving them alone.

One rule does matter there: **never call `Math.random()` in a render body.** The server and the
client roll different numbers, which is a hydration mismatch, and React may re-render at any
time. Use `seededRandom(index)` from `lib/utils.ts` — several components were fixed this way.

## SEO — the rules that are load-bearing

The homepage once shipped 116 indexable words, two `<h1>`s whose text read
`Getacompletesystem` (the per-word `<span>`s were spaced with `mr-2` and no actual
whitespace), and **zero** crawlable internal links — its only route to `/capstone`
was a `router.push()` in an `onClick`. Those are fixed; keep them fixed.

- **Never navigate with `router.push` or `window.open` where a `<Link>` would do.**
  A crawler cannot follow a click handler, so those pages receive no link equity.
- **Animating text word-by-word must still emit real spaces** — `{word}{' '}`
  inside the span, not a margin alone. `mr-2` draws the gap; the space carries the
  meaning.
- **`content/services.ts` is the ranking surface.** Each page needs 600+ words of
  genuine copy; the FAQ array is rendered *and* fed to `faqJsonLd()`, so the
  answers exist in the HTML. Schema describing text a crawler cannot find is an
  error, not a rich result — which is why the FAQs use native `<details>` rather
  than a JS accordion that mounts empty.
- **The hero keeps two `<h1>`s on purpose.** Mobile and desktop are separate
  layouts, mutually exclusive by CSS. Collapsing to one would leave whichever
  viewport lost it without a heading, and Google states plainly that multiple h1s
  are fine. Do not "fix" this by deleting one.
- **`app/sitemap.ts` uses each record's `updated_at`**, never the build clock.
  Stamping every URL with the deploy time tells Google the whole site changed, and
  it learns to distrust the signal.

## Deliberate differences from the Laravel app

- **No admin panel, no login, no auth.** Removed at the owner's request — the catalog is edited
  in `content/capstones.json` and deployed. Gone with it: the signed-cookie session, scrypt
  password hashing, `proxy.ts`, the JSON store's atomic-write layer, file-upload handling, and
  `scripts/set-admin-password.mjs`. The Laravel controllers remain the reference if a CMS is ever
  wanted again — it would want a real database, not the old file store.
- **The Gemini chatbot is removed.** Ported and working, then dropped — there is no
  `GEMINI_API_KEY` to run it. The Laravel `ChatBotController` is the reference if it comes back.
- **The contribution graph changed host.** `github-readme-activity-graph.vercel.app` is dead
  (402 `DEPLOYMENT_DISABLED`), which showed a broken image on the landing page. Now
  `ghchart.rshah.org`, with an `onError` that hides the card if that host dies too.
- **`sitemap.ts` lists real URLs.** The Blade version emitted twelve hardcoded `/project/{id}`
  URLs pointing at a page component that did not exist, so all twelve served 500s to crawlers.
- **Dropped because it was unreachable:** Google OAuth and Socialite, the welcome email,
  registration, the user dashboard and the `user.*` routes, `/project/{id}`, and visitor tracking
  (`HomeController::index` never called its own `trackVisitor`).
- **`throttle:10,1` is not applied globally.** A per-IP cap on every route would break RSC
  navigation. Only the analytics proxy is limited now, at 10/min. See `lib/rate-limit.ts`.

## Known rough edges inherited from the source

- `components/landing/footer.tsx`, `github.tsx` and `sections/ProjectShowcase.tsx` have broken
  leftover ternaries inside `className` template strings that emit literal quotes as class names.
  Cosmetic, carried over verbatim, worth a cleanup pass.
- `components/ui/terminal.tsx` fetches `/sounds/sound.ogg`, which does not exist. Harmless —
  `terminal-section.tsx` passes `enableSound={false}`, so the fetch never runs.
- `/api/clarity-analytics` has no caller in the UI; the component that used it was dead code in
  the Laravel app and was not ported. It works if given a `CLARITY_API_TOKEN`.

## Environment

`.env.local` for development, `.env.example` is the template.

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes in production | canonical URLs, sitemap, Open Graph, JSON-LD |
| `CLARITY_API_TOKEN` | optional | only `/api/clarity-analytics` uses it |

**`NEXT_PUBLIC_SITE_URL` is read at build time.** Unset, the site publishes
`http://localhost:3000` as its canonical URL — which is exactly what the first Vercel deploy did.
Set it in the host's environment variables and rebuild; changing it after a build has no effect.

## Deploying

Static output, so any host works. Vercel Web Analytics and Speed Insights are wired into
`app/layout.tsx` and report only from a Vercel deployment; locally they are no-ops.
