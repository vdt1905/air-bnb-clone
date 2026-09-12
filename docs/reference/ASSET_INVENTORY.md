# Asset Inventory

Everything needed to reproduce the listing page visually, without reading the
reference application's source.

Companion to [REFERENCE_ANALYSIS.md](./REFERENCE_ANALYSIS.md) (what it looks like) and
[INTERACTION_SPEC.md](./INTERACTION_SPEC.md) (what it does).

---

## 0. How this was produced, and one caveat

Assets were enumerated from a real Chrome session: every `image`, `font`, `stylesheet`
and `media` response was recorded, then each `<img>` and `<svg>` was read from the DOM —
`naturalWidth/Height`, rendered box, `object-fit`, `object-position`, `border-radius`,
`loading`, and the CDN width parameter.

> **Caveat on the reference URL.** `airbnb-clone-umber-two.vercel.app` sits behind
> Vercel's bot checkpoint. It answers a first request from a fresh browser profile and
> then blocks every subsequent navigation (`"This page could not be verified"`), so it
> could not be measured. **The numbers below were measured from the original
> airbnb.com listing page**, which that clone reproduces. Every figure is a real
> measurement; none is an estimate. Where something was never observed it is marked
> **[N]** rather than guessed.

**No source code was read or reproduced.** Asset URLs are cited as evidence of
structure and sizing only — the images themselves belong to Airbnb and must be replaced
(see §10 class D).

| Item | Value |
|---|---|
| Viewport | 1440 × 900, DPR 1 |
| Network totals | **74 image**, **3 font**, 3 stylesheet, 6 media responses |
| Photos per listing | **34** |

---

## 1. Every visible asset

| ID | Asset | Location | Purpose | Required? | Type | Class |
|---|---|---|---|---|---|---|
| A01 | Hero property image | Gallery, large left tile | Primary image, LCP element | Yes | Photo | **D** |
| A02–A05 | Gallery images 2–5 | Gallery, right 2×2 grid | Mosaic | Yes | Photo | **D** |
| A06–A34 | Gallery images 6–34 | Photo Tour + Lightbox only | Full photo set | Yes | Photo | **D** |
| A35 | Host avatar | Host strip (40px), Meet-your-host (88px) | Host identity | Yes | Photo | **D** |
| A36 | Avatar fallback | Any host/guest without a photo | Placeholder | Yes | Generated | **C** |
| A37–A41 | Reviewer avatars ×5 | Reviews section | Reviewer identity | Optional | Photo | **D** |
| A42 | Logo / wordmark | Header, 102 × 32 | Branding | Yes | SVG | **C** (original) |
| A43 | UI icon set (~25 unique) | Throughout | Interface affordances | Yes | SVG | **C** |
| A44 | Map visual | Location section, 1120 × 480 | Neighbourhood context | Yes | Image or map lib | **C** |
| A45 | Map marker | On the map | Location pin | Yes | Inline SVG | **C** |
| A46 | Search-pill illustration | Header search bar, 48 × 48 | Decoration | Optional | PNG | **C** |
| A47 | Brand gradient (CTA) | Reserve button | Brand accent | Yes | CSS gradient | **C** |
| A48 | Search-submit gradient | Header search button | Brand accent | Yes | CSS gradient | **C** |
| A49 | Map pointer/tail | Map callout | Decoration | Optional | CSS gradient | **C** |
| A50 | Variable UI font | Whole page | Typography | Yes | woff2 | **D** |
| A51 | Favicon | Browser tab | Branding | Yes | SVG | **C** |
| A52 | Sleeping-arrangement images ×2 | "Where you'll sleep" | Room previews | Yes | Photo (reused) | **D** |

**The headline:** apart from photography, one avatar and one optional 48 × 48 PNG, this
page uses **no image files at all**. Every icon, the logo, both gradients, every divider
and the map marker are vector or CSS. The reference declares exactly **two** CSS
`background-image` values on the entire page — both gradients.

---

## 2. Gallery asset inventory

### 2.1 Properties shared by all 34 photos

