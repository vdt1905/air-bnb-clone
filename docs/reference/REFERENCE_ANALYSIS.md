# Reference Analysis — Airbnb Listing Page (PDP)

## About this document

Observational analysis of the **live Airbnb listing page** (`airbnb.com` / `airbnb.co.in`),
used as the single source of truth for an original implementation.

Only observable output was analysed: rendered geometry, computed styles, and interaction
behaviour. No source code was read, copied, or reproduced.

### Capture conditions

| Item | Value |
|---|---|
| Browser | Chrome (Playwright-driven, real browser) |
| Window viewport | 1440 × 900, DPR 1 |
| Layout viewport | **1424.6px** (15.4px classic scrollbar) |
| Locale / currency | `en` / INR (₹) |
| Date of capture | 2026-09-11 |

### Reference listings sampled

| Purpose | Listing |
|---|---|
| Primary (layout, gallery, photo tour, lightbox) | `1759355047605224205` — *Nest Escape 306 By Casa Cove 2BHK Candolim Beach* (34 photos) |
| Secondary (price, rating, amenities modal) | `1458686848256161074` — *GLOW By Palacio De Goa* (4.84 ★, 76 reviews) |

> **Note on the original brief.** Phase 1 named a Vercel-hosted clone as the reference.
> That deployment is behind Vercel's bot checkpoint and returns HTTP 429 / *"could not be
> verified"* to any automated client, so it could not be measured. Per direction, the
> **original Airbnb site** was analysed instead. All numbers below are measured from
> airbnb.com, not from the clone.

### Confidence legend

- **[M]** Measured — read directly from `getBoundingClientRect()` / `getComputedStyle()`.
- **[V]** Visual — read off a screenshot; accurate to a pixel or two.
- **[N]** Not observed — flagged explicitly; do **not** treat as fact.

---

## 1. Global Layout

| Property | Value |
|---|---|
| Viewport assumption | Desktop-first; measured at 1440px **[M]** |
| Content max width | **1120px**, centered **[M]** |
| Content left offset @1440 | `x = 152.3` (i.e. `(1424.6 − 1120) / 2`) **[M]** |
| Header height | **96px** — page content begins at `y = 96` **[M]** |
| Header/footer page gutter | 48px **[M]** |
| Document height (primary listing) | 5736px **[M]** |
| Body background | `#FFFFFF` **[M]** |
| Body base font-size | 14px **[M]** |

### Two-column structure

Below the gallery the page splits into an asymmetric two-column grid:

| Column | Width | x | Notes |
|---|---|---|---|
| Left (content) | **653.3px** | 152.3 | Overview, host, highlights, description, sleeping, amenities, calendar |
| Gutter | **93.4px** | — | **[M]** |
| Right (booking) | **372.3px** | 899.0 | `<aside>`, sticky |

Sections that span the **full 1120px** (i.e. break out of the two-column grid):
`REVIEWS`, `LOCATION`, `MEET_YOUR_HOST`, `POLICIES`, `SEO_LINKS`.

### Vertical rhythm

| Block | y (page coords) | Height |
|---|---|---|
| Title row | 96 | 54 |
| Gallery | 150 → 174 (images) | 476.1 |
| Overview | 650.1 | 142 (padding `32px 0`) |
| Host overview | 805 | 90 |
| Highlights | 895.9 | 172 |
| Description | 1068.8 | 102 |
| Sleeping arrangement | 1171.7 | 416.4 |
| Amenities | 1589 | 434 |
| Availability calendar | 2023.9 | 516 |
| Reviews | 2540.8 | 404.9 |
| Location | 2946.6 | 702 |
| Meet your host | 3649.4 | 657.8 (padding `40px 0`) |
| Things to know | 4308.1 | 290 |
| SEO links | 4599 | 584.9 |
| Footer | 5183.9 | 552.8 |

Section vertical padding is consistently **32px** (content sections) or **40px**
(host section), with a `1px #DDDDDD` rule between major blocks. **[M]**

### Sticky / fixed elements

| Element | Behaviour |
|---|---|
| Booking `<aside>` | `position: sticky; top: 80px` **[M]** |
| Header | Scrolls away with the page — **not** sticky on the PDP **[M]** |
| Modals | `position: fixed` full-viewport; lock the page (see §12–13) |

---

## 2. Header

Height **96px**, white, full-bleed, with a `1px #DDDDDD` bottom rule. **[M][V]**

