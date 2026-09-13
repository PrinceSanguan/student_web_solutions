@AGENTS.md

# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Stack

Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui (Radix) and a
handful of Aceternity components. A portfolio and catalog site for "Student Web Solutions" —
ready-made capstone systems for Filipino students — with a Gemini-backed chatbot and an
admin-only CMS for the catalog.

**There is no database.** Capstone records and the single admin account are JSON files on disk
under `data/`, behind `lib/store/`. See [Data](#data) below.

This is a port of a Laravel 12 + Inertia 2 app that still lives at
`D:\boilerplate\StudentWebSolutions`. When something here looks arbitrary, that is usually why —
check the original before "fixing" it.

## Commands

```bash
npm run dev                 # http://localhost:3000
npm run build               # production build — the only reliable client/server boundary check
npm start                   # serve the production build
npm run lint                # eslint
npm run typecheck           # tsc --noEmit
npm run format              # prettier --write

npm run set-admin-password -- <email> <password> [name]   # provision or reset the admin account
```

There are no tests yet. `npm run build` is the gate that catches the mistakes that matter here —
`npm run dev` tolerates server/client boundary errors that the build rejects.

## Data

```
data/                                  gitignored — per-machine state
  capstones.json                       the old `capstones` table
  admin.json                           name, email, scrypt password hash
  uploads/capstone-downloads/          private delivery files
```

`lib/store/` is the only thing that touches `data/`. Reads and writes go through
`json-file.ts`, which makes writes atomic (temp file + rename) and serialises writes to the same
file through a promise chain — two Server Actions firing at once would otherwise lose a record.

**The lock is per-process.** One `next dev` or `next start` is one process, which is how this app
runs. A multi-instance deployment needs a real database instead, and `lib/store/` is the single
seam to swap.

**This does not run on Vercel** (or any read-only filesystem). That is the cost of having no
database; it was the deliberate choice.

`data/` does not exist in a fresh clone. `/capstone` renders its empty state and `/login` tells
you to run `set-admin-password`.

## Auth

One admin. No registration, no user accounts, no OAuth — the Laravel app had all three on paper
but every one of them was unreachable, so none were ported.

- `lib/auth/password.ts` — scrypt via `node:crypto`, stored as `scrypt$<salt>$<hash>`.
  Deliberately **not** `server-only`: `scripts/set-admin-password.mjs` imports it.
- `lib/auth/session.ts` — HMAC-SHA256 signed cookie (`sws_admin`, 12 h) using **Web Crypto**,
  not `node:crypto`, because `proxy.ts` may run on the Edge runtime. Secret from
  `ADMIN_SESSION_SECRET`.
- `lib/auth/require-admin.ts` — `requireAdmin()`.

**`proxy.ts` is not the authorization boundary.** It is an optimistic redirect for people
clicking links. A Server Action is reachable by a direct POST that never passes a page route, so
**every action calls `requireAdmin()` first**. Do not remove those calls because "the proxy
already checks".

## Architecture

```
app/
  layout.tsx              html/body, next/font, all the SEO metadata, LocalBusiness JSON-LD
  page.tsx                landing page
  robots.ts sitemap.ts    file conventions — no plugin, no Blade template
  capstone/               public catalog + detail
  login/ logout/          sign in, sign out
  admin/
    layout.tsx            requireAdmin() + the Sidebar/Header shell
    */actions.ts          'use server' — the old controllers' mutating methods
  api/chatbot/            Gemini proxy
  api/clarity-analytics/  Microsoft Clarity proxy
components/
  ui/                     shadcn + Aceternity primitives — vendored third-party code
  landing/ capstone/ admin/ auth/
lib/
  store/                  the JSON data layer
  auth/                   password, session, guard
  routes.ts               every internal path (replaces Ziggy's route())
  forms.ts                form state shapes shared by actions and client forms
  flash.ts rate-limit.ts site.ts utils.ts types.ts
proxy.ts                  Next 16's name for middleware
```

### Pages are Server Components

A page reads the store and passes plain props to a client component. The interactive parts are
thin and separate: `components/capstone/catalog.tsx` holds the category filter,
`components/admin/capstones/capstone-form.tsx` holds the create/edit form. Do not move a store
call into a client component — `lib/store/` is `server-only` and will fail the build.

### Forms

`useActionState` + Server Actions, not `fetch`. An action returns
`{ errors, values }`; the error keys match the old Laravel validator's keys, which is why the
ported markup that reads `errors.slug` needed no changes.

Success travels as `?flash=<key>`, resolved by `lib/flash.ts`. That replaces Laravel's
`->with('success', …)` session flash — Server Actions have no session to flash into. Unknown keys
resolve to `null`, so query input is never echoed into the page.

`lib/forms.ts` exists because **a `'use server'` module may only export async functions.** Put a
shared type or constant in `lib/forms.ts`, never next to the action.

### Adding a capstone field

Touch these, in order: `lib/types.ts` → `lib/store/capstones.ts` (projections) →
`app/admin/capstones/actions.ts` (`readValues`, `validate`, both writes) →
`components/admin/capstones/capstone-form.tsx` → the public components if it is public.
`PublicCapstone` deliberately omits `price`, `download_url` and `download_file`; keep it that way.

### Revalidation

`/capstone` and `/sitemap.xml` are prerendered with a 1 h ISR window. The capstone actions call
`revalidateCatalog()`, which invalidates both plus the affected slugs. If you add a write path,
call it — otherwise a new project will not appear until the window lapses.

### Dark mode is off

Deliberately. The Laravel app stripped the `dark` class in JS on every load; here `globals.css`
pins `color-scheme: light` so there is no flash of the wrong theme before hydration. The `.dark`
tokens stay defined because many components still carry `dark:` variants — they never activate.

### `components/ui/` is vendored

shadcn and Aceternity code, pasted in rather than authored here. Several files carry
`react-hooks/exhaustive-deps` warnings that would need the animation logic restructured. Prefer
leaving them alone.

One rule does matter there: **never call `Math.random()` in a render body.** The server and the
client roll different numbers, which is a hydration mismatch, and React may re-render at any
time. Use `seededRandom(index)` from `lib/utils.ts` — several components were fixed this way
during the port.

## Deliberate differences from the Laravel app

- **`throttle:10,1` is not applied globally.** A 10/min per-IP cap on every route would break RSC
  navigation. Ported as: 3/min on `/api/chatbot` (matching `throttle:chatbot`), 5/min on the
  login action (matching `LoginRequest`), 10/min on the analytics proxy. See `lib/rate-limit.ts`.
- **`/admin/settings` has a new view.** `SettingsController`'s logic is ported unchanged, but its
  page component never existed — the route returned a 500 while the admin header linked to it.
- **`sitemap.ts` lists real URLs.** The Blade version emitted twelve hardcoded `/project/{id}`
  URLs pointing at a page component that did not exist, so all twelve served 500s to crawlers.
- **Dropped because it was unreachable:** Google OAuth and Socialite, the welcome email,
  registration, the user (non-admin) dashboard and the `user.*` routes, `/project/{id}`, and
  visitor tracking (`HomeController::index` never called its own `trackVisitor`).
- **URL validation is stricter.** `lib/store`-bound URL fields accept only `http:` and `https:`,
  so `javascript:` payloads are rejected where Laravel's `url` rule let other schemes through.
- **The download file is still write-only.** The admin form stores it and records the name, but
  no route serves it — true in Laravel too, once `DownloadController` went away with the orders
  feature. Sending the file to a client is a manual step.

## Known rough edges inherited from the source

- `components/landing/footer.tsx`, `github.tsx` and `sections/ProjectShowcase.tsx` have broken
  leftover ternaries inside `className` template strings, e.g.
  `` `'bg-gray-800 text-gray-300' : 'bg-white text-gray-600'} py-6` ``. They emit literal quotes
  as class names. Cosmetic, carried over verbatim, worth a cleanup pass.
- `components/ui/terminal.tsx` fetches `/sounds/sound.ogg`, which does not exist. Harmless —
  `terminal-section.tsx` passes `enableSound={false}`, so the fetch never runs.
- `components/admin/header.tsx` points `AvatarImage` at `/api/placeholder/32/32`, which 404s on
  every admin page load. The `AvatarFallback` initials render instead.

## Environment

`.env.local` for development, `.env.example` is the template.

| Variable | Required | Purpose |
|---|---|---|
| `ADMIN_SESSION_SECRET` | yes | signs the session cookie; without it nobody can log in |
| `NEXT_PUBLIC_SITE_URL` | yes in production | canonical URL, sitemap, Open Graph |
| `GEMINI_API_KEY` | for the chatbot | without it `/api/chatbot` returns a clear 503 |
| `CLARITY_API_TOKEN` | optional | only `/api/clarity-analytics` uses it |

Admin credentials live in `data/admin.json`, not in env.

## Deploying

Needs a writable filesystem and a single process — see [Data](#data).

Serve over HTTPS. `sessionCookieOptions()` sets `secure: true` when `NODE_ENV === 'production'`,
so over plain HTTP a browser refuses to store the session cookie and login appears to do nothing.
`localhost` is exempt (browsers treat it as a secure context).

`NEXT_PUBLIC_SITE_URL` is read at build time for canonical URLs, the sitemap and Open Graph — set
it before `npm run build`, not after.