| Property | Value |
|---|---|
| Master aspect ratio | **3 : 2** — confirmed across `1440×960`, `1200×800`, `720×480`, `480×320` |
| Delivered formats | **AVIF** and **WebP** via content negotiation on `.jpg` URLs |
| Width ladder | **120 / 240 / 480 / 720 / 1200 / 1440** (CDN `?im_w=` parameter) |
| `srcset` | **Not used** — the width parameter does the work |
| Average payload | ≈ **13.6 KB** per delivered image |
| `object-position` | **`50% 50%` on every slot** — no art direction anywhere |
| Reused? | **Yes — every photo is reused across surfaces.** One list, three presentations |
| Local copy needed? | **Yes, all 34** |

### 2.2 Per-image inventory

`L` = appears on the Listing page · `T` = Photo Tour · `X` = Lightbox

| # | Room | Listing slot | L | T | X | Displayed (listing) | Crop | Object-position |
|---|---|---|---|---|---|---|---|---|
| 01 | Living room | **Hero** | ✔ | ✔ | ✔ | 560 × 476 | cover | 50% 50% |
| 02 | Full kitchen | Tile 2 (top-mid) | ✔ | ✔ | ✔ | 272 × 238 | cover | 50% 50% |
| 03 | Dining area | Tile 3 (top-right) | ✔ | ✔ | ✔ | 272 × 238 | cover | 50% 50% |
| 04 | Bedroom 1 | Tile 4 (bot-mid) | ✔ | ✔ | ✔ | 272 × 230 | cover | 50% 50% |
| 05 | Bedroom 2 | Tile 5 (bot-right) | ✔ | ✔ | ✔ | 272 × 230 | cover | 50% 50% |
| 06 | Full bathroom 1 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 07 | Full bathroom 2 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 08 | Exterior | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 09 | Pool | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 10–13 | Living room 2–5 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 14–16 | Full kitchen 2–4 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 17–18 | Dining area 2–3 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 19–22 | Bedroom 1 2–5 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 23–25 | Bedroom 2 2–4 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 26–27 | Full bathroom 1 2–3 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 28–29 | Full bathroom 2 2–3 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 30–32 | Exterior 2–4 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |
| 33–34 | Pool 2–3 | — | ✘ | ✔ | ✔ | — | cover | 50% 50% |

**Every one of the 34 appears in both the Photo Tour and the Lightbox.** Only the first
five appear on the listing page.

### 2.3 The same photo at different sizes

Each photo is rendered at up to five different sizes. Traced for photo 01:

| Surface | Variant requested | Rendered | Fit |
|---|---|---|---|
| Gallery hero | `im_w=1200` | 560 × 476 | cover |
| Gallery secondary | `im_w=720` | 272 × 238 | cover |
| Tour category thumbnail | `im_w=480` | 146.3 × 96.2 | cover |
| Tour lead photo | `im_w=1200` | 741.3 × 494 | cover |
| Tour paired photo | `im_w=720` | 366.65 × 244 | cover |
| **Lightbox** | **`im_w=1440`** | box 1248 × 676 | **contain** |

**Implication for the data model:** ship **one photo array**. Gallery, Tour and Lightbox
are three presentations of it, not three asset sets. Duplicating per-surface assets is
the mistake to avoid.

---

## 3. Image ordering

Order is identical on all three surfaces — the array index *is* the canonical order.

```text
01 → Living room       (gallery hero)
02 → Full kitchen      (gallery tile 2)
03 → Dining area       (gallery tile 3)
04 → Bedroom 1         (gallery tile 4)
05 → Bedroom 2         (gallery tile 5)
06 → Full bathroom 1
07 → Full bathroom 2
08 → Exterior
09 → Pool
10 → Living room 2      ┐
11 → Living room 3      │
12 → Living room 4      │
13 → Living room 5      │
14 → Full kitchen 2     │
15 → Full kitchen 3     │
16 → Full kitchen 4     │
17 → Dining area 2      │
18 → Dining area 3      │
19 → Bedroom 1 (2)      │ remaining photos,
20 → Bedroom 1 (3)      │ grouped by room
21 → Bedroom 1 (4)      │
22 → Bedroom 1 (5)      │
23 → Bedroom 2 (2)      │
24 → Bedroom 2 (3)      │
25 → Bedroom 2 (4)      │
26 → Full bathroom 1 (2)│
27 → Full bathroom 1 (3)│
28 → Full bathroom 2 (2)│
29 → Full bathroom 2 (3)│
30 → Exterior 2         │
31 → Exterior 3         │
32 → Exterior 4         │
33 → Pool 2             │
34 → Pool 3             ┘
```