| Element | Geometry | Notes |
|---|---|---|
| Logo | SVG **102 × 32** at `x = 48, y = 32` | Rausch wordmark, vertically centered **[M]** |
| Search pill | **375.1 × 46**, `x = 524.7, y = 25` | `border-radius: 40px` **[M]** |
| Search segments | `Anywhere` \| `Anytime` \| `Add guests` | Divided by 1px vertical rules **[V]** |
| Search submit | Circular Rausch button with magnifier, inset at the pill's right end | **[V]** |
| `Become a host` | Text link, ~`x = 1163` | 14px **[V]** |
| Globe button | ~32px circular icon button | Language/region **[V]** |
| Menu button | ~32px circular icon button (hamburger + avatar) | `data-testid="cypress-headernav-profile"` **[M]** |
| Right gutter | 48px | **[M]** |

**Hover — search pill [M]:**

```
transition: box-shadow 0.175s cubic-bezier(0.2, 0, 0, 1);
/* rest */  box-shadow: none;
/* hover */ box-shadow: 0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10);
```

**Scroll behaviour:** the PDP header scrolls out of view with the page; it does not
collapse, shrink, or pin. **[M]**

---

## 3. Listing Header (title row)

Occupies `y = 96 → 150`, full 1120px width. **[M]**

| Element | Style |
|---|---|
| `<h1>` title | **26px / 30px, weight 500**, `letter-spacing: normal`, `#222222`, `margin: 0` **[M]** |
| Alignment | Title left; `Share` + `Save` right-aligned on the same baseline **[V]** |
| `Share` / `Save` | Icon + **underlined** text label, 14px **[V]** |
| Spacing to gallery | 24px (title row ends 150, images start 174) **[M]** |

> **Important layout finding [M]:** in the current Airbnb layout the **rating and review
> count are *not* in the title row.** They sit in the Overview block below the gallery, as
> `★ 4.84 · 76 reviews`. Only title, Share and Save appear above the gallery. A "Guest
> favourite" badge may also appear in the overview area.

---

## 4. Photo Gallery

A 5-image mosaic, **1120 × 476.1**, starting at `y = 174`. **[M]**

### Grid

| Tile | x | y | Width | Height |
|---|---|---|---|---|
| 1 (hero) | 152.3 | 174 | **560** | **476.1** |
| 2 | 720.3 | 174 | 272 | 238.1 |
| 3 | 720.3 | 420.1 | 272 | 230.1 |
| 4 | 1000.3 | 174 | 272 | 238.1 |
| 5 | 1000.3 | 420.1 | 272 | 230.1 |

- **Gap: 8px**, horizontal and vertical. `560 + 8 + 272 + 8 + 272 = 1120` ✓ **[M]**
- Overall aspect ratio ≈ **1120 : 476** (≈ 2.35 : 1) **[M]**
- Effective columns: `1fr` hero (560) + two 272px columns, each split into 2 rows.

### Corners, cropping

| Property | Value |
|---|---|
| Border radius | **12px on the outer wrapper only** (`overflow: hidden`), so only the four *outer* corners of the mosaic are rounded — individual tiles have `border-radius: 0` **[M]** |
| Image fit | `object-fit: cover` **[M]** |
| Object position | `50% 50%` (centered) **[M]** |
| Tile element | Each tile is a `<button>` wrapping `<picture><img>` **[M]** |

### "Show all photos" button

| Property | Value |
|---|---|
| Size | **140.3 × 32** **[M]** |
| Position | Bottom-right of the gallery, **24px inset** from both edges **[M]** |
| Background | `#F2F2F2` **[M]** |
| Radius | `8px` **[M]** |
| Padding | `8px 16px` **[M]** |
| Type | 12px / 16px, weight 500, `#222222` **[M]** |
| Icon | 3×3 grid glyph before the label **[V]** |
| Hover | background `#F2F2F2` → **`#EBEBEB`** **[M]** |
| Transition | `box-shadow .2s, transform .25s, background-color .3s, border-color .3s, color .3s` — all `cubic-bezier(0.2, 0, 0, 1)` **[M]** |

**Click behaviour:** any tile *or* the button opens the Photo Tour modal (§12) and pushes
`?modal=PHOTO_TOUR_SCROLLABLE` onto the URL. **[M]**

