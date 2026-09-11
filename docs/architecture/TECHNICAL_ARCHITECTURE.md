# Technical Architecture

Original, desktop-only implementation of an Airbnb listing page (PDP).

**Grounded in:** [REFERENCE_ANALYSIS.md](../reference/REFERENCE_ANALYSIS.md) (visual),
[INTERACTION_SPEC.md](../reference/INTERACTION_SPEC.md) (behaviour),
[ASSET_INVENTORY.md](../reference/ASSET_INVENTORY.md) (assets).

Every architectural decision below traces to a measured observation. Where a decision is a
judgement call rather than a consequence of the reference, it is marked **[decision]** and
justified in §9.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + JavaScript, Zustand, Tailwind CSS |
| Backend | Node.js + Express |
| Pattern | Routes → Controllers → Services → Models |
| Data | Static JSON module (no database) |
| Scope | **Desktop only** — 1440px reference width |

> **Migration note.** The initial scaffold used `frontend/` and `backend/`. This phase
> specifies `client/` and `server/`; the structure below is authoritative. Rename
> `frontend/ → client/` and `backend/ → server/` before implementation.

---

## 1. Directory structure

```
airbnb-clone/
│
├── client/                                 # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   │   ├── fonts/                      # 1 variable woff2, weight axis, no italic
│   │   │   └── images/                     # logo.svg, avatar-fallback, map-static.webp
│   │   │
│   │   ├── components/
│   │   │   ├── common/                     # Button, IconButton, Divider, Avatar,
│   │   │   │                               # Icon, VisuallyHidden, Skeleton
│   │   │   ├── layout/                     # Header, Footer, PageContainer, TwoColumn
│   │   │   ├── listing/                    # TitleBar, Overview, HostStrip, Highlights,
│   │   │   │                               # Description, SleepingArrangement, Amenities,
│   │   │   │                               # Reviews, LocationMap, HostSection, ThingsToKnow
│   │   │   ├── gallery/                    # PhotoGrid, PhotoTile, ShowAllPhotosButton,
│   │   │   │                               # PhotoTour, Lightbox, CategoryStrip
│   │   │   ├── booking/                    # BookingCard, PriceBlock, DateRangeField,
│   │   │   │                               # GuestField, GuestStepper, CtaButton
│   │   │   └── modal/                      # ModalShell, ModalHeader, modal primitives
│   │   │
│   │   ├── pages/
│   │   │   ├── ListingPage.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── store/
│   │   │   ├── listingStore.js             # server data
│   │   │   ├── galleryStore.js             # photo tour + lightbox
│   │   │   └── uiStore.js                  # modal stack, scroll lock, focus returns
│   │   │
│   │   ├── hooks/
│   │   │   ├── useListing.js
│   │   │   ├── useModalStack.js
│   │   │   ├── useScrollLock.js            # reference-counted
│   │   │   ├── useFocusTrap.js
│   │   │   ├── useFocusRestore.js
│   │   │   ├── useKeyboardNav.js           # ArrowLeft / ArrowRight / Escape
│   │   │   ├── useBookingParams.js         # URL-backed dates + guests
│   │   │   └── useImageVariant.js          # im_w ladder selection
│   │   │
│   │   ├── services/
│   │   │   ├── apiClient.js                # fetch wrapper, error normalization
│   │   │   └── listingService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── formatCurrency.js
│   │   │   ├── formatDate.js
│   │   │   ├── dateRange.js                # nights between, availability check
│   │   │   ├── groupPhotos.js              # photos → room groups
│   │   │   └── cn.js                       # class merge
│   │   │
│   │   ├── constants/
│   │   │   ├── layout.js                   # 1120 / 653.3 / 372.3 / 96 / 80
│   │   │   ├── modals.js                   # modal ids ↔ URL values
│   │   │   ├── images.js                   # [120,240,480,720,1200,1440]
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css                       # Tailwind layers + font-face
│   │
│   ├── public/
│   ├── index.html
│   ├── tailwind.config.js                  # measured tokens
│   ├── vite.config.js                      # /api proxy → server
│   └── package.json
│
├── server/                                 # Express backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── env.js                      # validated env, fail-fast
│   │   │   └── cors.js
│   │   ├── routes/
│   │   │   ├── index.js                    # router composition
│   │   │   ├── listingRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── controllers/
│   │   │   └── listingController.js        # HTTP only
│   │   ├── services/
│   │   │   └── listingService.js           # business logic
│   │   ├── models/
│   │   │   └── listingModel.js             # data access + shape
│   │   ├── middleware/
│   │   │   ├── validationMiddleware.js
│   │   │   ├── errorMiddleware.js          # notFound + errorHandler
│   │   │   └── securityMiddleware.js       # helmet, rate limit, payload caps
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   └── asyncHandler.js
│   │   ├── data/
│   │   │   └── listings.js                 # static seed data
│   │   ├── app.js                          # express app (testable, no listen)
│   │   └── server.js                       # bootstrap + listen
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── architecture/
│   │   └── TECHNICAL_ARCHITECTURE.md
│   └── reference/
│       ├── REFERENCE_ANALYSIS.md
│       ├── INTERACTION_SPEC.md
│       └── ASSET_INVENTORY.md
│
├── ai/
│   ├── agents/
│   ├── prompts/
│   └── AI_WORKFLOW.md
│
├── package.json                            # workspaces + orchestration scripts
└── README.md
```