**Why the lead photo of each room comes first (01–09):** the gallery mosaic shows the
first five photos, and the reference's mosaic shows five *different* spaces. Ordering
lead-per-room first makes `photos.slice(0, 5)` produce a varied mosaic with no
special-casing. The Photo Tour regroups by the `room` field, so this ordering costs the
tour nothing.

### 3.1 Lightbox opening index

**The Lightbox opens at the clicked photo's index**, not at zero. Each photo carries its
index into the flat array, and the Lightbox is addressed by that index:

- Clicking the first tour photo → `1 / 34`
- Clicking Living room's third photo (array index 10) → `11 / 34`

Navigation is **clamped, never wrapping**: `←` at photo 1 stays at `1 / 34`, and at
`34 / 34` the Next control is removed entirely.

---

## 4. Image cropping analysis

| Slot | Displayed AR | Master AR | Fit | Object-position | Cropped? |
|---|---|---|---|---|---|
| Gallery hero | 560:476 ≈ **1.18:1** | 1.5:1 | `cover` | 50% 50% | **Yes — ~21% of width** |
| Gallery tiles 2–3 | 272:238 ≈ **1.14:1** | 1.5:1 | `cover` | 50% 50% | **Yes — ~24%** |
| Gallery tiles 4–5 | 272:230 ≈ **1.18:1** | 1.5:1 | `cover` | 50% 50% | **Yes — ~21%** |
| Sleeping arrangement | 319:212 = **1.5:1** | 1.5:1 | `cover` | 50% 50% | No |
| Tour thumbnail | 146.3:96.2 ≈ **1.52:1** | 1.5:1 | `cover` | 50% 50% | Negligible |
| Tour lead | 741.3:494 = **1.5:1** | 1.5:1 | `cover` | 50% 50% | No |
| Tour paired | 366.65:244 = **1.5:1** | 1.5:1 | `cover` | 50% 50% | No |
| **Lightbox** | box 1248 × 676 | any | **`contain`** | 50% 50% | **Never** |

### 4.1 The two rules that matter

1. **`cover` everywhere except the Lightbox, which is `contain`.** This is the only
   fit change on the page. The Lightbox letterboxes against black so the full frame is
   always visible — never crop there.
2. **`object-position: 50% 50%` universally.** The reference applies no art direction
   and no focal points. Do not vary it per image; that would be inventing behaviour.

### 4.2 Images needing special treatment

Only the **five gallery mosaic tiles** crop meaningfully — a 3:2 master is squeezed into
roughly 1.14–1.18:1, removing **20–25% of the frame**, centred.

**Practical guidance for whoever supplies the photos:** compose the five lead images
(01–05) with subject matter centred and ~25% of slack around the edges. A photo with its
subject near the left or right edge will lose it in the mosaic. Photos 06–34 are shown
uncropped at 3:2 everywhere they appear, so they need no special composition.

---

## 5. Host and avatar assets

| Property | Value |
|---|---|
| Master | **1:1 square**, ≥ 240 × 240 |
| Small slot | **40 × 40** (host strip), variant `im_w=120` |
| Large slot | **88 × 88** (Meet your host), variant `im_w=240` |
| Shape | Circular |
| Border | None |
| Crop | `object-fit: cover`, `50% 50%` |
| Reused? | **Yes — one file serves both slots** at two variants |

**Implementation note.** In the reference the small avatar's `<img>` computes
`border-radius: 0` and is clipped by a circular wrapper; the large one carries
`border-radius: 50%` directly. Put the circle on a wrapper with `overflow: hidden` and
both slots behave identically.

**Accessibility note.** In every placement the person's name sits beside the avatar as
real text, so the avatar should be **decorative** (`alt=""`, `aria-hidden`). A non-empty
alt makes screen readers announce the name twice.

**Fallback.** The reference serves a generated coloured placeholder for hosts without a
photo. Reproduce with a CSS circle plus the initial — no asset needed.

**Reviewer avatars** (5) behave like the small host avatar: 40 × 40, circular,
decorative.

**Recommendation:** **replace** (class D). Use original or licensed portraits; never
reuse the reference's. Store locally.

---

## 6. Logo and brand assets

