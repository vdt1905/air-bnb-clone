# Implementation Plan

Concrete, sequenced build plan for the desktop-only Airbnb listing clone.

**Inputs:** [REFERENCE_ANALYSIS.md](../reference/REFERENCE_ANALYSIS.md) ·
[INTERACTION_SPEC.md](../reference/INTERACTION_SPEC.md) ·
[ASSET_INVENTORY.md](../reference/ASSET_INVENTORY.md) ·
[TECHNICAL_ARCHITECTURE.md](./TECHNICAL_ARCHITECTURE.md)

---

## How to use this plan

### Principles

1. **Every milestone ships something testable.** No milestone ends with "wired up but not
   verifiable."
2. **Acceptance criteria are numeric wherever the reference gave a number.** "Looks right"
   is not a criterion; "1120 × 476.1 ± 1px at a 1440px viewport" is.
3. **Measured negatives are criteria too.** Not building a gallery hover effect is a pass
   condition, not an omission.
4. **`[N]` items are not invented.** Where the reference was never observed, the milestone
   says so and picks a documented default.

### Toolchain

| Purpose | Tool |
|---|---|
| Unit / component tests | **Vitest** + React Testing Library |
| DOM assertions | `@testing-library/jest-dom` |
| API tests | **Vitest** + Supertest |
| E2E, geometry, a11y | **Playwright** |
| Accessibility audit | `@axe-core/playwright` |
| Lint / format | ESLint + Prettier |

Playwright is the load-bearing choice: the reference numbers were *captured* with it, so the
same assertions that measured Airbnb can verify the clone. Geometry criteria below are
written to be checked with `getBoundingClientRect()` / `getComputedStyle()`.

### Definition of done (every milestone)

- [ ] Acceptance criteria met and demonstrated
- [ ] Tests written and passing
- [ ] No console errors or warnings
- [ ] Lint clean
- [ ] No `[N]` behaviour invented without a note in the milestone

### Dependency graph

```
M1 ──► M2 ──► M3 ──────────────► M4 ──┬──► M5  Header
                                      ├──► M6  Listing header ──► M7 Gallery ──┬─► M15 Tour ──► M16 Lightbox
                                      ├──► M8  Property info                   │
                                      ├──► M9  Booking card                    │
                                      ├──► M10 Amenities ────────┐             │
                                      ├──► M11 Description ──────┤             │
                                      ├──► M12 Host             │             │
                                      ├──► M13 Location         │             │
                                      └──► M14 Footer           │             │
                                                                ▼             ▼
                                                       M17 Accessibility ◄────┘
                                                                ▼
                                                       M18 Animations
                                                                ▼
                                                       M19 Visual QA
                                                                ▼
                                                       M20 Performance
                                                                ▼
                                                       M21 Final review
```

**M5–M14 are mutually independent** once M4 lands and can be built in any order or in
parallel. M15 → M16 is strictly sequential: the lightbox is only reachable from the tour.

---

# Phase A — Foundation

## M1 · Project setup

Establish the monorepo, tooling, and the directory names fixed in Phase 4.

### Files

| File | Action |
|---|---|
| `package.json` (root) | Create — npm workspaces `["client","server"]`, `dev`/`build`/`test`/`lint` scripts via `concurrently` |
| `frontend/` → `client/` | **Rename** |
| `backend/` → `server/` | **Rename** |
| `.gitignore` | `node_modules`, `dist`, `.env`, `coverage`, `playwright-report`, `test-results` |
| `.editorconfig`, `.prettierrc`, `eslint.config.js` | Create |
| `README.md` | Prerequisites, install, run, project map |
| `client/package.json`, `client/vite.config.js`, `client/index.html` | Create |
| `server/package.json`, `server/.env.example` | Create |

> The root `package.json` currently exists as a **0-byte placeholder**, which makes Node
> fail with `ERR_INVALID_PACKAGE_CONFIG` in this directory. Writing valid JSON is part of
> this milestone.

### Components
None.

### State
None.

### API
None.

### Dependencies
None — this is the root.

### Acceptance criteria

- [ ] `npm install` at root installs both workspaces
- [ ] `npm run dev` starts Vite (5173) and Express (5000) together
- [ ] `client/` and `server/` exist; `frontend/`, `backend/` are gone
- [ ] Root `package.json` is valid JSON; `node -e "1"` runs in the repo root
- [ ] Vite proxies `/api` → `http://localhost:5000`
- [ ] `npm run lint` passes on an empty codebase

### Testing

| Test | Assertion |
|---|---|
| Smoke | Both dev servers bind their ports |
| Proxy | `curl localhost:5173/api/health` reaches Express |
| CI | Lint + test scripts exit 0 |

---

## M2 · Backend foundation

Express app with the full middleware chain and layering, but no domain routes yet.

### Files