**Separation rule:** `client/` never imports from `server/` and vice versa. The only contract
between them is the JSON response shape in §5.

---

## 2. Component hierarchy

```
App
└── ListingPage                              ← route /listings/:id
    │
    ├── Header                                 96px, static (not sticky)
    │   ├── Logo                               102×32 SVG
    │   ├── SearchPill                         375×46, r-40px — segments expand
    │   └── HeaderNav
    │       ├── BecomeHostLink
    │       ├── GlobeButton
    │       └── AccountMenu                    dropdown 265×277, r-12
    │
    ├── PageContainer                          max-w-1120, centered
    │   │
    │   ├── ListingTitleBar                    h1 26/30 w500
    │   │   ├── ShareButton                    → ShareModal
    │   │   └── SaveButton                     → LoginModal (logged out)
    │   │
    │   ├── PhotoGrid                          1120×476.1, gap-8, r-12 wrapper
    │   │   ├── PhotoTile × 5                  <button>, cover, 50% 50%
    │   │   └── ShowAllPhotosButton            140×32, r-8, inset-24 bottom-right
    │   │
    │   ├── TwoColumn                          653.3 / 93.4 / 372.3
    │   │   ├── ListingMain (left)
    │   │   │   ├── Overview                   type · capacity · rating
    │   │   │   ├── HostStrip                  40px avatar
    │   │   │   ├── Highlights
    │   │   │   ├── Description                clamp-8 → ShowMoreButton
    │   │   │   ├── SleepingArrangement        cards, r-8 images
    │   │   │   ├── Amenities                  2-col, 10 items → ShowAllButton
    │   │   │   └── AvailabilityCalendar       inline, 2 months
    │   │   │
    │   │   └── BookingAside (right)           sticky top-80
    │   │       ├── RareFindBanner             present on load, not a modal
    │   │       ├── BookingCard                r-12, border, shadow, p-24
    │   │       │   ├── PriceBlock             22px w500
    │   │       │   ├── DateRangeField         2 cells 160.8×56 → DatePickerPopover
    │   │       │   ├── GuestField             → GuestStepperPopover
    │   │       │   └── CtaButton              48px pill, gradient
    │   │       └── ReportListingLink
    │   │
    │   ├── ReviewsSection                     full 1120
    │   ├── LocationSection → MapPanel         1120×480, r-20
    │   ├── HostSection                        88px avatar, stat rows
    │   ├── ThingsToKnow
    │   └── SeoLinks
    │
    ├── Footer                                 bg-#F7F7F7, 3 columns
    │
    └── ModalRoot                              ← React portal, outside PageContainer
        ├── PhotoTour        (ModalShell)      full-viewport white
        │   ├── CategoryStrip                  146×96 thumbs, gap-16, 7/row
        │   └── RoomSection × n
        ├── Lightbox         (ModalShell)      full-viewport black, contain
        │   ├── PhotoCounter                   "1 / 34" + aria-live
        │   └── PrevButton / NextButton        Prev hidden on index 0
        ├── AmenitiesModal   (ModalShell)      780×820, r-32
        ├── DescriptionModal (ModalShell)      780×438, r-32
        ├── ShareModal       (ModalShell)      568×544, r-32
        └── LoginModal       (ModalShell)      480×488, r-32
```