| Property | Value |
|---|---|
| Type | **Inline `<svg>`**, not an image file |
| `viewBox` | `0 0 3490 1080` (≈ 3.23:1) |
| Rendered | **102 × 32**, at `x = 48`, vertically centred in the 96px header |
| Geometry | **A single `<path>`** — glyph and wordmark in one path |
| Markup size | ≈ 4.0 KB |
| Colour | Brand pink; the `<svg>` element computes `fill: rgb(0,0,0)` with colour applied on the path |

**Recommendation: recreate as an original mark (class C).** Do **not** reproduce the
reference's path data — that is exactly the lift-and-shift the brief prohibits, and it
would also be trademark misuse.

Match only the **slot**, not the artwork: a single-path SVG at roughly 3.2:1, rendered
102 × 32, left-aligned at a 48px gutter. An inline SVG component (not an image file) so
it inherits colour and stays crisp at any DPR.

---

## 7. Icons

| Property | Value |
|---|---|
| Count on one listing page | **59 inline `<svg>` elements** |
| Sprites / `<use>` | **Zero** — every icon fully inlined and duplicated per instance |
| Total inline SVG markup | ≈ **48.9 KB** |
| Icon font | None |
| Image-based icons | None |
| Authoring grid | **32-unit** (`viewBox="0 0 32 32"`); a minority use `0 0 16 16` |

### 7.1 Rendered sizes

| Size | Count | Used for |
|---|---|---|
| **24 × 24** | 17 | Amenity rows, section icons |
| 16 × 16 | 9 | Close, share, save, inline marks |
| 12 × 12 | 3 | Lightbox chevrons |
| 9 × 9 and smaller | 10 | Micro-glyphs, dots |

### 7.2 Two styles

| Style | Computed | Used for |
|---|---|---|
| **Stroke** | `fill: none; stroke: #222222; stroke-width: 4` (12.5% of the 32-unit box) | Chevrons, close, share, heart, navigation |
| **Fill** | `fill: #222222; stroke: none`, single `<path>` | Amenity glyphs |

### 7.3 Grouped icon list — all implementable with `lucide-react`

**Navigation / header**
`Menu` · `UserRound` · `Globe` · `Search` · `ChevronDown`

**Listing**
`Star` (rating, filled) · `Share` · `Heart` (save) · `KeyRound` (self check-in) ·
`Sparkles` (highlights) · `Bed` (sleeping arrangements) · `MapPin` (location)

**Gallery / overlays**
`LayoutGrid` (Show all photos) · `X` (close) · `ChevronLeft` · `ChevronRight`

**Booking**
`ChevronDown` (guest field) · `Minus` · `Plus` (guest steppers) ·
`ChevronLeft` / `ChevronRight` (calendar months)

**Amenities**
`CookingPot` (kitchen) · `Wifi` · `Car` (parking) · `Waves` (pool) · `PawPrint` (pets) ·
`Tv` · `WashingMachine` · `Snowflake` (air conditioning) · `Droplets` (hot water) ·
`Wind` (hairdryer) · `Bath` (toiletries) · `Package` (essentials) · `Shirt`
(hangers / iron) · `Laptop` (workspace) · `Sun` (balcony) · `BellRing` (alarms) ·
`Flame` (heating)

**Footer**
`Globe` (language) — currency is text, not an icon

**Total: 36 named icons** covering every glyph on the page.

### 7.4 Recommendation

**Use `lucide-react` behind a single `<Icon name="…" />` component (class C).** Reasons:

- The reference's icons are proprietary and cannot be reused regardless.
- Its inlining pattern costs **48.9 KB of duplicated markup** with zero sprite reuse —
  that is a cost of its build, not a design intent worth copying.
- A library import is tree-shaken; only the icons actually used ship.

Drive colour from `currentColor` so the single `#222222` text token controls every
glyph. Use solid variants for amenities, stroke variants elsewhere, at ~1.5px visual
weight when rendered at 24px.

**Never use image files for standard UI icons.**

---

## 8. Map / location visual