> **[N] Not observed:** per-tile hover treatment (dim/scale overlay). The tiles declare no
> transition on the `<img>`, so any hover effect is likely an overlay layer — verify before
> implementing.

---

## 5. Property Information (Overview)

Left column, 653.3px wide, `padding: 32px 0`. **[M]**

```
Entire rental unit in Candolim, India        ← h2, 22px/26px, w500, ls −0.44px
4 guests · 2 bedrooms · 2 beds · 2 bathrooms ← 16px/20px, w400, #222222
★ 4.84 · 76 reviews                          ← rating line (or "New · 1 review")
```

| Property | Value |
|---|---|
| Section heading | 22px / 26px, weight 500, `letter-spacing: -0.44px`, `#222222` **[M]** |
| Stats line | 16px / 20px, weight 400 **[M]** |
| Separator | `·` middle dot with surrounding spaces — **no icons** on this line **[M]** |
| Rating | `★` glyph + numeric rating + `·` + linked review count **[M]** |

### Host overview strip

| Property | Value |
|---|---|
| Position | `y = 805`, height 90, separated by a 1px `#DDDDDD` rule **[M]** |
| Avatar | **40 × 40** **[M]** |
| Text | `Hosted by <Name>` (16px) + `<N> months hosting` in secondary grey **[M][V]** |

---

## 6. Amenities

Heading **"What this place offers"** — 22px / 26px, weight 500. **[M]**

| Property | Value |
|---|---|
| Layout | **2-column grid** inside the 653.3px column **[M]** |
| Column x | 152.3 and 486.9 → column pitch **334.7px**, item width **265.5px** **[M]** |
| Row pitch | **48px** (item height 48, `padding-bottom: 24px`) **[M]** |
| Visible items | **10** before truncation **[M]** |
| Icon | **24 × 24**, left-aligned, inline with the label **[M]** |
| Label | 16px / 20px, `#222222` **[M]** |
| Unavailable items | Rendered with **strikethrough** and greyed (e.g. *Carbon monoxide alarm*) **[M]** |

### "Show all N amenities" button

| Property | Value |
|---|---|
| Size | **205.8 × 48** (width fits content) **[M]** |
| Background | `#F2F2F2`, radius **12px**, padding `14px 24px` **[M]** |
| Type | 16px, weight 500, `#222222` **[M]** |
| Hover | `#F2F2F2` → `#EBEBEB` **[M]** |

### Amenities modal

| Property | Value |
|---|---|
| Size | **780 × 820.2**, at `x = 322.3, y = 40` (centered, 40px viewport margin) **[M]** |
| Background | `#FFFFFF` **[M]** |
| Radius | **32px** **[M]** |
| Shadow | `0 8px 28px rgba(0, 0, 0, 0.28)` **[M]** |
| Overflow | `clip` on the shell; the body scrolls internally **[M]** |
| Close | 16×16 `✕` icon button at `x = 346.3, y = 64` → **24px inset** from the modal **[M]** |
| Content | Amenities grouped under category headings (*Bathroom*, *Bedroom and laundry*, …) **[M]** |
| Page scroll | Locked — `body { overflow: hidden }` **[M]** |

---

## 7. Description

| Property | Value |
|---|---|
| Block | `y = 1068.8`, 653.3 × 102, left column **[M]** |
| Type | **16px / 20px**, weight 400, `#222222` **[M]** |
| Measure | Constrained to the 653.3px column **[M]** |
| Truncation | **[N] Not observed.** Both sampled listings had descriptions short enough not to clamp — no `-webkit-line-clamp` and no "Show more" control was present. |

> Airbnb's description block normally truncates and exposes a **"Show more"** button that
> opens a modal. Treat the exact clamp line-count as **unverified** and confirm against a
> listing with a long description before finalising.

---

## 8. Booking Card

The single highest-value component. `<aside>`, right column. **[M]**

| Property | Value |
|---|---|
| Width | **372.3px** |
| Position | `x = 899`, first top `y = 682.1` |
| Sticky | `position: sticky; top: 80px` (on the wrapper) |
| Border | **`1px solid #DDDDDD`** (computed `0.90566px` — a 1px CSS border at this zoom) |
| Radius | **12px** |
| Shadow | **`0 6px 16px rgba(0, 0, 0, 0.12)`** |
| Padding | **24px** |
| Background | `#FFFFFF` |
| Inner content width | 322.5px (`372.3 − 2×24 − border`) |