### 2.1 `ModalShell` — the critical abstraction

§0 of the interaction spec proved that **every modal shares one contract**. That contract is
implemented **once**, in `ModalShell`, and nowhere else:

| Responsibility | Source |
|---|---|
| Reference-counted scroll lock | `useScrollLock` |
| Focus trap with wrap | `useFocusTrap` |
| Focus restoration to trigger | `useFocusRestore` |
| `Escape` → pop **one** stack level | `useModalStack` |
| `role="dialog"` + `aria-modal="true"` | `ModalShell` |
| Portal into `#modal-root` | `ModalShell` |

Six modals, one implementation. Individual modals supply only content, dimensions, and
radius. **Popovers deliberately do not use `ModalShell`** — they must not lock scroll (§3.3).

---

## 3. State architecture

The prompt's constraint — *"avoid putting every local UI state variable into Zustand"* — is
the main design pressure here. The answer is an explicit three-way split.

### 3.1 The placement rule

State goes in **Zustand** only if **both** hold:

1. It is read or written by components in **different subtrees** (e.g. `PhotoGrid` writes,
   `Lightbox` reads — they are portal siblings, not parent/child), **and**
2. It must **survive unmount** of the component that set it.

State goes in the **URL** if it is **deep-linkable** — the reference proves which state this
is, because it puts exactly that state in the URL itself.

Everything else is **`useState`**, colocated.

### 3.2 Classification

| State | Home | Why |
|---|---|---|
| Listing data, load status, error | **Zustand** `listingStore` | Read by ~12 components across the tree |
| Photo tour open | **URL** `?modal=photos` | Reference deep-links it **[M]** |
| Active photo | **URL** `&photo=<id>` | Reference uses `&modalItem=<id>` **[M]** |
| Description modal open | **URL** `?modal=description` | Reference uses `?modal=DESCRIPTION` **[M]** |
| Amenities modal open | **Zustand** `uiStore` | Reference does **not** change the URL **[M]** |
| Share / Login modal open | **Zustand** `uiStore` | No URL change **[M]** |
| Modal stack order + depth | **Zustand** `uiStore` | Drives two-stage Escape; not serializable |
| Scroll-lock count | **Zustand** `uiStore` | Must be reference-counted across stacked modals |
| Focus-return elements | **Zustand** `uiStore` (non-persisted) | DOM refs — cannot live in a URL |
| Navigation direction, preload set | **Zustand** `galleryStore` | Derived, shared by tour + lightbox |
| Check-in / check-out dates | **URL** `?check_in=&check_out=` | Reference uses exactly these **[M]** |
| Guest counts | **URL** `?adults=&children=&infants=` | Reference uses exactly these **[M]** |
| **Date picker open** | **`useState`** in `DateRangeField` | Popover; single subtree; dies with the field |
| **Guest stepper open** | **`useState`** in `GuestField` | Same |
| **Account menu open** | **`useState`** in `AccountMenu` | Same |
| **Search pill expanded** | **`useState`** in `SearchPill` | Same |
| **Description expanded (inline)** | **`useState`** in `Description` | Local presentation only |
| **Hover / focus visuals** | **CSS** | Never JavaScript state |

**Result: four pieces of transient UI state that a naive design would put in Zustand stay
local.** They are popovers — single-subtree, non-deep-linkable, and they do not lock scroll.

### 3.3 Why popovers are architecturally distinct

Measured in §0.1 and §1.8 of the interaction spec:

| | Modal | Popover |
|---|---|---|
| Scroll lock | **Yes** | **No** |
| URL | Sometimes | Never |
| `role="dialog"` | Yes | No |
| Focus | Trapped | Moves to field |
| State home | Zustand / URL | **`useState`** |

Treating the date picker as a modal would lock the page scroll — a visible, measurable
deviation from the reference. This distinction is load-bearing, not stylistic.

### 3.4 Store definitions

