# Asset Inventory — Airbnb Listing Page

Companion to [REFERENCE_ANALYSIS.md](./REFERENCE_ANALYSIS.md) (what it looks like) and
[INTERACTION_SPEC.md](./INTERACTION_SPEC.md) (what it does). This document lists **what must
be produced or sourced** to reproduce the visual result.

## Method

Assets were enumerated from a real Chrome session by recording every `image`, `font`,
`stylesheet` and `media` network response, then reading each `<img>` and `<svg>` from the
DOM: `naturalWidth/Height`, rendered box, `object-fit`, `object-position`, `border-radius`,
`loading`, and the CDN's width parameter.

| Item | Value |
|---|---|
| Viewport | 1440 × 900, DPR 1 |
| Listing | `1759355047605224205` — 34 photos |
| Network totals | **74 image**, **3 font**, 3 stylesheet, 6 media responses |
| Date | 2026-09-11 |

> **Reference note.** Phase 3 names the Vercel clone; that deployment is bot-blocked
> (HTTP 429), so — as with Phases 1–2 — the **original Airbnb site** was analysed. No
> application source code was read or reproduced. Asset *URLs* below are evidence of
> structure and sizing; the images themselves are Airbnb's and must be replaced with your
> own photography.

### Legend

- **[M]** Measured from the DOM / network.
- **[V]** Read from a screenshot.
- **[N]** Not observed.

---

## 1. The short version

| Category | Count | Verdict |
|---|---|---|
| Property photographs | **34** per listing | **Must be sourced** — real image files |
| Host avatar | 1 | **Must be sourced** |
| Search-pill illustration | 1 PNG | Sourced, or replaceable with an icon |
| Logo | 1 inline SVG path | **Recreate** — must be your own mark |
| UI icons | **59 inline SVGs** | **Replace with an icon library** |
| Map | Google Maps canvas + SVG marker data-URIs | Library or static image |
| Fonts | **1 variable woff2** (+ Roboto via Maps) | Substitute a free variable font |
| Decorative backgrounds | **0 raster** — 2 CSS gradients | **Pure CSS** |

**The headline:** apart from photography, the avatar, and one small PNG, this page uses
**no image files at all**. Every icon, the logo, both gradients and every divider are vector
or CSS. An implementation needs ~35 photographs and essentially nothing else.

---

## 2. Property / gallery photography