`server/src/app.js` · `server/src/server.js` · `server/src/config/env.js` ·
`server/src/config/cors.js` · `server/src/middleware/errorMiddleware.js` ·
`server/src/middleware/securityMiddleware.js` · `server/src/utils/ApiError.js` ·
`server/src/utils/asyncHandler.js` · `server/src/routes/index.js` ·
`server/src/routes/healthRoutes.js`

### Components
None.

### State
None.

### API

`GET /api/health` → `{ success: true, data: { status: 'ok', uptime } }`

### Dependencies
M1.

### Key constraints

- `app.js` exports the app **without** calling `listen()` — Supertest requires this
- `server.js` is the only file that binds a port
- `config/env.js` validates env at boot and **fails fast** on missing required vars
- CORS allows **one configured origin**, never `*`

### Acceptance criteria

- [ ] `GET /api/health` → 200 with the envelope
- [ ] Unknown route → **404** in the error envelope, not an HTML stack trace
- [ ] A thrown `ApiError` is serialised to `{ success:false, error:{ code, message, status } }`
- [ ] An unexpected error returns a **generic** message when `NODE_ENV=production`
- [ ] `helmet` headers present (`X-Content-Type-Options`, etc.)
- [ ] Rate limiter returns **429** past the threshold
- [ ] Payload > 10 kb rejected
- [ ] Missing required env var → process exits non-zero with a clear message

### Testing

| Type | Cases |
|---|---|
| Supertest | health 200; unknown route 404; error envelope shape; 429 after limit; oversized body rejected |
| Unit | `ApiError` sets status/code; `asyncHandler` forwards rejections to `next` |

---

## M3 · Listing API

The only product endpoint, through all four layers.

### Files

`server/src/data/listings.js` · `server/src/models/listingModel.js` ·
`server/src/services/listingService.js` · `server/src/controllers/listingController.js` ·
`server/src/routes/listingRoutes.js` · `server/src/middleware/validationMiddleware.js`

### Components
None.

### State
Static seed data.

### API

`GET /api/listings/:id` → the full payload in §5.4 of the architecture.

### Dependencies
M2.

### Data requirements

Seed one complete listing containing:

| Field | Requirement |
|---|---|
| `photos[]` | **34 entries**, each with `room`, `alt`, `width: 1440`, `height: 960` (3:2) |
| `roomGroups[]` | **9 groups** — Living room, Full kitchen, Dining area, Bedroom 1–2, Full bathroom 1–2, Exterior, Pool |
| `amenities[]` | ≥ 16, **including ≥ 2 with `available: false`** (strikethrough case) |
| `description` | Long enough to exceed **8 lines** at 653.3px — exercises the clamp |
| `rating` | `{ value, count, isNew }` — seed a second fixture with `isNew: true` |
| `availability.blockedDates[]` | ≥ 1 range, to exercise "not available" |
| `reviews[]` | ≥ 3 |

Two fixtures are required: a **rated** listing and a **new** listing, because the Overview
block renders `★ 4.84 · 76 reviews` vs `New · 1 review` differently.

### Acceptance criteria

- [ ] `GET /api/listings/<valid>` → 200, payload matches the documented shape
- [ ] `GET /api/listings/<unknown>` → **404** `LISTING_NOT_FOUND`
- [ ] `GET /api/listings/<malformed>` → **400** from validation, **before** any lookup
- [ ] Controller contains no data access; service contains no `req`/`res`
- [ ] `photos.length === 34`; every photo has a `room` matching a `roomGroups` entry
- [ ] Unavailable amenities are **present** in the payload, not filtered out
- [ ] No formatted strings — prices are numbers, dates are ISO

### Testing

| Type | Cases |
|---|---|
| Supertest | 200 shape; 404; 400 validation precedence; content-type JSON |
| Service unit | Called with a plain id, returns plain data, throws `ApiError` on miss |
| Model unit | Normalisation; unknown id returns null |
| Contract | Payload validated against a schema fixture so client and server cannot drift |

---

## M4 · Frontend foundation

Shell, routing, Tailwind tokens, store skeletons, API client. **No listing UI yet.**

### Files

`client/src/main.jsx` · `client/src/App.jsx` · `client/src/index.css` ·
`client/tailwind.config.js` · `client/src/pages/ListingPage.jsx` ·
`client/src/pages/NotFound.jsx` · `client/src/store/{listing,gallery,ui}Store.js` ·
`client/src/services/{apiClient,listingService}.js` · `client/src/hooks/useListing.js` ·
`client/src/constants/{layout,modals,images,api}.js` · `client/src/utils/cn.js` ·
`client/src/components/layout/PageContainer.jsx` ·
`client/src/components/common/{Skeleton,ErrorState}.jsx`

### Components
`PageContainer`, `Skeleton`, `ErrorState`.

### State
All three stores created with their documented shape (§3.4). Only `listingStore` is
exercised this milestone.

### API
Consumes `GET /api/listings/:id`.

### Dependencies
M1, M3.

### Tailwind tokens (must match measured values exactly)