```js
// listingStore — server data only
{
  listing: null,
  status: 'idle' | 'loading' | 'success' | 'error',
  error: null,
  fetchListing(id),
  reset(),
}

// galleryStore — derived gallery concerns
{
  activeIndex: 0,          // synced from URL ?photo
  direction: 'next' | 'prev',
  activeRoomGroup: null,
  setActiveIndex(i),
  next(), prev(),          // clamped to [0, photos.length-1]
}

// uiStore — overlay orchestration
{
  modalStack: [],          // e.g. ['photos', 'lightbox']
  lockCount: 0,
  focusReturnStack: [],    // HTMLElement refs
  openModal(id, triggerEl),
  closeTopModal(),         // ← the two-stage Escape
  closeAllModals(),
}
```

**`closeTopModal()` is the single most important function in the client.** It pops one level,
restores that level's focus target, and decrements `lockCount` — releasing the scroll lock
only at zero. That reproduces the measured behaviour exactly: after the first `Escape` the
body is *still locked* because the tour remains open.

### 3.5 URL ↔ store synchronisation

To avoid two sources of truth, sync is **one-directional per phase**:

```
URL  ──(on mount + popstate)──►  store        read
store ──(on action)──►  navigate()  ──► URL   write
```

Components read from the store. Actions write to the URL, which flows back into the store.
The store is never written directly for URL-backed state. **[decision]** — see §9.2.

---

## 4. Data flow

### 4.1 Initial load

```
ListingPage mount
  └─► useListing(id)
        └─► listingStore.fetchListing(id)
              └─► listingService.getListing(id)
                    └─► apiClient.get('/api/listings/:id')
                          │  Vite dev proxy → http://localhost:5000
                          ▼
                    Express  routes → controller → service → model → data
                          ▼
                    { success: true, data: { …listing } }
              └─► status: 'success', listing populated
  └─► components subscribe via selectors (no prop drilling)
```

### 4.2 Opening the lightbox — the full path

```
User clicks a tour photo
  └─► navigate('?modal=photos&photo=abc123')
        └─► URL change
              ├─► uiStore.openModal('lightbox', triggerEl)
              │     ├─ modalStack: ['photos'] → ['photos','lightbox']
              │     ├─ lockCount: 1 → 2
              │     └─ focusReturnStack.push(triggerEl)
              └─► galleryStore.setActiveIndex(indexOf('abc123'))
  └─► ModalRoot renders <Lightbox> in portal
        └─► ModalShell: trap focus, keep body locked, bind Escape

User presses Escape
  └─► useModalStack → uiStore.closeTopModal()
        ├─ modalStack → ['photos']
        ├─ lockCount: 2 → 1   ← body STAYS locked
        ├─ focus restored to the tour control
        └─ navigate: drop &photo, keep ?modal=photos
```

### 4.3 Photos: one list, three presentations

The asset phase proved gallery / tour / lightbox are three views of **one** photo array
(same files, different `im_w` variants). Therefore:

```
listing.photos[]  ──┬──► PhotoGrid     .slice(0, 5)      im_w 1200 / 720   cover
                    ├──► PhotoTour     groupBy(room)     im_w 1200 / 720   cover
                    └──► Lightbox      [activeIndex]     im_w 1440         contain
```

`groupPhotos.js` derives room groups. **No duplicated asset lists, no separate fetches.**

---

## 5. API architecture

### 5.1 Endpoints

| Method | Path | Purpose | Justification |
|---|---|---|---|
| `GET` | `/api/listings/:id` | Complete listing payload | The page's only data need |
| `GET` | `/api/health` | Liveness | Ops, not product |

**Two endpoints. That is the whole API.**

### 5.2 Endpoints deliberately rejected

The prompt asks for the *minimum*. Each rejection is reasoned:

| Rejected | Why |
|---|---|
| `GET /api/listings/:id/photos` | Photos ship with the listing; a second round-trip would delay the LCP image, which the reference marks `elementtiming="LCP-target"` **[M]** |
| `GET /api/listings/:id/reviews` | Reviews render inside the initial page; no pagination observed **[M]** |
| `GET /api/listings/:id/availability` | Blocked dates ship in the payload — a few hundred bytes vs. a round-trip |
| `POST /api/bookings` | No booking is ever completed; the CTA only scrolls to the calendar **[M]** |
| `POST /api/quote` | Total = nightly × nights, computable client-side **[decision]** — §9.5 |
| Auth endpoints | Explicitly out of scope; `Save` opens a login modal that is never submitted |
| `GET /api/listings` (index) | No index page in scope |

### 5.3 Response envelope

```jsonc
// 200
{ "success": true, "data": { /* listing */ } }

// error
{ "success": false, "error": { "code": "LISTING_NOT_FOUND",
                               "message": "Listing not found", "status": 404 } }
```

| Status | When |
|---|---|
| 200 | Found |
| 400 | Malformed `:id` (validation middleware) |
| 404 | Unknown id, or unmatched route |
| 429 | Rate limit exceeded |
| 500 | Unhandled — generic message in production |

### 5.4 Listing payload shape

Derived directly from the content measured on the page:

```jsonc
{
  "id": "listing-001",
  "title": "…",                                  // h1
  "propertyType": "Entire rental unit",
  "location": { "city": "…", "region": "…", "country": "…",
                "coordinates": { "lat": 0, "lng": 0 } },
  "capacity": { "guests": 4, "bedrooms": 2, "beds": 2, "bathrooms": 2 },
  "rating": { "value": 4.84, "count": 76, "isNew": false },
  "photos": [ { "id": "p1", "url": "…", "alt": "…",
                "room": "Living room", "width": 1440, "height": 960 } ],
  "roomGroups": [ { "name": "Living room", "details": ["Air conditioning", "TV"] } ],
  "host": { "id": "h1", "name": "…", "avatarUrl": "…", "monthsHosting": 7,
            "reviewCount": 69, "rating": 4.67, "bio": "…",
            "responseRate": 100, "responseTime": "within an hour" },
  "highlights": [ { "icon": "key", "title": "Self check-in", "subtitle": "…" } ],
  "description": { "summary": "…", "sections": [ { "heading": "The space", "body": "…" } ] },
  "amenities": [ { "id": "wifi", "label": "Wifi", "icon": "wifi",
                   "category": "Internet and office", "available": true } ],
  "sleepingArrangements": [ { "name": "Bedroom 1", "beds": ["1 king bed"], "imageUrl": "…" } ],
  "pricing": { "nightlyRate": 7100, "currency": "INR" },
  "availability": { "blockedDates": ["2026-10-10", "…"], "minNights": 2 },
  "reviews": [ { "id": "r1", "author": "…", "avatarUrl": "…",
                 "rating": 5, "date": "…", "body": "…" } ],
  "policies": { "checkIn": "after 2:00 pm", "checkOut": "before 11:00 am",
                "maxGuests": 4, "cancellation": "…", "safety": ["…"] }
}
```

**Design note.** `amenities[].available: false` exists because the reference renders
unavailable amenities with **strikethrough** rather than omitting them **[M]**. The API must
carry the negative state; filtering server-side would lose it.

---

## 6. Backend layering

Strict one-way dependency — each layer knows only the one below:

```
Request
  → securityMiddleware       helmet, rate limit, payload cap, CORS
  → routes/listingRoutes     path + method → handler
  → validationMiddleware     :id shape; reject early, 400
  → controllers              HTTP only: read req, call service, send res
  → services                 business logic; no req/res objects
  → models                   data access + shape normalization
  → data/listings.js         static seed
  ← errorMiddleware          ApiError → envelope
```

| Layer | Owns | Must never |
|---|---|---|
| Route | Path, method, middleware order | Contain logic |
| Controller | `req` → args, `res` → envelope | Touch the data source |
| Service | Business rules, composition | Know about HTTP |
| Model | Data access, shape | Know about HTTP |
| Middleware | Cross-cutting | Contain domain logic |

**The testable consequence:** services are called with plain arguments and return plain data,
so they are unit-testable without HTTP. `app.js` exports the app without `listen()`, so it is
testable with Supertest.

### 6.1 Middleware