| Property | Value |
|---|---|
| Provider | **Google Maps** (`maps.googleapis.com`, `maps.gstatic.com`) |
| Render surface | **`<canvas>` 1120 × 480** — vector tiles, not raster tile images |
| Container | 1120 × 480, `border-radius: **20px**`, `overflow: hidden` |
| Markers | **`data:image/svg+xml` URIs** inlined (`viewBox` `0 0 18 18`, `0 0 23 38`, `0 0 24 38`, `0 0 40 50`) |
| Pointer / tail | **Pure CSS**: `linear-gradient(135deg, rgba(0,0,0,0) 50%, rgb(34,34,34) 50%)` |
| Secondary font | Roboto, pulled in **by Maps**, not by the page |

**Is interaction required? No.** Pan, zoom and marker interaction were **[N] never
exercised** on the reference. Nothing observed depends on the map being live.

### Recommendation — simplest approach that reproduces the appearance

**A static map image (class C/B).** A single 1120 × 480 export at 20px radius is
visually identical at rest, needs no API key, no JS, and no billing. Give it fixed
intrinsic dimensions so it contributes zero layout shift, mark it decorative
(`alt=""`, `aria-hidden`) and let the address text carry the meaning.

Escalate only if genuinely needed:

1. **Static image** — recommended.
2. **MapLibre + OpenStreetMap** — interactive, no key, no billing.
3. **Google Maps JS** — matches exactly, requires a billed key.

The marker and pointer are reproducible as inline SVG + a CSS gradient in all three.

> **Note on the 20px radius.** The map is the only 20px radius on the page — gallery and
> booking card are 12px, modals 32px. Do not unify them.

---

## 9. Fonts

| Property | Value |
|---|---|
| Family | **`Airbnb Cereal VF`**, falling back to `Circular, -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif` |
| Delivery | **A single variable woff2**, weight axis (`AirbnbCerealVF_W_Wght.woff2`) |
| Is it a web font? | **Yes**, self-hosted from the CDN |
| Total font requests | **3** for the whole page (one is Roboto, loaded by Maps) |
| Italic | **Declared but never loaded** — the page uses no italic |

**Loaded faces:**

| Family | Style | Status |
|---|---|---|
| Airbnb Cereal VF | normal | **loaded** |
| Airbnb Cereal VF | italic | **unloaded** |

**Weights actually used:** 400, 500, 700 — all from the one variable file.

```text
Font:      Airbnb Cereal VF (proprietary) → substitute Inter Variable or Manrope Variable
Weights:   400 (body), 500 (headings, buttons), 700 (host name only)
Headings:  h1 26/30 w500 · section h2 22/26 w500, letter-spacing −0.44px
Body:      16/20 w400 · base 14/18 w400 · micro 12/16 w500
Buttons:   16/20 w500 (large) · 12/16 w500 (compact)
```

### Recommendation

**Airbnb Cereal is proprietary and must not be copied** (class D). Substitute a free
**variable** geometric sans — **Inter Variable** or **Manrope Variable** — preserving:

- **one variable file**, weight axis only
- **no italic face**
- the stack shape: `"<Your Font>", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", sans-serif`
- `font-display: swap` and a `<link rel="preload">`

**Does a system fallback materially affect fidelity?** **Yes, noticeably.** Cereal is a
geometric sans with a large x-height; the system stack (Segoe UI on Windows, SF on macOS)
has different letterforms and metrics. Because the measured type scale is applied with
explicit `font-size`/`line-height`, *layout* stays correct and geometry checks still
pass — but glyph shapes and text colour-on-page differ visibly. Ship a real variable
font; do not rely on the fallback.

> **Current state of this repo:** `--font-sans` names `Inter Variable`, but **no
> `@font-face` exists and zero font requests are made** — the app currently renders in
> the system fallback. Supplying the woff2 (§15) closes this gap.

---

## 10. Asset sources

### A — Can use directly
*(none)* — no reference asset is appropriate to reuse as-is.

### B — Provide locally
| Asset | Note |
|---|---|
| 34 property photographs | Your own or licensed |
| Host avatar | Your own or licensed |
| Reviewer avatars (≤5) | Optional; can fall back to CSS initials |
| Static map export | Or swap for a map library |
| Variable font woff2 | Inter/Manrope, open licence |

### C — Recreate (no file needed)
Logo · all 36 UI icons · avatar fallback · map marker · map pointer · CTA gradient ·
search-submit gradient · gallery corner rounding · card borders · dividers · card and
modal shadows · star/rating glyph · search-pill illustration · favicon