| Token | Value |
|---|---|
| `ink` / `muted` / `subtle` / `disabled` | `#222222` / `#6C6C6C` / `#8C8C8C` / `#D1D1D1` |
| `line` / `surface` / `control` / `controlHover` | `#DDDDDD` / `#F7F7F7` / `#F2F2F2` / `#EBEBEB` |
| `maxWidth.content` | `1120px` |
| `width.main` / `width.aside` | `653.3px` / `372.3px` |
| `spacing.header` / `spacing.sticky` | `96px` / `80px` |
| `radius` card/map/modal/pill | `12px` / `20px` / `32px` / `999px` |
| `ease-airbnb` | `cubic-bezier(0.2, 0, 0, 1)` |

### Acceptance criteria

- [ ] `/listings/:id` renders; unknown path → `NotFound`
- [ ] Loading → skeleton; error → `ErrorState` with retry; success → data in `listingStore`
- [ ] `PageContainer` computes **1120px** wide, centered → `x = 152.3 ± 1` at a 1440 viewport
- [ ] Variable font loads; **no italic face requested** (asset inventory §7)
- [ ] `apiClient` normalises failures to one error shape; network failure does not white-screen
- [ ] Tokens resolve — a probe element using `bg-control` computes `rgb(242, 242, 242)`

### Testing

| Type | Cases |
|---|---|
| Component | Three render states; retry refetches |
| Store unit | `fetchListing` transitions idle→loading→success / →error; `reset` clears |
| Service unit | Mocked fetch: success, 404, network error |
| Playwright | `PageContainer` measures 1120 ± 1; centered |

---

# Phase B — Page sections

> **Shared acceptance criterion for M5–M14:** at a 1440 × 900 viewport, each section's
> bounding box matches the vertical rhythm table in Reference §1 within **±2px**.

## M5 · Header

### Files
`client/src/components/layout/Header.jsx` · `components/common/Logo.jsx` ·
`components/layout/SearchPill.jsx` · `components/layout/HeaderNav.jsx` ·
`components/layout/AccountMenu.jsx` · `assets/images/logo.svg`

### Components
`Header`, `Logo`, `SearchPill`, `HeaderNav`, `AccountMenu`.

### State
**Local `useState` only** — `SearchPill` expansion, `AccountMenu` open. Architecture §3.2
places these outside Zustand deliberately.

### API
None.

### Dependencies
M4.

### Acceptance criteria

- [ ] Header height **96px**; `1px solid #DDDDDD` bottom border
- [ ] **Not sticky** — scrolls away with the page (Reference §2)
- [ ] Logo **102 × 32** at `x = 48`, vertically centered; **original mark**, not Airbnb's
- [ ] Search pill **375 × 46**, `border-radius: 40px`, centered
- [ ] Pill hover → `0 0 0 1px rgba(0,0,0,.02), 0 8px 24px rgba(0,0,0,.10)` over **0.175s**
- [ ] Clicking the **pill container does nothing**; clicking a **segment** expands it
      (Interaction §1.2 — `[M‑neg]`)
- [ ] Expanded bar **850 × 66** at `y = 102`, `border-radius: 100px`
- [ ] Account menu **265 × 277**, `radius 12px`, `0 2px 16px rgba(0,0,0,.12)`
- [ ] `Escape` closes menu and collapses the pill; **neither locks scroll**

### Testing

| Type | Cases |
|---|---|
| Component | Segment click expands; container click does not; Escape collapses |
| Playwright | Header 96px; logo 102×32 at x=48; pill 375×46; `body` overflow stays `visible` while the menu is open |

---

## M6 · Listing header (title bar)

### Files
`components/listing/ListingTitleBar.jsx` · `components/listing/ShareButton.jsx` ·
`components/listing/SaveButton.jsx`

### Components
`ListingTitleBar`, `ShareButton`, `SaveButton`.

### State
Reads `listingStore.listing.title`. Modal opening deferred to M17/M18 wiring; buttons are
present and focusable now.

### API
None beyond M3.

### Dependencies
M4.

### Acceptance criteria

- [ ] `<h1>` — **26px / 30px, weight 500**, `#222222`, `margin: 0`
- [ ] Title row occupies `y = 96 → 150`, full 1120px
- [ ] `Share` and `Save` right-aligned, icon + **underlined** label
- [ ] **Rating is NOT rendered here** — Reference §3 proved it lives in Overview
- [ ] 24px gap between title row and gallery top

### Testing

| Type | Cases |
|---|---|
| Component | Renders title; **asserts no rating text in the title bar** |
| Playwright | h1 computes 26px/30px/500; row height 54 ± 2 |

---

## M7 · Photo gallery

The highest-value visual component.

### Files
`components/gallery/PhotoGrid.jsx` · `PhotoTile.jsx` · `ShowAllPhotosButton.jsx` ·
`hooks/useImageVariant.js` · `constants/images.js`

### Components
`PhotoGrid`, `PhotoTile`, `ShowAllPhotosButton`.