### Price

| State | Rendering |
|---|---|
| No dates | `Add dates for prices` — 22px, weight 500 **[M]** |
| Dates set | **`₹35,500`** at **22px, weight 500**, `#222222`; secondary line `₹35,500 for 5 nights` at 16px / 20px, weight 400 **[M]** |
| Unavailable | `Those dates are not available` + a `Change dates` action **[M]** |

### Date fields

Two side-by-side cells forming a bordered box, radius 12px: **[M]**

| Property | Value |
|---|---|
| Cell size | **160.8 × 56** each (`CHECK-IN` / `CHECKOUT`) |
| Padding | `26px 12px 10px` — uppercase label sits above the value |
| Label | Uppercase micro-label (`CHECK-IN`), ~10px, letter-spaced |
| Value | `Add date` placeholder, or `10/10/2026` |

### Guest selector

| Property | Value |
|---|---|
| Size | **322.5 × 60**, full inner width, below the date row **[M]** |
| Content | `GUESTS` micro-label + `1 guest` value + chevron on the right **[M][V]** |

### CTA

| Property | Value |
|---|---|
| Label | `Check availability` (or `Reserve` when dates are set) **[M]** |
| Size | **322.5 × 48** (full inner width) **[M]** |
| Radius | **999px** (pill) **[M]** |
| Background | `linear-gradient(to right, #E61E4D 0%, #E31C5F 50%, #D70466 100%)` **[M]** |
| Type | 16px / 20px, weight 500, `#FFFFFF` **[M]** |
| Padding | `14px 24px` **[M]** |
| Transition | `box-shadow .2s, transform .25s, border-color .3s, color .3s` — `cubic-bezier(0.2, 0, 0, 1)` **[M]** |
| Hover | **[N]** No computed change was detected on hover; the gradient is static. Any hover effect is likely a pseudo-element overlay — verify. |

Below the card, outside its border: a `Report this listing` link, 372.3 × 18. **[M]**

---

## 9. Host Section — "Meet your host"

Full-width (1120px) block, `padding: 40px 0`, total height 657.8. **[M]**

| Element | Value |
|---|---|
| Heading | `Meet your host` — 22px / 26px, weight 500 **[M]** |
| Host card | Left card holding avatar + stats **[V]** |
| Avatar | **88 × 88**, `border-radius: 50%`, `object-fit: cover` **[M]** |
| Host name | **26px / 30px, weight 700**, `letter-spacing: −0.52px` **[M]** |
| Role label | `Host` beneath the name, secondary grey **[M]** |
| Stat rows | `69 Reviews` · `4.67 Rating` · `7 Months hosting`, separated by **96 × 1px `#DDDDDD`** rules **[M]** |
| Right column | Bio text + `Host details` (response rate, response time) at `x = 611.3`, width 555.7 **[M]** |
| Button | `Message host` — secondary style, radius 12px **[V]** |
| Trust note | *"To help protect your payment, always use Airbnb…"* in small secondary text **[M]** |

---

## 10. Location — "Where you'll be"

| Property | Value |
|---|---|
| Section | Full width 1120px, `y = 2946.6`, height 702 **[M]** |
| Heading | `Where you'll be` — 22px / 26px, weight 500 **[M]** |
| Location text | `Candolim, Goa, India` — 16px, below the heading **[M]** |
| Map | **1120 × 480**, `y = 3088.5` **[M]** |
| Map radius | **20px**, `overflow: hidden` **[M]** |
| Marker | Circular highlight over the approximate area **[V]** |

Note the map radius (**20px**) differs from the gallery (12px) and booking card (12px).

---

## 11. Footer

| Property | Value |
|---|---|
| Background | **`#F7F7F7`** **[M]** |
| Width | Full bleed, content gutter 48px **[M]** |
| Height | 552.8 **[M]** |
| Columns | **3**, each **432.2px** wide at `x = 48 / 496.2 / 944.4` → 16px gutters **[M]** |
| Column headings | `Support`, `Hosting`, `Airbnb` **[M]** |
| Items per column | 7 / 10 / 5 **[M]** |
| Links | **14px / 18px**, `#222222`, `text-decoration: none` **[M]** |
| Link hover | **underline** (colour unchanged) **[M]** |
| Bottom bar | `© 2026 Airbnb, Inc. · Privacy · Terms · Company details` on the left; `English (IN)`, `₹ INR` on the right **[M]** |
| Divider | 1px `#DDDDDD` above the bottom bar **[V]** |