| Middleware | Responsibility |
|---|---|
| `helmet()` | Security headers |
| `cors()` | Single allowed origin from `config/env.js` — not `*` |
| `express.json({ limit: '10kb' })` | Payload cap |
| `rateLimit` | Blunt abuse protection |
| `validateListingId` | `:id` format; 400 before any lookup |
| `notFound` | Unmatched route → 404 envelope |
| `errorHandler` | Final: `ApiError` → envelope; log; generic 500 message in production |

`asyncHandler` wraps async controllers so rejections reach `errorHandler` without
`try/catch` in every handler.

---

## 7. Frontend / backend responsibilities

| Concern | Client | Server |
|---|---|---|
| Listing data | Fetch, cache in store | **Own** |
| Photo grouping by room | **Derive** (`groupPhotos`) | Supply `room` per photo |
| Image variant (`im_w`) selection | **Own** (`useImageVariant`) | Supply base URL |
| Nights + total price | **Own** (`dateRange`) | Supply `nightlyRate` |
| Date availability check | **Own** (against `blockedDates`) | Supply `blockedDates` |
| Modal / URL state | **Own** | — |
| Focus, scroll lock, keyboard | **Own** | — |
| Currency + date formatting | **Own** (`Intl`) | Supply raw values + ISO dates |
| Validation | Field-level UX | **Authoritative** |
| Security headers, rate limit | — | **Own** |

**Principle:** the server owns *facts*; the client owns *presentation and interaction*.
The server never returns a formatted price string or a pre-sliced gallery array.

---

## 8. Tailwind configuration

Phase 1 produced exact values. They become **tokens**, not arbitrary utilities scattered
through JSX:

```js
// tailwind.config.js (excerpt)
extend: {
  colors: {
    ink:        '#222222',   // primary text  [M] 309 nodes
    muted:      '#6C6C6C',   // secondary     [M] 113 nodes
    subtle:     '#8C8C8C',
    disabled:   '#D1D1D1',
    line:       '#DDDDDD',   // borders
    surface:    '#F7F7F7',   // footer
    control:    '#F2F2F2',   // secondary button
    controlHover:'#EBEBEB',
    rausch:     { from: '#E61E4D', mid: '#E31C5F', to: '#D70466' },
  },
  spacing:     { header: '96px', sticky: '80px' },
  maxWidth:    { content: '1120px' },
  width:       { main: '653.3px', aside: '372.3px' },
  borderRadius:{ card: '12px', gallery: '12px', map: '20px', modal: '32px', pill: '999px' },
  boxShadow: {
    card:  '0 6px 16px rgba(0,0,0,0.12)',
    modal: '0 8px 28px rgba(0,0,0,0.28)',
    pop:   '0 6px 20px rgba(0,0,0,0.20)',
    menu:  '0 2px 16px rgba(0,0,0,0.12)',
  },
  transitionTimingFunction: { airbnb: 'cubic-bezier(0.2, 0, 0, 1)' },
  fontSize: {
    h1:      ['26px', { lineHeight: '30px', fontWeight: 500 }],
    section: ['22px', { lineHeight: '26px', letterSpacing: '-0.44px', fontWeight: 500 }],
    body:    ['16px', { lineHeight: '20px' }],
    base:    ['14px', { lineHeight: '18px' }],
    micro:   ['12px', { lineHeight: '16px' }],
  },
}
```

One curve (`ease-airbnb`) and one border colour cover the whole page — matching the
reference's own discipline.

---

## 9. Key design decisions and tradeoffs

### 9.1 Zustand for server state, not React Query **[decision]**

- **Chosen:** `listingStore` holds fetched data.
- **Cost:** hand-rolled loading/error states; no caching, retry, or dedup.
- **Why:** the app fetches **one resource, once, per page**. React Query would add a
  dependency and a second state paradigm to solve problems this app does not have.
- **Revisit if:** a listings index, search, or refetch-on-focus is added.

### 9.2 URL as the source of truth for deep-linkable state **[decision]**

- **Chosen:** the URL owns photo tour, active photo, description modal, dates, guests.
- **Cost:** two representations to keep in sync; a sync bug shows as a stuck modal.
- **Why:** the reference does exactly this **[M]**, and it delivers back/forward navigation
  and shareable links for free. The one-directional rule in §3.5 contains the cost.