### State
Reads `listingStore.listing.photos`. Opening the tour is wired in M15; until then the button
and tiles are inert but focusable.

### API
None beyond M3.

### Dependencies
M4, M6.

### Acceptance criteria

- [ ] Grid **1120 × 476.1 ± 1** at `y = 174`
- [ ] Tiles: **560 / 272 / 272** wide; `560 + 8 + 272 + 8 + 272 = 1120`
- [ ] Gaps exactly **8px** both axes
- [ ] **12px radius on the wrapper with `overflow: hidden`**; every `<img>` computes
      `border-radius: 0` (Asset §2.2)
- [ ] `object-fit: cover`, `object-position: 50% 50%` on all five
- [ ] Exactly **5** of 34 photos rendered
- [ ] Each tile is a `<button>` with an accessible name
- [ ] Hero uses `im_w=1200`; the four secondary use `im_w=720`
- [ ] **No hover effect on tiles** — `transform`, `filter`, `opacity` identical on hover
      (Interaction §1.5 `[M‑neg]`)
- [ ] `Show all photos`: **140.3 × 32**, `#F2F2F2`, `radius 8px`, 12px/500, **24px inset**
      from bottom-right
- [ ] Button hover → `#EBEBEB`

### Testing

| Type | Cases |
|---|---|
| Component | Renders 5 tiles from a 34-photo fixture; each is a button |
| Playwright | All geometry above; **hover assertion that nothing changes**; computed radius 0 on img and 12px on wrapper |
| Visual | Screenshot baseline of the mosaic |

---

## M8 · Property information (Overview)

### Files
`components/listing/Overview.jsx` · `components/listing/HostStrip.jsx` ·
`components/listing/Highlights.jsx` · `components/common/Avatar.jsx` ·
`components/layout/TwoColumn.jsx`

### Components
`TwoColumn`, `Overview`, `HostStrip`, `Highlights`, `Avatar`.

### State
Reads listing.

### API
None beyond M3.

### Dependencies
M4.

### Acceptance criteria

- [ ] `TwoColumn` → left **653.3px**, gutter **93.4px**, right **372.3px**
- [ ] Overview heading 22px/26px/500, `letter-spacing: -0.44px`
- [ ] Capacity line 16px/20px, `·` separators, **no icons**
- [ ] **Rating renders here**: `★ 4.84 · 76 reviews`
- [ ] `isNew: true` fixture renders `New · 1 review` instead — both fixtures covered
- [ ] `HostStrip` avatar **40 × 40**, circular via wrapper; 1px `#DDDDDD` rule above
- [ ] Section padding `32px 0`

### Testing

| Type | Cases |
|---|---|
| Component | Rated vs new fixture render different rating lines |
| Playwright | Column widths ± 1; heading letter-spacing |

---

## M9 · Booking card

### Files
`components/booking/BookingCard.jsx` · `PriceBlock.jsx` · `DateRangeField.jsx` ·
`GuestField.jsx` · `GuestStepper.jsx` · `CtaButton.jsx` · `RareFindBanner.jsx` ·
`hooks/useBookingParams.js` · `utils/{formatCurrency,formatDate,dateRange}.js`

### Components
All of the above.

### State

| State | Home |
|---|---|
| Dates, guest counts | **URL** via `useBookingParams` |
| Date picker open | **Local `useState`** |
| Guest stepper open | **Local `useState`** |

### API
None beyond M3 — totals computed client-side (Architecture §9.5).

### Dependencies
M4, M8.

### Acceptance criteria

- [ ] `<aside>` **372.3px**, `1px solid #DDDDDD`, `radius 12px`,
      `0 6px 16px rgba(0,0,0,0.12)`, `padding: 24px`
- [ ] `position: sticky; top: 80px`; sticks through the left column, releases before Reviews
- [ ] No dates → `Add dates for prices` at 22px/500
- [ ] Dates set → total at **22px/500** + `₹X for N nights` at 16px/400
- [ ] Blocked range → `Those dates are not available` + `Change dates`
- [ ] Date cells **160.8 × 56** each, padding `26px 12px 10px`, uppercase micro-label
- [ ] Date picker opens as a **popover: 661 × 466, radius 16px,
      `0 6px 20px rgba(0,0,0,.20)` — and does NOT lock scroll**
- [ ] Guest stepper: circular buttons, `aria-label="Increase Adults"` etc., **disabled at
      minimum** with `#C1C1C1` border
- [ ] CTA **48px**, `radius 999px`,
      `linear-gradient(to right,#E61E4D,#E31C5F,#D70466)`, 16px/500 white
- [ ] CTA click **opens no modal** — scrolls to and focuses the check-in input
- [ ] `Escape` closes either popover and restores focus to its trigger
- [ ] `RareFindBanner` renders inline; it is **not** an overlay
- [ ] `Report this listing` sits outside the card border

### Testing