Above the footer sits an **SEO links** block (`Explore other options in and around …`) —
full width, heading 22px/26px w500, multi-column link grid, height 584.9. **[M]**

---

## 12. Photo Tour

Opened by the gallery tiles or "Show all photos". **[M]**

| Property | Value |
|---|---|
| URL | Pushes `?modal=PHOTO_TOUR_SCROLLABLE` **[M]** |
| Shell | `[role="dialog"]`, `aria-modal="true"`, **full viewport 1425 × 900.2** **[M]** |
| Background | **`#FFFFFF`** (not a dark overlay) **[M]** |
| Radius | 0 — edge-to-edge **[M]** |
| Scroll lock | `body { overflow: hidden; position: fixed }`, `window.scrollY` pinned to 0 **[M]** |
| Initial focus | Moves to the **Close** button **[M]** |

### Layout

| Region | Detail |
|---|---|
| Top bar | `Close` (`✕` + label) at `x = 24, y = 24`; `Share` (77.1 × 34) and `Save` (71 × 34) at the right, radius 8px **[M]** |
| Heading | `Photo tour` **[M]** |
| Category strip | Room thumbnails **146.3 × 96.2**, **16px gaps**, **7 per row**, wrapping. Each is a button labelled `Scroll to <Room>` (e.g. *Living room*, *Full kitchen*, *Bedroom 1*, *Pool*) **[M]** |
| Body | Vertically scrolling sections, one per room, each with a heading, sub-details (e.g. `King bed`, `Air conditioning · TV`) and large photos **[M]** |
| Large photos | e.g. **741.3 × 496.7**, `object-fit: cover`, radius 0 **[M]** |
| Photo count | 21 `<img>` in the tour body for a 34-photo listing (lazy-loaded) **[M]** |

### Interactions

| Action | Result |
|---|---|
| Click category thumbnail | Smooth-scrolls the modal body to that room section **[M]** |
| Scroll | Scrolls **inside** the dialog; the page beneath does not move **[M]** |
| Click a large photo | Opens the Lightbox (§13) **[M]** |
| `Escape` | Closes the tour and restores page scroll **[M]** |
| Transition | `transform .25s cubic-bezier(0.2, 0, 0, 1)` on the close control **[M]** |

---

## 13. Lightbox

Opened by clicking a photo **inside** the Photo Tour. Stacks *on top of* the tour —
three dialogs are live at once. **[M]**

| Property | Value |
|---|---|
| URL | Appends `&modalItem=<photoId>` **[M]** |
| Background | **Black (`#000`)**, fully opaque, full viewport **[M][V]** |
| Image size | **1233 × 676.2** at `x = 96, y = 112` **[M]** |
| Image insets | **96px** left/right, **112px** top/bottom (symmetric) **[M]** |
| Image fit | **`object-fit: contain`**, `object-position: 50% 50%`, radius 0 **[M]** |

### Controls

| Control | Geometry | Style |
|---|---|---|
| Close | `x = 40, y = 40`, 89 × 34 | `✕` icon **+ "Close" label**, white, radius 8px **[M][V]** |
| Counter | Top-centre | **`1 / 34`**, white; screen-reader text `Showing photo 1 of 34` **[M]** |
| Share | `x = 1333, y = 46.7` | 16×16 icon, circular **[M]** |
| Save | `x = 1369, y = 46.7` | 16×16 heart, circular **[M]** |
| Previous | `x = 47.5, y = 442.6` | Circular white button, chevron, vertically centered **[M][V]** |
| Next | `x = 1365.5, y = 442.6` | Circular white button, chevron, vertically centered **[M][V]** |

`Previous` is **absent on the first photo** and appears from photo 2 onward. **[M]**

### Keyboard & focus

| Key | Behaviour |
|---|---|
| `→` | Next photo — counter `1 / 34` → `2 / 34`, URL `modalItem` updates **[M]** |
| `←` | Previous photo **[M]** |
| `Escape` | Closes **the lightbox only**, returning to the Photo Tour (3 dialogs → 2). A **second** `Escape` closes the tour and returns to the page **[M]** |
| Scroll lock | `body { overflow: hidden }` throughout **[M]** |
| Transition | `transform .25s cubic-bezier(0.2, 0, 0, 1)` on the nav controls **[M]** |