- **Rejected:** store-only state — would silently break the browser Back button, which the
  reference supports.

### 9.3 Static JSON instead of a database **[decision]**

- **Chosen:** `data/listings.js` behind `listingModel`.
- **Cost:** no persistence, no queries.
- **Why:** the page is read-only. Nothing is ever written. A database would be
  infrastructure serving no observed requirement.
- **Contained:** only `listingModel` touches the data source, so swapping in Postgres or
  Mongo touches exactly one file.

### 9.4 One `ModalShell` for six modals

- **Why:** §0 of the interaction spec proved the contract is identical across all six.
  Implementing the focus trap, scroll lock, and Escape stack once is the difference between
  matching the reference and approximating it.
- **Tradeoff:** `ModalShell` becomes load-bearing — a bug there breaks every overlay. Worth
  it, because the alternative is the same bug six times.

### 9.5 Client-side price computation **[decision]**

- **Chosen:** `total = nightlyRate × nights`, computed in the client.
- **Cost:** pricing logic in the UI; no server-authoritative total.
- **Why:** no money changes hands. The reference shows "Prices include all fees" with no
  visible fee breakdown **[M]**.
- **Revisit if:** cleaning fees, taxes, or discounts are added — then `POST /api/quote`
  becomes genuinely required.

### 9.6 Desktop-only

- **Chosen:** build for 1440px; no mobile layout.
- **Cost:** unusable below ~1100px.
- **Why:** honest scoping — **all responsive behaviour is unmeasured [N]** (§5 of the asset
  inventory, §5 of the interaction spec). Building breakpoints would mean inventing a
  reference that was never observed.
- **Mitigation:** use tokens and `TwoColumn` so breakpoints can be added later without
  restructuring.

### 9.7 Icon library instead of inlined SVG

- **Why:** the reference inlines 59 SVGs with zero sprite reuse — **48.9 KB** of duplicated
  markup **[M]**. That is a cost of their build, not a design intent worth copying.
- **Tradeoff:** library glyphs will not match Airbnb's proprietary set exactly. Acceptable —
  and necessary, since those icons cannot be reused anyway.

### 9.8 No authentication

- **Why:** explicitly out of scope. `Save` opens a login modal that is never submitted **[M]**.
- **Consequence:** `LoginModal` is **presentational only** — it renders the measured 480×488
  panel and submits nothing.

### 9.9 Summary of tradeoffs

| Decision | Gains | Costs | Reversible? |
|---|---|---|---|
| Zustand for server state | Simplicity, one paradigm | No cache/retry | Easily |
| URL as modal truth | Deep links, Back button | Sync complexity | Moderately |
| Static JSON | Zero infra | No persistence | Easily — one file |
| Single `ModalShell` | Uniform a11y | Central failure point | Hard (by design) |
| Client-side pricing | No round-trip | Not authoritative | Easily |
| Desktop-only | Honest scope | No mobile | Moderately |
| Icon library | −48.9 KB | Not pixel-identical | Easily |

---

## 10. Build and run

| Location | Script | Does |
|---|---|---|
| root | `npm run dev` | Client + server concurrently |
| `client/` | `npm run dev` | Vite, port 5173, `/api` proxied to 5000 |
| `server/` | `npm run dev` | nodemon, port 5000 |

Root `package.json` uses npm workspaces so one install covers both packages.

---

## 11. Open questions for implementation

Carried forward from the reference phases — resolve rather than guess:

| # | Question | Source |
|---|---|---|
| 1 | Description clamp is **8 lines** — confirm at 653.3px width | Interaction §1.7 **[M]** |
| 2 | Primary CTA hover effect unresolved (possible pseudo-element) | Interaction §1.8 **[M‑neg]** |
| 3 | Modal enter/exit animation never captured — pick a ≤300ms fade | Interaction §5 **[N]** |
| 4 | Lightbox photo-change transition unknown | Interaction §5 **[N]** |
| 5 | Reviews modal never observed — build only what is visible inline | Interaction §5 **[N]** |
| 6 | Gallery tiles have **no** hover effect — do not add one | Interaction §1.5 **[M‑neg]** |
| 7 | Map: static image vs. library | Asset §6 **[decision]** |