| Type | Cases |
|---|---|
| Unit | `dateRange` night count incl. DST edge; blocked-date detection; `formatCurrency` INR grouping |
| Component | Three price states; stepper min/max disabling; Escape restores focus |
| Playwright | **`body` overflow stays `visible` while the date picker is open** (regression guard); sticky offset 80px; card border/shadow/radius |

---

## M10 · Amenities

### Files
`components/listing/Amenities.jsx` · `AmenityItem.jsx` · `ShowAllAmenitiesButton.jsx` ·
`components/common/Icon.jsx`

### Components
`Amenities`, `AmenityItem`, `ShowAllAmenitiesButton`, `Icon`.

### State
`uiStore` for the modal (no URL change). Modal body lands in M15's `ModalShell`; this
milestone builds the inline section and the trigger.

### API
None beyond M3.

### Dependencies
M4, M8.

### Acceptance criteria

- [ ] **2-column grid**, column pitch **334.7px**, item width **265.5px**
- [ ] Row pitch **48px** (`padding-bottom: 24px`)
- [ ] Exactly **10 items** before the button
- [ ] Icons **24 × 24**, solid fill `#222222`, from the icon library
- [ ] Labels 16px/20px
- [ ] `available: false` → **strikethrough + greyed**, still rendered
- [ ] Button **205.8 × 48**, `#F2F2F2`, `radius 12px`, `padding 14px 24px`, 16px/500
- [ ] Button hover → `#EBEBEB`

### Testing

| Type | Cases |
|---|---|
| Component | 16-amenity fixture renders 10 + button labelled `Show all 16 amenities`; unavailable items get strikethrough |
| Playwright | Grid pitch; icon box 24px |

---

## M11 · Description

### Files
`components/listing/Description.jsx` · `ShowMoreButton.jsx`

### Components
`Description`, `ShowMoreButton`.

### State
Modal open in **URL** (`?modal=description`) — the reference deep-links it.

### API
None beyond M3.

### Dependencies
M4, M8.

### Acceptance criteria