---

## 14. Typography

**Family [M]:**

```css
font-family: "Airbnb Cereal VF", Circular, -apple-system, BlinkMacSystemFont,
             Roboto, "Helvetica Neue", sans-serif;
```

Airbnb Cereal is proprietary. An original implementation should pick a close geometric
sans (e.g. Inter, Manrope) and keep the *scale* below intact.

| Role | Size / Line-height | Weight | Letter-spacing |
|---|---|---|---|
| Page title (`h1`) | **26 / 30** | 500 | normal |
| Reviews heading | 26 / 30 | 500 | −0.52px |
| Host name | 26 / 30 | **700** | −0.52px |
| Section heading (`h2`) | **22 / 26** | 500 | **−0.44px** (−2%) |
| Price | 22 | 500 | normal |
| Body / amenities / stats | **16 / 20** | 400 | normal |
| Large button label | 16 / 20 | 500 | normal |
| Body base, footer links | **14 / 18** | 400 | normal |
| Small button label | **12 / 16** | 500 | normal |

Two rules worth copying exactly: headings are **500, never 600/700** (except the host
name), and the **16/20 body** ratio is a tight 1.25 line-height, not the usual 1.5.

---

## 15. Colors

| Role | Value | Evidence |
|---|---|---|
| Primary text | **`#222222`** `rgb(34,34,34)` | 309 nodes **[M]** |
| Secondary text | **`#6C6C6C`** `rgb(108,108,108)` | 113 nodes **[M]** |
| Tertiary text | `#8C8C8C` `rgb(140,140,140)` | **[M]** |
| Disabled text | `#D1D1D1` `rgb(209,209,209)` | e.g. unavailable calendar dates **[M]** |
| Border / divider | **`#DDDDDD`** `rgb(221,221,221)` | 1px rules, card borders **[M]** |
| Page background | `#FFFFFF` | **[M]** |
| Footer / subtle surface | **`#F7F7F7`** `rgb(247,247,247)` | **[M]** |
| Secondary button surface | **`#F2F2F2`** `rgb(242,242,242)` | **[M]** |
| Secondary button hover | **`#EBEBEB`** `rgb(235,235,235)` | **[M]** |
| Dark surface (dark buttons) | `#222222` | **[M]** |
| Brand gradient (primary CTA) | `#E61E4D → #E31C5F → #D70466` | **[M]** |
| Brand solid (badges, search submit) | `#DA1249` `rgb(218,18,73)` | **[M]** |
| Scrim / overlay | `rgba(0,0,0,0.25)` | **[M]** |
| Image placeholder tint | `rgba(34,34,34,0.10)` | **[M]** |
| Lightbox background | **`#000000`** opaque | **[M][V]** |
| Modal shadow | `rgba(0,0,0,0.28)` | **[M]** |
| Card shadow | `rgba(0,0,0,0.12)` | **[M]** |

---

## 16. Animations

Airbnb uses **one easing curve** almost everywhere:

```css
cubic-bezier(0.2, 0, 0, 1)
```

| Target | Transition |
|---|---|
| Search pill | `box-shadow 0.175s` **[M]** |
| Buttons (secondary) | `box-shadow .2s, transform .25s, background-color .3s, border-color .3s, color .3s` **[M]** |
| Primary CTA | `box-shadow .2s, transform .25s, border-color .3s, color .3s` **[M]** |
| Icon buttons (close, prev/next) | `transform 0.25s` **[M]** |
| Small icon buttons (share/save in tour) | `box-shadow .2s, transform .1s` **[M]** |

**Durations cluster at 0.1s / 0.175s / 0.2s / 0.25s / 0.3s.** Nothing measured runs longer
than 300ms.

| Effect | Observed |
|---|---|
| Secondary button hover | Background `#F2F2F2` → `#EBEBEB` over 0.3s **[M]** |
| Footer link hover | Underline appears, colour unchanged **[M]** |
| Search pill hover | Shadow fades in over 0.175s **[M]** |
| Modal open/close | **[N]** Entry/exit animation not captured — likely a fade + slight scale; verify |
| Lightbox photo change | **[N]** Whether the swap is instant or cross-fades was not captured |
| Scroll effects | None on the PDP — no parallax, no header collapse **[M]** |

---

## Critical Visual Anchors

