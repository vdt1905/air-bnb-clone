# Airbnb Listing Clone

An **original**, desktop-only implementation of an Airbnb listing page (PDP), built from a
measured analysis of the live reference. No reference source code was read or reproduced.

Current state: **Milestone 1 complete** — project scaffold, backend foundation and frontend
foundation. **No listing UI is implemented yet.**

## Requirements

- Node.js **>= 20.19** (developed on 22.12)
- npm 10+

## Install

```bash
npm install
```

One install at the root covers both workspaces.

## Run

Both halves run **independently**.

### Everything at once

```bash
npm run dev
```

Starts the Express server on **:5000** and Vite on **:5173**.

### Frontend only

```bash
npm run dev --workspace client     # from the repo root
# or
cd client && npm run dev
```

→ http://localhost:5173

`/api` is proxied to `http://localhost:5000`, so the browser sees a single origin in
development.

**The client works without the server.** If the API cannot be reached — server not started,
or the build is served as plain static files — the page renders from a bundled copy of the
listing data at `client/src/data/listings.fallback.json`. That file is generated from the
server's own model by `client/scripts/sync-fallback.mjs`, which runs automatically before
`dev` and `build` (or on demand with `npm run sync:fallback --workspace client`). Do not edit
it by hand. When the server IS running, the API is the source of truth and its errors
(e.g. an unknown listing id) are shown as usual.

### Backend only

```bash
cp server/.env.example server/.env   # first run only
npm run dev --workspace server       # from the repo root
# or
cd server && npm run dev
```

→ http://localhost:5000

```bash
curl http://localhost:5000/api/health
```

### Other scripts

| Command | Does |
|---|---|
| `npm run build` | Production build of the client |
| `npm start` | Runs the server without watch mode |
| `npm test` | Runs workspace tests (none yet — M2 onward) |

## Deploy to Vercel

Both halves deploy as **one Vercel project**: the client as static files, the Express app as a
serverless function. No environment variables are required.

1. Push the repo to GitHub and import it at https://vercel.com/new.
2. Leave the settings as detected — `vercel.json` at the root already sets:
   - install `npm install`, build `npm run build`, output `client/dist`
   - `api/index.js` → the Express app, with every `/api/*` request rewritten to it
   - every other path → `index.html` (client-side routing), static files first
3. Deploy. `https://<project>.vercel.app/listings/listing-001` serves the page and
   `https://<project>.vercel.app/api/health` the API, same origin.

How it fits together:

- `api/index.js` re-exports `server/src/app.js` (which never calls `listen()`); Express still
  sees the original `/api/...` path, so no routes change.
- `server/src/config/env.js` detects `VERCEL=1` and derives what production otherwise demands:
  `CLIENT_ORIGIN` from the deployment domain, `TRUST_PROXY=1` (Vercel is a real proxy, and the
  rate limiter keys on the forwarded IP) and a placeholder `PORT`. Values set in the dashboard win.
- The client calls `/api` relative to its own origin, so no `VITE_API_BASE_URL` is needed. If the
  function were ever unreachable the bundled fallback data still renders the page.
- Long-lived cache headers are set for hashed `/assets` and for `/images`, `/fonts`.

Deploying the client elsewhere (Netlify, GitHub Pages…) also works: build with `npm run build`,
serve `client/dist` with an SPA fallback, and either set `VITE_API_BASE_URL` to a hosted API or
rely on the bundled data.

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Liveness |
| `GET` | `/api/listings/:id` | Full listing payload |

Responses use one envelope:

```jsonc
{ "success": true,  "data": { } }
{ "success": false, "error": { "code": "…", "message": "…", "status": 404 } }
```

> **Seed data is intentionally empty** until Milestone 3, so `/api/listings/:id` currently
> returns `404 LISTING_NOT_FOUND` and the client renders its error state. That is the
> expected behaviour at this milestone, not a fault.

## Project structure

```
client/   React + Vite + Zustand + Tailwind
server/   Express — routes → controllers → services → models
docs/     Reference analysis + architecture
ai/       Agent definitions and phase prompts
```

Architecture: [docs/architecture/TECHNICAL_ARCHITECTURE.md](docs/architecture/TECHNICAL_ARCHITECTURE.md)
Build plan: [docs/architecture/IMPLEMENTATION_PLAN.md](docs/architecture/IMPLEMENTATION_PLAN.md)

**Separation rule:** `client/` never imports from `server/` and vice versa. The only contract
between them is the JSON response shape.

## Design tokens

Every token in `client/src/index.css` is a **measured** value, not an estimate:

| Token | Value | Source |
|---|---|---|
| `--color-ink` | `#222222` | Primary text, 309 nodes |
| `--color-muted` | `#6C6C6C` | Secondary text, 113 nodes |
| `--color-line` | `#DDDDDD` | Borders and rules |
| `--container-content` | `1120px` | Content column |
| `--ease-airbnb` | `cubic-bezier(0.2, 0, 0, 1)` | The one curve used sitewide |

## Deviations from the architecture doc

| Deviation | Reason |
|---|---|
| **Tailwind v4 `@theme` in `index.css`** instead of `tailwind.config.js` | v4 is CSS-first. It also drops two dependencies (`postcss`, `autoprefixer`). The token *values* are unchanged. |
| `react-router-dom` added | Not named in the doc, but the architecture puts modal state, photo id, dates and guests in the URL — that requires a router. |

## Accessibility note

The reference's own palette has a defect worth knowing about before it is copied further:

| Pair | Ratio | Verdict |
|---|---|---|
| `#222222` on white | ~15.9:1 | Passes AAA |
| `#6C6C6C` on white | ~5.25:1 | Passes AA, fails AAA |
| **`#8C8C8C` on white** | **~3.36:1** | **Fails AA for body text** |

`--color-subtle` (`#8C8C8C`) is therefore restricted to large text and non-text UI. Resolved
in Milestone 17.

## Licensing

Photography, the logo and icons must be **your own or appropriately licensed**. The reference
analysis documents dimensions and behaviour only.