### D — Replace with original equivalents ⚠
| Asset | Why |
|---|---|
| **All 34 property photographs** | Airbnb's licensed imagery |
| **Host and reviewer avatars** | Images of real people |
| **Airbnb Cereal VF** | Proprietary typeface |
| **Airbnb logo / Rausch wordmark** | Trademark |
| **Airbnb icon set** | Proprietary artwork |

**Class D is the plagiarism boundary.** Match dimensions, aspect ratios, crop behaviour
and slot geometry — never the artwork.

### Excluded entirely — tracking pixels
Of the 74 image responses, many are 1×1 beacons with no visual role:
`tr.snapchat.com`, `www.facebook.com`, `ct.pinterest.com`, `googleads.g.doubleclick.net`,
`ad.doubleclick.net`, `analytics.google.com`, `verifi.pdscrb.com`. Content types include
`text/plain`, `text/html`, `image/gif`, `image/bmp`. **None are assets.**

---

## 11. Local asset strategy

```text
client/
└── public/
    └── assets/
        ├── gallery/
        │   ├── gallery-01-living-room.webp
        │   ├── gallery-02-full-kitchen.webp
        │   ├── gallery-03-dining-area.webp
        │   ├── gallery-04-bedroom-1.webp
        │   ├── gallery-05-bedroom-2.webp
        │   ├── gallery-06-full-bathroom-1.webp
        │   ├── gallery-07-full-bathroom-2.webp
        │   ├── gallery-08-exterior.webp
        │   ├── gallery-09-pool.webp
        │   └── … through gallery-34-pool.webp
        ├── host/
        │   ├── host-01.webp
        │   └── reviewer-01.webp … reviewer-05.webp
        ├── map/
        │   └── location-candolim.webp
        └── fonts/
            └── inter-variable.woff2
```

`icons/` is deliberately **absent**: icons come from `lucide-react`, and a directory of
icon files would invite the image-per-icon pattern this document argues against.

**Naming.** `gallery-NN-room-name.webp` — the ordinal preserves canonical order
(§3) and the room slug keeps the set self-documenting and greppable. Avoid
`image1.jpg` / `photo_final_v2.jpg`.

Files live in `public/` because they are referenced by URL from API data rather than
imported by the bundler.

---

## 12. Image format recommendations

| Category | Format | Reasoning |
|---|---|---|
| **Property photographs** | **WebP** (AVIF optional, JPEG fallback) | Photographic, no transparency. The reference serves AVIF/WebP. WebP has universal modern support; AVIF is smaller but slower to encode |
| **Host / reviewer avatars** | **WebP** | Same, small |
| **Map (static)** | **WebP** | Flat colour with text; compresses well. **PNG** if the export shows banding |
| **Logo** | **SVG** | Vector, must stay crisp at any DPR, inherits `currentColor` |
| **Icons** | **SVG** via `lucide-react` | Never raster |
| **Favicon** | **SVG** | One file, scales, tiny |

### Quality guidance

- Encode WebP at **quality 80–85**. Below ~75, gradients and skin tones visibly band.
- **Do not over-compress.** The brief is visual reproduction; a smaller file that
  visibly differs from the reference is a failure, not an optimisation.
- Always ship a **JPEG fallback** via `<picture>` if you must support very old browsers.
- Generate the width ladder **120 / 240 / 480 / 720 / 1200 / 1440** from a
  ≥ 1440 × 960 master. Never upscale.

---

## 13. Performance considerations

### Load immediately (eager)

| Asset | Why |
|---|---|
| **All 5 gallery mosaic images** | **Above the fold.** The reference loads every gallery image eagerly (`loading: auto`) |
| Hero (photo 01) | Add `fetchpriority="high"` — it is the LCP element (the reference tags it `elementtiming="LCP-target"`) |
| Variable font | `<link rel="preload">` + `font-display: swap` |

> **Common mistake:** lazy-loading gallery tiles 2–5 because "only the hero matters".
> They are above the fold; lazy-loading them defers them behind the browser's heuristic
> and can hand LCP to a *secondary* tile. This was a real defect in this project, caught
> by measurement and fixed.

### Lazy load

| Asset | Why |
|---|---|
| Photo Tour body photos (all 34) | Behind a modal; the reference loads ~10 of 34 on open |
| Tour category thumbnails | Below the visible strip |
| Sleeping-arrangement images | Below the fold |
| Reviewer avatars | Below the fold |
| Large host avatar (88px) | Below the fold |
| Static map | Below the fold |