All property images come from `a0.muscache.com` (Airbnb's image CDN).

### 2.1 Source characteristics **[M]**

| Property | Value |
|---|---|
| Path shape | `/im/pictures/airflow/Hosting-<listingId>/original/<uuid>.jpg` and `/im/pictures/hosting/Hosting-<listingId>/original/<uuid>.jpeg` |
| Master aspect ratio | **3 : 2** — every variant measured is 3:2 (`1440×960`, `1200×800`, `720×480`, `480×320`) |
| Width ladder (`?im_w=`) | **120, 240, 480, 720, 1200, 1440** |
| Delivered formats | **AVIF** and **WebP** via content negotiation on `.jpg` URLs (also PNG / GIF for platform assets) |
| Average payload | ≈ **13.6 KB** per image |
| `srcset` | **Not used** for gallery images (`srcsetN: 0`) — the CDN's `im_w` parameter does the work instead |
| Total per listing | **34** photographs |

The single most reusable finding: **author every property photo at 3:2 and generate a
120/240/480/720/1200/1440 width ladder.** Every slot on the page is fed from that one ladder.

### 2.2 Per-slot inventory **[M]**

| # | Slot | Location | Variant | Natural | Rendered | Aspect | Fit | `object-position` | Radius | Repeats | In Tour | In Lightbox |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Gallery hero | Listing, `x=152.3 y=174` | `im_w=1200` | 1200×800 | **560 × 476** | 3:2 → **~1.18:1** | `cover` | `50% 50%` | 0 (see note) | Yes | Yes | Yes |
| 2 | Gallery top-middle | `x=720.3 y=174` | `im_w=720` | 720×480 | **272 × 238** | 3:2 → ~1.14:1 | `cover` | `50% 50%` | 0 | Yes | Yes | Yes |
| 3 | Gallery bottom-middle | `x=720.3 y=420.1` | `im_w=720` | 720×480 | **272 × 230** | 3:2 → ~1.18:1 | `cover` | `50% 50%` | 0 | Yes | Yes | Yes |
| 4 | Gallery top-right | `x=1000.3 y=174` | `im_w=720` | 720×480 | **272 × 238** | 3:2 | `cover` | `50% 50%` | 0 | Yes | Yes | Yes |
| 5 | Gallery bottom-right | `x=1000.3 y=420.1` | `im_w=720` | 720×480 | **272 × 230** | 3:2 | `cover` | `50% 50%` | 0 | Yes | Yes | Yes |
| 6 | Sleeping arrangement | Left column | `im_w=480` | 480×320 | **319 × 212** | 3:2 → **3:2 preserved** | `cover` | `50% 50%` | **8px** | Yes | Yes | Yes |
| 7 | Photo Tour — category thumb | Tour top strip | `im_w=480`* | — | **146 × 96** | ~1.52:1 | `cover` | `50% 50%` | 0 | Yes | — | — |
| 8 | Photo Tour — large | Tour body | `im_w=1200` | 1200×800 | **741 × 497** | 3:2 preserved | `cover` | `50% 50%` | 0 | Yes | — | Yes |
| 9 | Photo Tour — secondary | Tour body | `im_w=720` | 720×480 | **367 × 246** | 3:2 preserved | `cover` | `50% 50%` | 0 | Yes | — | Yes |
| 10 | **Lightbox** | Full screen | **`im_w=1440`** | **1440×960** | **1233 × 676** | 3:2 preserved | **`contain`** | `50% 50%` | 0 | Yes | — | — |

\* thumbnail variant inferred from the ladder; the exact `im_w` for the category strip was
not isolated **[N]**.

**Cropping notes:**

- Every slot uses **`object-fit: cover` except the lightbox**, which uses **`contain`** so
  the full frame is visible against black. This is the only fit change on the page. **[M]**
- `object-position` is **`50% 50%` everywhere** — no art-direction, no focal points. **[M]**
- Gallery tiles crop a 3:2 master to ~1.14–1.18:1, so **roughly 20–25% of image height is
  cropped away** in the mosaic. Compose photos with headroom. **[M]**
- The sleeping, tour and lightbox slots all preserve 3:2 — **no crop**. **[M]**

**Radius note [M]:** every gallery `<img>` computes `border-radius: 0`. The mosaic's rounded
corners come from a **12px-radius wrapper with `overflow: hidden`** one level up. Only the
sleeping-arrangement images carry radius (8px) on the image itself.

### 2.3 Reuse across surfaces **[M]**

The same file is reused at different variants rather than re-cropped. Traced
`7e3895ba-feba-4388-8cc4-53b0630527e4.jpg`:

| Surface | Variant | Rendered |
|---|---|---|
| Gallery hero | `im_w=1200` | 560 × 476 (`cover`) |
| Photo Tour large | `im_w=1200` | 741 × 497 (`cover`) |
| Lightbox | `im_w=1440` | 1233 × 676 (`contain`) |

**Implication:** the data model needs **one photo list**; gallery, tour and lightbox are
three presentations of it, not three asset sets. Gallery shows **5 of 34**; the tour shows
all 34 grouped by room; the lightbox shows all 34 one at a time.

### 2.4 Loading **[M]**

| Slot | `loading` |
|---|---|
| Gallery (all 5) | `auto` — eager, above the fold |
| Host overview avatar | `lazy` |
| Sleeping images | `auto` |
| Photo Tour body | Lazy — 21 of 34 `<img>` present after initial scroll |

The hero image carries `elementtiming="LCP-target"`, confirming it is treated as the LCP
element. **[M]**

---

## 3. Host / avatar images

| # | Asset | Location | Variant | Natural | Rendered | Fit | Radius | Repeats |
|---|---|---|---|---|---|---|---|---|
| 11 | Host avatar — small | `HOST_OVERVIEW_DEFAULT` | `im_w=120` | 40×40 | **40 × 40** | `cover` | **`0px` on the `<img>`** | Same file as #12 |
| 12 | Host avatar — large | `MEET_YOUR_HOST` | `im_w=240` | 240×240 | **88 × 88** | `cover` | **`50%`** | Same file as #11 |

**Notes [M]:**

- Path: `/im/pictures/user/User/original/<uuid>.jpeg` — **1:1 square master**.
- One file serves both slots at two variants (120 and 240).
- The small avatar's `<img>` computes `border-radius: 0`, yet renders circular **[V]** — the
  circle is clipped by an ancestor. The large avatar carries `border-radius: 50%` directly.
  Implement the circle on a wrapper to match both.
- A **generated fallback** exists at `/im/Portrait/Avatars/v2/green` for hosts without a
  photo — i.e. a coloured placeholder, trivially reproducible in CSS. **[M]**

---

## 4. Logo

| Property | Value |
|---|---|
| Type | **Inline `<svg>`** — not an image file **[M]** |
| `viewBox` | `0 0 3490 1080` **[M]** |
| Rendered | **102 × 32** at `x = 48, y = 32` **[M]** |
| Geometry | **A single `<path>`** — wordmark and glyph in one path **[M]** |
| Markup size | ≈ 4.0 KB **[M]** |
| Colour | Brand Rausch pink **[V]** (the `<svg>` element itself computes `fill: rgb(0,0,0)`; colour is applied on the path) |

**Action:** this must be **your own original mark** — do not reproduce Airbnb's path data.
Match only the *slot*: a single-path SVG, ~3.27:1 aspect, rendered 102 × 32, left-aligned at
a 48px gutter, vertically centered in the 96px header.

---

## 5. UI icons

The single largest asset finding on the page.

| Property | Value |
|---|---|
| Count | **59 inline `<svg>` elements** on one listing page **[M]** |
| Sprites / `<use>` | **Zero** — every icon is fully inlined, duplicated per instance **[M]** |
| Total inline SVG markup | ≈ **48.9 KB** **[M]** |
| Icon font | None **[M]** |
| Image-based icons | None (except the search-pill PNG, §6) **[M]** |

### 5.1 Grid and rendered sizes **[M]**

Icons are authored on a **32-unit grid** (`viewBox="0 0 32 32"`) and scaled down. A minority
use `0 0 16 16` and one uses `0 0 48 48`.

| Rendered | Count | Typical use |
|---|---|---|
| **24 × 24** | 17 | Amenity rows, section icons |
| 16 × 16 | 9 | Close, share, save, inline marks |
| 12 × 12 | 3 | Lightbox prev / next chevrons |
| 9 × 9 | 5 | Micro-glyphs, separators |
| 8 × 8, 7 × 7 | 4 | Dots, tiny marks |
| 102 × 32 | 1 | Logo |

### 5.2 Two icon styles **[M]**

| Style | Computed | Used for |
|---|---|---|
| **Stroke** | `fill: none; stroke: #222222; stroke-width: 4` (on the 32-unit grid = **12.5% of the box**) | Chevrons, close, share, heart, navigation |
| **Fill** | `fill: #222222; stroke: none`, single `<path>` | Amenity icons |

Amenity icons are **solid single-path glyphs**, 24 × 24, ≈ 680 bytes of markup each. Stroke
icons are ≈ 310 bytes each.

### 5.3 Recommendation

**Replace all 59 with an icon library.** Choose one with both stroke and solid variants on a
24px grid — Lucide, Phosphor, or Heroicons (outline + solid). Match:

- stroke icons at **stroke-width ≈ 1.5px** when rendered at 24px (12.5% of a 32-unit box
  scaled to 24 ≈ 3px raw, which reads as a ~1.5–2px visual weight — tune by eye)
- solid icons for amenities
- `currentColor` so a single `#222222` text colour drives everything

Prefer a **sprite or component import** over Airbnb's inline duplication — 48.9 KB of
repeated markup is a cost to avoid, not a pattern to copy.

---

## 6. Map / location visuals

| Property | Value |
|---|---|
| Provider | **Google Maps** — `maps.googleapis.com`, `maps.gstatic.com` **[M]** |
| Render surface | **`<canvas>` 1120 × 480** (vector tiles, not raster tile images) **[M]** |
| Container | 1120 × 480, `border-radius: 20px`, `overflow: hidden` **[M]** |
| Markers | **`data:image/svg+xml` URIs** inlined — `viewBox` `0 0 18 18`, `0 0 23 38`, `0 0 24 38`, `0 0 40 50` **[M]** |
| Pointer / tail | **Pure CSS**: `linear-gradient(135deg, rgba(0,0,0,0) 50%, rgb(34,34,34) 50%)` — a gradient triangle, no image **[M]** |
| Secondary font | Roboto (`fonts.gstatic.com`) — pulled in by Maps, not by the page **[M]** |

**Recommendation.** The map is the one place worth *not* matching implementation. Options in
order of cost:

1. **Static image** — a 1120 × 480 map export at 20px radius. Zero JS, visually identical at
   rest. Loses pan/zoom (which was **[N]** never exercised anyway).
2. **Open-source tiles** — MapLibre/Leaflet with OSM. Interactive, no API key.
3. **Google Maps JS** — matches exactly, needs a billed key.

Markers and the pointer tail are reproducible as inline SVG + a CSS gradient regardless.

---

## 7. Fonts

| # | Asset | Detail |
|---|---|---|
| 13 | **`AirbnbCerealVF_W_Wght.woff2`** | **A single variable font file**, weight axis, served from `a0.muscache.com/airbnb/static/airbnb-dls-web/build/fonts/cereal-variable/` **[M]** |
| 14 | `Roboto` woff2 | From `fonts.gstatic.com`, loaded **by Google Maps**, not the page **[M]** |

**Loaded faces [M]:**

| Family | Style | Status |
|---|---|---|
| Airbnb Cereal VF | normal | **loaded** |
| Airbnb Cereal VF | italic | **unloaded** — italic is never used |
| Airbnb Cereal VF | normal (2nd face) | unloaded |

**Only three font requests for the entire page**, and effectively **one file** does all the
typographic work — every weight from 400 to 700 comes from the same variable woff2.

**Action.** Airbnb Cereal is proprietary and cannot be used. Substitute a free **variable**
geometric sans — Inter Variable or Manrope Variable — preserving:

- one variable file, weight axis only
- **no italic face** (the reference never loads one)
- the declared stack shape: `"<Your Font>", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`

---

## 8. Other visible assets

| # | Asset | Location | Natural | Rendered | Fit | Notes |
|---|---|---|---|---|---|---|
| 15 | Search-pill illustration | Header search bar | **240 × 216** PNG | **48 × 48** | **`fill`** | `/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-search-bar-icons/…png` — the only decorative raster on the page. Note `object-fit: fill` **distorts** a 240×216 source into a 48×48 square **[M]** |
| 16 | Platform profile asset | Header/menu | PNG | — | — | `AirbnbPlatformAssets-UserProfile` **[M]** |
| 17 | Avatar fallback | Host slots | Generated | 40 / 88 | — | `/im/Portrait/Avatars/v2/green` — coloured placeholder **[M]** |

### 8.1 Excluded — tracking pixels **[M]**

74 image responses were recorded, but many are 1×1 beacons with **no visual role**. Hosts
seen: `tr.snapchat.com`, `www.facebook.com`, `ct.pinterest.com`, `googleads.g.doubleclick.net`,
`ad.doubleclick.net`, `analytics.google.com`, `www.google.com`, `www.google.co.in`,
`verifi.pdscrb.com`. Content types include `text/plain`, `text/html`, `image/gif`, `image/bmp`.

**None of these are assets.** Exclude them entirely.

---

## 9. Assets recreatable without image files

This is the practical output of the phase.

| Reference asset | Replace with | Why |
|---|---|---|
| **All 59 UI icons** | Icon library (Lucide / Phosphor / Heroicons), 24px grid, `currentColor` | Already pure vector; a library removes 48.9 KB of duplicated inline markup **[M]** |
| **Logo** | Your own single-path SVG, 102 × 32 | Must be original anyway **[M]** |
| **Primary CTA gradient** | `linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)` | Already CSS in the reference **[M]** |
| **Search submit button** | `radial-gradient(circle, #FF385C 0%, #E61E4D 27.5%, #E31C5F 40%, #D70466 57%…)` | Already CSS **[M]** |
| **Map pointer / tail** | `linear-gradient(135deg, transparent 50%, #222222 50%)` | Already CSS **[M]** |
| **Map markers** | Inline SVG (18×18, 24×38, 40×50) | Already data-URI SVG **[M]** |
| **Avatar fallback** | CSS circle + initial, or a generated colour block | Reference uses a generated endpoint **[M]** |
| **Gallery corner rounding** | 12px-radius wrapper + `overflow: hidden` | No masks or clip-paths involved **[M]** |
| **Card borders / dividers** | `1px solid #DDDDDD` | No image borders **[M]** |
| **Card + modal shadows** | `0 6px 16px rgba(0,0,0,.12)`, `0 8px 28px rgba(0,0,0,.28)` | Pure CSS **[M]** |
| **Star / rating glyph** | Icon library or `★` | Vector **[M]** |
| **Search-pill illustration** | An icon from the same library | A 48×48 decorative PNG earns no raster request **[M]** |
| **Map (optional)** | Static 1120 × 480 export, or MapLibre + OSM | Interactivity was never exercised **[N]** |

**Only two categories genuinely require image files: property photography (34 per listing)
and the host avatar (1).** Everything else on this page is vector, CSS, or a font.

### 9.1 Total decorative raster footprint

| | Reference | Achievable |
|---|---|---|
| CSS `background-image` declarations | **2 — both gradients** | 2 gradients |
| Decorative raster images | **1** (48 × 48 search PNG) | **0** |

The page has **no background textures, no sprite sheets, no decorative imagery**. Any such
asset in an implementation is a deviation from the reference.

---

## 10. Production checklist

To build one listing page you need:

| # | Item | Qty | Spec |
|---|---|---|---|
| 1 | Property photographs | **34** | **3:2**, master ≥ 1440 × 960 |
| 2 | Width variants per photo | 6 | **120 / 240 / 480 / 720 / 1200 / 1440** |
| 3 | Formats | 2 | **AVIF + WebP**, JPEG fallback |
| 4 | Room grouping metadata | 9 groups | Living room, Full kitchen, Dining area, Bedroom 1–2, Full bathroom 1–2, Exterior, Pool — drives the Photo Tour |
| 5 | Host avatar | 1 | **1:1**, ≥ 240 × 240 |
| 6 | Avatar fallback | 1 | CSS/generated |
| 7 | Logo | 1 | Original SVG, 102 × 32 |
| 8 | Icon set | ~25 unique | 24px grid, stroke + solid |
| 9 | Variable font | 1 | Weight axis, **no italic** |
| 10 | Map | 1 | Static 1120 × 480 @ 20px radius, or a map library |

**Per-photo budget:** ≈ 13.6 KB average at the delivered variant **[M]**. A 34-photo listing
therefore ships roughly 70 KB above the fold (5 gallery images) and defers the rest.

---

## 11. Not observed

| # | Item | Status |
|---|---|---|
| 1 | Exact `im_w` for the Photo Tour category thumbnails | Inferred from the ladder **[N]** |
| 2 | DPR 2 / retina variants | Only DPR 1 was tested — the ladder implies 2× is served by doubling `im_w` **[N]** |
| 3 | Video assets | 6 `media` responses were recorded but not identified **[N]** |
| 4 | Map interaction assets (pan/zoom tiles) | Map was never interacted with **[N]** |
| 5 | Responsive image variants | Only 1440px was measured; mobile likely uses 480/720 **[N]** |
| 6 | Placeholder / blur-up strategy | An `rgba(34,34,34,0.10)` tint was seen as a background but the loading sequence was not traced **[N]** |
| 7 | Icon licence/provenance | Airbnb's icons are proprietary; a library substitute is assumed **[N]** |
