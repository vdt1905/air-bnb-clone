# Airbnb listing clone

A desktop React implementation of the Mirashya UG10 listing shown in the supplied screenshots, including the full listing, photo tour and single-photo lightbox. The application code is original; the property photography matches the pictured apartment.

## Run locally

Requires Node.js 20.19+ and npm. From the project root:

```bash
npm ci
npm run dev
```

Open `http://localhost:5173`. The optional Express API runs on port 5000. Vite selects another port if 5173 is occupied.

The client also works without the API. Before development and production builds, `client/scripts/sync-fallback.mjs` generates a browser data snapshot from the server model. Network or HTTP failures use that snapshot; structured API errors still display an error state. Runtime client code does not import server modules.

### Why package files are at the root

This is an npm workspace project. Root `package.json` defines shared commands and the `client` and `server` workspaces. Root `package-lock.json` locks dependencies for both. The two workspace `package.json` files define their own dependencies. All four files are required; install once at the root.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the client and API together |
| `npm run dev:client` | Run only the client |
| `npm run dev:server` | Run only the API |
| `npm run build` | Refresh fixture snapshot and build `client/dist` |
| `npm run preview` | Serve the production client at `http://127.0.0.1:5190` |
| `npm test` | Run 47 server tests |
| `npm run test:browser` | Run browser and automated accessibility checks against a built client |
| `npm run check` | Build, server tests, then browser tests |
| `npm run architecture` | Regenerate the editable SVG and standalone PNG diagram |
| `npm run package:submission` | Create `.dist/airbnb-clone-submission.zip` on Windows |

Browser tests and diagram rendering use an installed Google Chrome. If unavailable, install it with `npx playwright install chrome`. Browser tests start a separate production preview on port 5191. Build the client before running them directly.

## Implemented behaviour

- Five-image hero, 43 photographs across nine photo-tour categories, sticky room captions and a dark single-photo lightbox.
- Photo navigation by buttons and Left/Right keys; layered Escape, focus trapping, focus restoration, background inertness and scroll restoration.
- Gallery URLs survive refresh and respond to browser Back. Dates and guest counts are reflected in the URL.
- Header search panels, account menu, language/host details, share dialog and a shared session-only Save state.
- Sticky section navigation and booking card, selectable date range, unavailable days, guest controls, pricing and reservation feedback.
- Amenity and description dialogs, review search, map pan/zoom, host details and nearby-stay carousel.
- Hover, press, image-darkening, heart, carousel and overlay transitions, with reduced-motion support.

## Deliverables

- [Production architecture diagram (PNG)](docs/architecture/marketplace-architecture.png)
- [Editable architecture diagram (SVG)](docs/architecture/marketplace-architecture.svg)
- [Architecture decisions](docs/architecture/PRODUCTION_ARCHITECTURE.md)
- [AI workflow and prompt sequence](ai/AI_WORKFLOW.md)
- [Agent role configurations](ai/agents/)
- [Verification and reference limitations](docs/QA.md)
- [Photo and font provenance](client/public/images/CREDITS.md)

## Project structure

```text
client/       React, Vite, Tailwind, Zustand; local photos and font
server/       Express routes, validation, fixtures and tests
api/          Optional Vercel serverless entry point
tests/        Playwright browser scenarios and axe checks
docs/         Reference observations, QA evidence and architecture
ai/           Role configurations and prompt/workflow record
scripts/      Asset collection, architecture rendering and packaging
```

`GET /api/health` checks the API. `GET /api/listings/listing-001` returns the featured listing. `listing-002` is a secondary fixture retained for error/normalization coverage.

## Scope and reference

The supplied [Vercel reference](https://airbnb-clone-umber-two.vercel.app) returned a security checkpoint during this session. Layout and text were therefore matched against the user's screenshots; photographs were obtained from rendered images on the [same property's public Airbnb listing](https://www.airbnb.co.in/rooms/1599895892448055764). No deployed application bundles or source code were copied. Exact motion parity with the blocked reference could not be verified.

This is a listing-page demonstration. Reserve produces feedback; authentication, payments and marketplace search are not connected to production services. Six screenshot review excerpts are included, with the screenshot's aggregate count of 19. Some ancillary text, avatars and nearby-property imagery are fixture approximations. The architecture diagram is a proposed production system, not infrastructure deployed by this submission.

`vercel.json` provides optional hosting configuration for the client and API. Deployment was not performed. Keep the submission private; the source ZIP can be supplied directly without publishing a GitHub repository. Older milestone planning documents are retained for context; this README and `docs/QA.md` describe the current implementation.