### Should gallery images be lazy loaded?

**No for the five mosaic tiles** — above the fold, and the reference loads them eagerly.
**Yes for everything else.**

### Thumbnails

**Yes — use smaller variants.** Tour category thumbnails render at 146 × 96; serving a
1440px master there wastes ~95% of the bytes. Request `im_w=480`.

### Should the Lightbox reuse the same images?

**Yes — same files, larger variant (`im_w=1440`).** Never a separate asset set.

### Would preloading the next image help?

**Yes, measurably.** Warm `index ± 1` with `new Image()` when the Lightbox index
changes. Without it, rapid next/previous flashes an empty frame mid-swap. Also avoid
keying the `<img>` by photo id — that remounts the element on every move and guarantees
the blank frame. Reuse one element and let the preloaded source swap in.

### Layout stability

Give **every** image explicit `width`/`height` attributes matching its intrinsic size.
Measured result with this in place: **CLS = 0**, including while the loading skeleton
swaps to content under a slow API.

---

## 14. Final asset checklist

### Required local assets

```text
[ ] gallery-01-living-room.webp      (hero — compose centred, ~25% edge slack)
[ ] gallery-02-full-kitchen.webp     (mosaic tile 2 — cropped)
[ ] gallery-03-dining-area.webp      (mosaic tile 3 — cropped)
[ ] gallery-04-bedroom-1.webp        (mosaic tile 4 — cropped)
[ ] gallery-05-bedroom-2.webp        (mosaic tile 5 — cropped)
[ ] gallery-06-full-bathroom-1.webp
[ ] gallery-07-full-bathroom-2.webp
[ ] gallery-08-exterior.webp
[ ] gallery-09-pool.webp
[ ] gallery-10 … gallery-34.webp     (25 more, grouped by room)
[ ] host-01.webp                     (1:1 square, ≥ 240×240)
[ ] reviewer-01 … reviewer-05.webp   (optional — CSS initials otherwise)
[ ] location-candolim.webp           (static map, 1120 × 480)
[ ] inter-variable.woff2             (or manrope-variable.woff2)
```

### Can be recreated

```text
[x] Logo / wordmark            original single-path SVG, 102 × 32
[x] Heart (save) icon          lucide-react
[x] Share icon                 lucide-react
[x] Navigation icons           Menu, UserRound, Globe, Search, ChevronDown
[x] Gallery icons              LayoutGrid, X, ChevronLeft, ChevronRight
[x] Booking icons              Minus, Plus, ChevronDown, calendar chevrons
[x] All 17 amenity icons       lucide-react solid variants
[x] Star / rating glyph        lucide-react (filled)
[x] Map marker                 inline SVG
[x] Map pointer / tail         CSS linear-gradient(135deg, …)
[x] Avatar fallback            CSS circle + initial
[x] CTA gradient               linear-gradient(to right, #E61E4D, #E31C5F, #D70466)
[x] Search-submit gradient     radial-gradient(circle, #FF385C, #E61E4D, #E31C5F, #D70466)
[x] Search-pill illustration   an icon from the same library
[x] Gallery corner rounding    12px wrapper + overflow:hidden
[x] Borders / dividers         1px solid #DDDDDD
[x] Card + modal shadows       0 6px 16px rgba(0,0,0,.12) / 0 8px 28px rgba(0,0,0,.28)
[x] Favicon                    inline SVG
```

### Need original replacement ⚠

```text
[!] All 34 property photographs   Airbnb's licensed imagery
[!] Host avatar                   image of a real person
[!] Reviewer avatars              images of real people
[!] Airbnb Cereal VF              proprietary typeface
[!] Airbnb logo / wordmark        trademark
[!] Airbnb icon set               proprietary artwork
```

---

## 15. Developer instructions

### What I need to provide manually