The ten elements that must be pixel-accurate. Ordered by how visible an error would be.

1. **Gallery mosaic** — 1120 × 476.1; `560 + 8 + 272 + 8 + 272`; **8px** gaps; **12px**
   radius on the *outer wrapper only*; `object-fit: cover`.
2. **Content column system** — 1120px max-width centered; 653.3 / **93.4** gutter / 372.3.
   Every section aligns to `x = 152.3` at 1440px.
3. **Booking card** — 372.3px wide, `1px solid #DDDDDD`, **12px** radius,
   `0 6px 16px rgba(0,0,0,0.12)`, **24px** padding, `sticky top: 80px`.
4. **Primary CTA** — 48px tall, **999px** pill, gradient `#E61E4D → #E31C5F → #D70466`,
   16px/500 white.
5. **Type scale** — `h1` 26/30 **w500**; `h2` 22/26 w500 **ls −0.44px**; body 16/20.
   Heading weight 500 (not 600/700) is the single most commonly-missed detail.
6. **Header** — 96px tall, 1px `#DDDDDD` bottom rule, logo 102 × 32 at `x = 48`,
   search pill 375 × 46 at `radius 40px`.
7. **"Show all photos" button** — 140.3 × 32, `#F2F2F2`, **8px** radius, 12px/500,
   **24px** inset from the gallery's bottom-right.
8. **Colour pair `#222222` / `#6C6C6C`** — the entire page is these two greys on white;
   getting the secondary grey wrong changes the page's whole temperature.
9. **Map block** — 1120 × 480 at **20px** radius (deliberately *not* 12px).
10. **Amenities grid** — 2 columns, 334.7px pitch, 48px row pitch, 24px icons, 10 items
    before the "Show all N" button.

---

## Critical Behaviours

The ten interactions that must match.

1. **Gallery → Photo Tour.** Any tile or "Show all photos" opens a full-viewport **white**
   modal and pushes `?modal=PHOTO_TOUR_SCROLLABLE`.
2. **Photo Tour → Lightbox.** Clicking a large photo in the tour opens a **black**
   full-screen lightbox *over* the tour and appends `&modalItem=<id>`.
3. **Two-stage Escape.** `Escape` in the lightbox returns to the Photo Tour; a second
   `Escape` closes the tour and returns to the page. This layering is easy to get wrong.
4. **Lightbox keyboard nav.** `←` / `→` move between photos; the counter (`2 / 34`) and the
   URL's `modalItem` both update.
5. **Scroll locking.** While any modal is open: `body { overflow: hidden; position: fixed }`
   and `scrollY` is pinned. The page must return to its exact prior scroll position on close.
6. **Focus management.** Opening the Photo Tour moves focus to **Close**. Focus must be
   trapped in the modal and restored to the trigger on close.
7. **Sticky booking card.** Sticks at `top: 80px`, scrolling with the left column and
   stopping before the full-width Reviews section.
8. **Conditional Previous control.** The lightbox's `Previous` button is **absent on the
   first photo** and appears from photo 2 onward.
9. **Progressive disclosure.** Amenities show 10, then a "Show all N amenities" button opens
   a 780px-wide, **32px**-radius modal with category-grouped content and internal scrolling.
10. **Hover vocabulary.** Secondary buttons `#F2F2F2 → #EBEBEB`; footer links gain an
    underline; the search pill gains `0 8px 24px rgba(0,0,0,0.10)` — all on
    `cubic-bezier(0.2, 0, 0, 1)` at ≤300ms.

---

## Open Items for Verification

Carry these into Phase 2 rather than guessing:

| # | Item | Why it's open |
|---|---|---|
| 1 | Description clamp + "Show more" | Sampled listings had short descriptions; no clamp rendered **[N]** |
| 2 | Gallery tile hover treatment | No transition on the `<img>`; effect is probably an overlay layer **[N]** |
| 3 | Primary CTA hover | No computed style change detected; likely a pseudo-element **[N]** |
| 4 | Modal enter/exit animation | Captured only in steady state **[N]** |
| 5 | Responsive breakpoints | Only 1440px was measured. Tablet/mobile layouts (gallery collapse, bottom booking bar) are **entirely unmeasured** **[N]** |
| 6 | "Guest favourite" badge | Not present on the sampled listings **[N]** |
| 7 | Reviews grid | Measured as a block (1120 × 404.9); per-card geometry not captured **[N]** |