- [ ] Body 16px/20px `#222222`, constrained to 653.3px
- [ ] Truncation: **`-webkit-line-clamp: 8`**, `display: flow-root`, `overflow: clip`
- [ ] Short description → **no** `Show more` button
- [ ] Long description → button, 16px/**weight 500**, `text-decoration: none` at rest
- [ ] `aria-label="Show more about this place"`
- [ ] Click pushes `?modal=description`
- [ ] Both fixtures (clamped / not clamped) covered

### Testing

| Type | Cases |
|---|---|
| Component | Button present only past the clamp; aria-label correct |
| Playwright | Computed `-webkit-line-clamp` is `8`; URL gains `modal=description` |

---

## M12 · Host section

### Files
`components/listing/HostSection.jsx` · `HostStatRow.jsx` · `HostDetails.jsx`

### Components
`HostSection`, `HostStatRow`, `HostDetails`.

### State
Reads listing.

### API
None beyond M3.

### Dependencies
M4.

### Acceptance criteria

- [ ] Full **1120px**, `padding: 40px 0`
- [ ] Avatar **88 × 88**, `border-radius: 50%`, `object-fit: cover`, `im_w=240`
- [ ] Host name **26px / 30px, weight 700** (the only 700 heading on the page)
- [ ] Stat rows separated by **96 × 1px `#DDDDDD`** rules
- [ ] Right column at `x = 611.3`, width 555.7 — bio + response rate/time
- [ ] `Message host` secondary button, `radius 12px`
- [ ] Payment-protection note in small secondary text
- [ ] `Message host` behaviour is **`[N]`** — render the button; wire no action, note it

### Testing

| Type | Cases |
|---|---|
| Component | Renders stats from fixture; avatar alt present |
| Playwright | Avatar 88px + 50% radius; host name weight 700 |

---

## M13 · Location

### Files
`components/listing/LocationSection.jsx` · `MapPanel.jsx` ·
`assets/images/map-static.webp`

### Components
`LocationSection`, `MapPanel`.

### State
Reads `listing.location`.

### API
None beyond M3.

### Dependencies
M4.

### Decision
**Static map image** (Architecture §9.7 / Asset §6). Pan/zoom was never exercised `[N]`, so
interactivity would be invented behaviour.

### Acceptance criteria

- [ ] Heading `Where you'll be`, 22px/26px/500
- [ ] Location text 16px beneath
- [ ] Map panel **1120 × 480**, **`border-radius: 20px`** (deliberately not 12px),
      `overflow: hidden`
- [ ] Marker rendered as **inline SVG**, not a raster
- [ ] Static image served as WebP with a fixed intrinsic size — **no layout shift**
- [ ] Decorative image correctly hidden from assistive tech; the address conveys the meaning

### Testing

| Type | Cases |
|---|---|
| Component | Renders city/region/country |
| Playwright | Panel 1120×480; radius 20px; CLS contribution 0 |

---

## M14 · Footer

### Files
`components/layout/Footer.jsx` · `FooterColumn.jsx` · `FooterBottomBar.jsx` ·
`components/listing/SeoLinks.jsx`

### Components
`Footer`, `FooterColumn`, `FooterBottomBar`, `SeoLinks`.

### State
None — static content.

### API
None.

### Dependencies
M4.

### Acceptance criteria

- [ ] Background **`#F7F7F7`**, full-bleed, 48px gutter
- [ ] **3 columns**, each **432.2px** at `x = 48 / 496.2 / 944.4`
- [ ] Links **14px / 18px**, `#222222`, `text-decoration: none`
- [ ] Link hover → **underline**, colour unchanged
- [ ] Links are real `<a href>`, `target` unset (same-tab)
- [ ] Bottom bar: copyright + `Privacy` · `Terms` left; locale/currency right
- [ ] `SeoLinks` block above the footer, heading 22px/26px/500

### Testing

| Type | Cases |
|---|---|
| Component | Column and link counts; hover class applied |
| Playwright | Column x-positions; computed hover `text-decoration-line: underline` |

---

# Phase C — Overlays

## M15 · Photo Tour

Introduces `ModalShell` — the abstraction all six overlays depend on.

### Files
`components/modal/ModalShell.jsx` · `ModalRoot.jsx` · `ModalHeader.jsx` ·
`components/gallery/PhotoTour.jsx` · `CategoryStrip.jsx` · `RoomSection.jsx` ·
`hooks/{useModalStack,useScrollLock,useFocusTrap,useFocusRestore}.js` ·
`utils/groupPhotos.js` · `store/uiStore.js` (complete)

### Components
`ModalRoot`, `ModalShell`, `PhotoTour`, `CategoryStrip`, `RoomSection`.

### State
`uiStore.modalStack`, `lockCount`, `focusReturnStack`. Open state mirrored to URL
`?modal=photos`.

### API
None beyond M3.

### Dependencies
M7, M10, M11 (they consume `ModalShell`).

### Acceptance criteria

- [ ] Tile click **and** `Show all photos` produce an **identical** state — same dialog,
      same URL, same focus target
- [ ] URL gains `?modal=photos`
- [ ] `role="dialog"`, `aria-modal="true"`, full viewport, **white** background, radius 0
- [ ] `body { overflow: hidden; position: fixed }`; page pinned
- [ ] Focus moves to **`Close`** on open
- [ ] `Tab` cycles **only** inside the dialog and **wraps**
- [ ] Category strip: **146.3 × 96.2** thumbs, **16px gaps**, **7 per row**
- [ ] Thumbnails are labelled `Scroll to <Room>` and **scroll** — they do **not** open the
      lightbox
- [ ] Body scrolls internally; page beneath does not move
- [ ] Photos grouped into the **9 room sections**; large photos `object-fit: cover`
- [ ] `Escape` closes, clears `?modal`, unlocks body, **restores focus to
      `Show all photos`**
- [ ] Scroll offset restored **exactly** (reference restored 1501 → 1501)

### Testing

| Type | Cases |
|---|---|
| Unit | `groupPhotos` produces 9 groups in source order; `useScrollLock` reference counting |
| Component | Focus trap wrap; Escape closes; focus restoration |
| Playwright | **Tile click and button click produce identical URL + focus**; lock/restore of exact `scrollY`; strip geometry |
| a11y | axe scan with the tour open |

---

## M16 · Lightbox

### Files
`components/gallery/Lightbox.jsx` · `PhotoCounter.jsx` · `LightboxNav.jsx` ·
`hooks/useKeyboardNav.js` · `store/galleryStore.js` (complete)

### Components
`Lightbox`, `PhotoCounter`, `LightboxNav`.

### State
`galleryStore.activeIndex` / `direction`; `uiStore.modalStack` gains `'lightbox'`; URL gains
`&photo=<id>`.

### API
None beyond M3.

### Dependencies
**M15** — reachable only from the tour.

### Acceptance criteria

- [ ] Opens **only** from a large photo inside the tour
- [ ] URL appends `&photo=<id>`
- [ ] **Stacks** — the tour stays mounted; stack depth 2
- [ ] Background **`#000`** opaque, full viewport
- [ ] Image `im_w=1440`, **`object-fit: contain`**, insets **96px** L/R and **112px** T/B
- [ ] Counter `1 / 34` top-centre **plus** an `aria-live="polite"` region announcing
      `Showing photo 1 of 34`
- [ ] `ArrowRight` / `ArrowLeft` change photo, counter, **and URL**
- [ ] Index **clamps** at both ends — no wraparound
- [ ] **`Previous` is absent at index 0**, present from index 1
- [ ] `Close` top-left at `40, 40`, icon **+ "Close" label**, `radius 8px`
- [ ] Prev/Next circular, vertically centered at `y ≈ 442.6`
- [ ] **First `Escape`** → returns to tour, drops `&photo`, **body stays locked**, focus
      returns to the tour control
- [ ] **Second `Escape`** → closes tour, unlocks body, focus → `Show all photos`
- [ ] `Tab` trapped and wrapping within the lightbox

### Testing

| Type | Cases |
|---|---|
| Unit | `galleryStore` next/prev clamping at 0 and 33 |
| Component | Prev hidden at index 0; counter text; aria-live content |
| Playwright | **Two-stage Escape asserted as a sequence** — stack 3→2→0, `body` locked between presses, focus at each level; arrow nav updates URL; image `contain` + insets |
| a11y | axe scan with the lightbox open; contrast of white-on-black controls |

---

# Phase D — Quality

## M17 · Accessibility

### Files
`components/common/VisuallyHidden.jsx` · `SkipLink.jsx` · audit fixes across components ·
`client/e2e/a11y.spec.js`

### Components
`SkipLink`, `VisuallyHidden`; refinements elsewhere.

### State
None new.

### API
None.

### Dependencies
M5–M16.

### Acceptance criteria

- [ ] Skip-to-content link, visible on focus
- [ ] One `<h1>`; heading levels never skip
- [ ] All six modals: `role="dialog"`, `aria-modal="true"`, accessible name
- [ ] Every interactive element reachable and operable by keyboard
- [ ] Visible focus indicator everywhere — **never** `outline: none` without a replacement
- [ ] All images have `alt`; decorative ones `alt=""` and `aria-hidden`
- [ ] Icon-only buttons have `aria-label`
- [ ] axe: **zero critical or serious violations** on the page and with each modal open
- [ ] **Contrast audit against measured colours:**

| Pair | Ratio | Verdict |
|---|---|---|
| `#222222` on `#FFFFFF` | ~15.9:1 | Passes AAA |
| `#6C6C6C` on `#FFFFFF` | **~5.25:1** | Passes AA, **fails AAA** |
| `#8C8C8C` on `#FFFFFF` | **~3.36:1** | **Fails AA for body text** — restrict to large text / non-text UI, or darken |
| `#D1D1D1` disabled | ~1.53:1 | Exempt (disabled) |

- [ ] `#8C8C8C` usage reviewed and either confined to ≥18.66px text or darkened —
      **document whichever is chosen**
- [ ] `prefers-reduced-motion` honoured (pairs with M18)

### Testing

| Type | Cases |
|---|---|
| Playwright + axe | Page; each modal open; keyboard-only traversal |
| Manual | Screen-reader pass over gallery → tour → lightbox |
| Unit | Contrast assertions on the token palette |

---

## M18 · Animations

### Files
`client/src/index.css` (motion layer) · `tailwind.config.js` · `ModalShell` transitions

### Components
Cross-cutting.

### State
None.

### API
None.

### Dependencies
M5–M16.

### Acceptance criteria

- [ ] **One curve** — `cubic-bezier(0.2, 0, 0, 1)` — for every transition
- [ ] No transition exceeds **300ms**
- [ ] Secondary buttons: `background-color` 0.3s, `#F2F2F2 → #EBEBEB`
- [ ] Search pill: `box-shadow` **0.175s**
- [ ] Icon buttons: `transform` 0.25s
- [ ] Footer links: underline on hover, colour unchanged
- [ ] **No gallery tile hover animation** — verified absent
- [ ] Modal enter/exit is **`[N]`** — implement a ≤200ms opacity fade and **record the
      choice in this document's changelog** as a deliberate default, not an observation
- [ ] Lightbox photo change is **`[N]`** — default to an instant swap (lower risk than an
      invented cross-fade)
- [ ] `prefers-reduced-motion: reduce` disables all non-essential motion

### Testing

| Type | Cases |
|---|---|
| Playwright | Computed `transition-timing-function` on sampled elements; no duration > 300ms |
| Component | Reduced-motion media query removes transitions |
| Visual | Hover-state screenshots for the button set |

---

## M19 · Visual QA

### Files
`client/e2e/visual.spec.js` · `client/e2e/geometry.spec.js` · baseline snapshots

### Components
None new.

### State
None.

### API
None.

### Dependencies
M5–M18.

### Method
Reuse the Phase 1 measurement approach: drive the clone at **1440 × 900, DPR 1** and assert
`getBoundingClientRect()` / `getComputedStyle()` against the reference tables.

### Acceptance criteria — the ten Critical Visual Anchors

| # | Anchor | Tolerance |
|---|---|---|
| 1 | Gallery 1120 × 476.1, `560+8+272+8+272`, wrapper radius 12 | ±1px |
| 2 | Columns 653.3 / 93.4 / 372.3; content `x = 152.3` | ±1px |
| 3 | Booking card 372.3, border `#DDDDDD`, radius 12, shadow, padding 24, sticky 80 | exact |
| 4 | CTA 48px, radius 999, exact gradient stops | exact |
| 5 | h1 26/30/500; h2 22/26/500 `-0.44px`; body 16/20 | exact |
| 6 | Header 96px; logo 102×32 @ x=48; pill 375×46 r40 | ±1px |
| 7 | Show-all-photos 140.3×32, `#F2F2F2`, r8, 24px inset | ±1px |
| 8 | `#222222` / `#6C6C6C` used as measured | exact |
| 9 | Map 1120×480, radius **20px** | exact |
| 10 | Amenities pitch 334.7 / 48, icons 24px, 10 items | ±1px |

- [ ] All ten pass
- [ ] Full-page screenshot baseline committed
- [ ] Per-section baselines for gallery, booking card, tour, lightbox
- [ ] Differences that are **deliberate** (icon set, logo, font substitute, static map) are
      listed as known, accepted deltas — not silently tolerated

### Testing

| Type | Cases |
|---|---|
| Playwright geometry | One assertion per anchor |
| Playwright visual | `toHaveScreenshot` with a small threshold |
| Review | Side-by-side against Phase 1 screenshots |

---

## M20 · Performance

### Files
`vite.config.js` (build/chunks) · image pipeline · `client/e2e/perf.spec.js`

### Components
Refinements only.

### State
None.

### API
None.

### Dependencies
M19.

### Acceptance criteria

- [ ] Hero image is the **LCP element**, eagerly loaded and `fetchpriority="high"`
- [ ] Photo variants generated at **120 / 240 / 480 / 720 / 1200 / 1440**
- [ ] **AVIF + WebP** with a JPEG fallback
- [ ] Gallery (5 images) eager; **tour photos lazy**
- [ ] All images have intrinsic `width`/`height` → **CLS ≈ 0**
- [ ] Font: one variable woff2, `preload`ed, `font-display: swap`, **no italic**
- [ ] Icons tree-shaken — only used glyphs ship; **no 48.9 KB inline-SVG duplication**
- [ ] Lighthouse (desktop): **Performance ≥ 90, Accessibility ≥ 95**
- [ ] Above-the-fold image payload in the region of the measured **~70 KB** (5 × ~13.6 KB)

### Testing

| Type | Cases |
|---|---|
| Lighthouse CI | Budgets enforced |
| Playwright | CLS ≈ 0; LCP element is the hero |
| Bundle analysis | No unexpected large dependency |

---

## M21 · Final review

### Files
`README.md` · `docs/` updates · changelog of deliberate deviations

### Dependencies
M1–M20.

### Acceptance criteria

- [ ] All ten **Critical Behaviours** (Interaction spec) verified end-to-end:

| # | Behaviour |
|---|---|
| 1 | Gallery → Photo Tour, URL pushed |
| 2 | Tour → Lightbox, stacked, `&photo` appended |
| 3 | **Two-stage Escape** with focus restoration at each level |
| 4 | Arrow navigation updates counter + URL |
| 5 | Scroll lock + **exact** offset restoration |
| 6 | Focus moves in, is trapped, and is restored |
| 7 | Sticky booking card at `top: 80px` |
| 8 | `Previous` hidden on the first photo |
| 9 | Amenities progressive disclosure → 780px / radius 32 modal |
| 10 | Hover vocabulary across buttons, links, pill |

- [ ] All ten **Critical Visual Anchors** pass (M19)
- [ ] Every `[N]` item either resolved or documented as a deliberate default
- [ ] Every `[M‑neg]` honoured — **no gallery tile hover; no scroll lock on popovers**
- [ ] README documents setup, scripts, architecture, and known deviations
- [ ] Full suite green; lint clean; no console output
- [ ] Original assets throughout — own logo, licensed icons, own photography

### Testing

| Type | Cases |
|---|---|
| Full suite | Unit + component + API + E2E + a11y + visual |
| Manual | Keyboard-only run-through of the ten behaviours |
| Fresh clone | `git clone && npm install && npm run dev` works unaided |

---

## Risk register

| Risk | Milestone | Mitigation |
|---|---|---|
| `ModalShell` is a central failure point | M15 | Build it first, test it hardest; M16 is its real proof |
| URL ↔ store desync leaves a stuck modal | M15, M16 | One-directional sync (Arch §3.5); E2E on Back/Forward |
| Popover accidentally locks scroll | M9 | Explicit regression assertion on `body` overflow |
| Fractional widths (653.3px) drift across browsers | M8, M19 | ±1px tolerance; assert the 1120 sum, not only the parts |
| Substituted font shifts the type scale | M4, M19 | Lock line-heights explicitly; never rely on normal |
| Icon set does not match visually | M10, M19 | Accepted, documented delta |
| `[N]` gaps invite invention | M18 | Defaults recorded in the changelog as choices |

## Suggested sequencing

| Block | Milestones | Rationale |
|---|---|---|
| 1 | M1 → M2 → M3 | Backend complete and testable before any UI |
| 2 | M4 | Foundation gate |
| 3 | M5–M14 | Independent; parallelisable |
| 4 | M15 → M16 | Strictly sequential |
| 5 | M17 → M18 | Cross-cutting, after all surfaces exist |
| 6 | M19 → M20 → M21 | Verification last |