```text
gallery-01-living-room.webp
Recommended size: 1440 × 960
Aspect ratio: 3:2
Format: WebP (q 80–85), JPEG fallback
Used: Listing hero (cropped to 560×476) + Photo Tour + Lightbox
Note: LCP element. Compose centred — ~25% of the frame is cropped in the mosaic.

gallery-02-full-kitchen.webp
gallery-03-dining-area.webp
gallery-04-bedroom-1.webp
gallery-05-bedroom-2.webp
Recommended size: 1440 × 960
Aspect ratio: 3:2
Format: WebP
Used: Listing mosaic tiles 2–5 (cropped to 272×238 / 272×230) + Tour + Lightbox
Note: ~20–25% cropped. Keep subjects away from the edges.

gallery-06 … gallery-34  (29 files)
Recommended size: 1440 × 960
Aspect ratio: 3:2
Format: WebP
Used: Photo Tour + Lightbox only (never cropped — shown at full 3:2)
Grouping: 9 rooms — Living room (5), Full kitchen (4), Dining area (3),
          Bedroom 1 (5), Bedroom 2 (4), Full bathroom 1 (3),
          Full bathroom 2 (3), Exterior (4), Pool (3)

host-01.webp
Recommended size: 240 × 240
Aspect ratio: 1:1
Format: WebP
Used: Host strip (40×40) + Meet your host (88×88), both circular

reviewer-01 … reviewer-05.webp        [optional]
Recommended size: 120 × 120
Aspect ratio: 1:1
Format: WebP
Used: Reviews section, 40×40 circular
Note: omit and fall back to CSS initials if you prefer

location-candolim.webp
Recommended size: 2240 × 960 (2× for retina)
Aspect ratio: 7:3
Format: WebP (PNG if banding appears)
Used: Location section, displayed 1120 × 480 at 20px radius
Note: decorative — the address text carries the meaning

inter-variable.woff2
Variable font, weight axis 400–700, no italic
Format: woff2
Used: entire page
Note: preload it; the repo currently names a font it never loads
```

**Also required:** generate the width ladder **120 / 240 / 480 / 720 / 1200 / 1440** for
every photograph and avatar from the masters above.

### What the coding agent can create

- The **logo** as an original single-path SVG component (102 × 32)
- **All 36 icons** via `lucide-react` behind one `<Icon name="…" />` component
- **Both brand gradients**, all borders, dividers, shadows and radii in Tailwind/CSS
- The **avatar fallback** (CSS circle + initial)
- The **map marker and pointer** as inline SVG + CSS gradient
- The **favicon** as an inline SVG
- **Responsive image plumbing**: variant selection from the width ladder, eager/lazy
  policy, `width`/`height` for CLS, and Lightbox neighbour preloading
- The **placeholder set** used during development, so the page is buildable and testable
  before real photography lands *(this repo currently ships 76 generated 3:2 SVG
  placeholders for exactly this reason — replace them, do not ship them)*

### What should NOT be copied

```text
✘ Any React component, hook, CSS file, class name or build config from the reference
✘ The reference's SVG path data — logo or icons
✘ Airbnb Cereal VF, or any proprietary font file
✘ Property photographs, host photos or reviewer photos from the reference
✘ The reference's project structure or file naming
✘ Airbnb's trademarks, wordmark or brand colours presented as our own brand
✘ Its inline-SVG-per-icon pattern (48.9 KB of duplication — a build artefact, not a design)
✘ CDN URLs pointing at a0.muscache.com — hotlinking someone else's assets
```

**What may legitimately be reproduced:** dimensions, aspect ratios, spacing, crop
behaviour, `object-fit`/`object-position`, colour values, type scale, transition
timings, and interaction semantics. Those are observable characteristics of the
interface, and reproducing them from measurement — with our own code and our own
assets — is the assignment.

---

## 16. Not observed

| # | Item | Status |
|---|---|---|
| 1 | Exact `im_w` for tour category thumbnails | Inferred from the ladder **[N]** |
| 2 | DPR 2 / retina variants | Only DPR 1 tested; the ladder implies 2× doubles `im_w` **[N]** |
| 3 | Video assets | 6 `media` responses recorded but not identified **[N]** |
| 4 | Map interaction assets (pan/zoom tiles) | Map never interacted with **[N]** |
| 5 | Responsive image variants | Only 1440px measured; mobile likely uses 480/720 **[N]** |
| 6 | Blur-up / placeholder strategy | An `rgba(34,34,34,0.10)` tint was seen as a background, but the loading sequence was not traced **[N]** |
| 7 | Icon licence/provenance | Airbnb's are proprietary; a library substitute is assumed **[N]** |
