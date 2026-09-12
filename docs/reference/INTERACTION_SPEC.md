# Interaction Specification — Airbnb Listing Page

Companion to [REFERENCE_ANALYSIS.md](./REFERENCE_ANALYSIS.md). That document describes what
the page **looks like**; this one describes what it **does**.

## Scope and method

Every behaviour below was executed against the live reference in a real Chrome instance and
recorded from the DOM: dialog count, `location.search`, `document.activeElement`,
`body` overflow/position, `window.scrollY`, and computed styles before and after each action.

| Item | Value |
|---|---|
| Viewport | 1440 × 900 (layout 1424.6px) |
| Session state | **Logged out** — this materially changes `Save` and `Message host` |
| Listings | `1759355047605224205` (34 photos), `1458686848256161074` (priced, 4.84★), `1366334327879894384` (long description) |
| Date | 2026-09-11 |

### Confidence legend

- **[M]** Measured — the action was performed and the resulting state read from the DOM.
- **[M‑neg]** Measured negative — the action was performed and **no change** was detectable.
  This is a finding, not a gap: do not implement an effect here.
- **[N]** Not observed — never treat as fact.

---

## 0. Shared contracts

Three contracts recur across every overlay. Implement them once.

### 0.1 Overlay classes

The reference uses three distinct overlay types with different rules:

| Type | Scroll lock | URL change | Focus moved | Dismiss | Examples |
|---|---|---|---|---|---|
| **Modal** | Yes — `body { overflow: hidden; position: fixed }` | Sometimes | Yes, into dialog | `Escape`, Close | Photo Tour, Lightbox, Amenities, Description, Share, Login |
| **Popover** | **No** | No | Into the field | `Escape` | Date picker, Guest stepper, Account menu |
| **Inline expansion** | No | No | Into the control | `Escape` | Header search bar |

### 0.2 Scroll-lock contract **[M]**

While any *modal* is open:

```
body { overflow: hidden; position: fixed }
window.scrollY === 0          // the page is pinned
```

On close, `overflow: visible`, `position: static`, and **the prior scroll offset is
restored exactly** — verified: `scrollY` 1501 before the Amenities modal, 1501 after. **[M]**

Popovers do **not** lock scroll — `body` stays `overflow: visible / position: static`. **[M]**

### 0.3 Focus contract **[M]**

| Stage | Behaviour |
|---|---|
| On open | Focus moves into the dialog — to the **Close** button (Photo Tour) or to the **dialog container** (Amenities, Description, Share, Lightbox) |
| While open | Focus is **trapped**; `Tab` from the last control **wraps to the first** |
| On close | Focus is **restored to the element that opened the overlay** |

Restoration was confirmed for every modal tested:

| Overlay | Focus after `Escape` |
|---|---|
| Photo Tour | `BUTTON "Show all photos"` **[M]** |
| Amenities | `BUTTON "Show all 16 amenities"` **[M]** |
| Description | `BUTTON "Show more about this place"` **[M]** |
| Lightbox | Returns to the Photo Tour, focus on the last-focused tour control **[M]** |

### 0.4 Motion contract **[M]**

One easing curve sitewide: `cubic-bezier(0.2, 0, 0, 1)`. Durations: 0.1s / 0.175s / 0.2s /
0.25s / 0.3s. Nothing exceeds 300ms.

---

## 1. Listing Page

### 1.1 Summary table

| # | Element | Trigger | Modal | URL change | Scroll locked | Focus result |
|---|---|---|---|---|---|---|
| 1 | Logo | click | No | → `/` | No | navigates **[N]** |
| 2 | Search pill (container) | click | No | No | No | **no effect [M‑neg]** |
| 3 | Search segment | click | No | No | No | expands search bar **[M]** |
| 4 | Account menu | click | No | No | No | dropdown **[M]** |
| 5 | Share | click | **Yes** | No | **Yes** | dialog **[M]** |
| 6 | Save | click | **Yes** (login) | No | **Yes** | dialog **[M]** |
| 7 | Gallery tile | click | **Yes** | `?modal=PHOTO_TOUR_SCROLLABLE` | **Yes** | Close btn **[M]** |
| 8 | Gallery tile | hover | — | — | — | **darkening scrim** — see §1.5 correction |
| 9 | Show all photos | click | **Yes** | `?modal=PHOTO_TOUR_SCROLLABLE` | **Yes** | Close btn **[M]** |
| 10 | Show all N amenities | click | **Yes** | No | **Yes** | dialog **[M]** |
| 11 | Show more (description) | click | **Yes** | `?modal=DESCRIPTION` | **Yes** | dialog **[M]** |
| 12 | CHECK-IN / CHECKOUT | click | No | No | **No** | popover + input **[M]** |
| 13 | GUESTS | click | No | No | **No** | stepper popover **[M]** |
| 14 | Primary CTA | click | No | No | No | scrolls to calendar **[M]** |
| 15 | Footer link | click | No | → new route | No | same-tab navigation **[M]** |
| 16 | Footer link | hover | — | — | — | underline **[M]** |

---

### 1.2 Header controls

#### Search pill — container **[M‑neg]**

| Property | Value |
|---|---|
| Trigger | Click on `[data-testid="little-search"]` |
| Result | **Nothing.** No dialog, no expansion, no URL change, focus stays on `BODY` |

The pill container is not itself the trigger — the **segments** are.

#### Search pill — segment **[M]**

| Property | Value |
|---|---|
| Trigger | Click `Anywhere` / `Anytime` / `Add guests` |
| Initial | Compact pill, 375.1 × 46, `border-radius: 40px` |
| Result | Expands into a **full search bar: 850 × 66 at `x = 287, y = 102`**, `border-radius: 100px` |
| Shadow | `0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10)` |
| Transition | `box-shadow 0.175s cubic-bezier(0.2, 0, 0, 1)` |
| URL | Unchanged |
| Scroll | **Not** locked |
| Keyboard | `Escape` collapses it |

The expansion renders *below* the header line (`y = 102` vs. the pill's `y = 25`), overlaying
the page rather than pushing content.

#### Account menu **[M]**

| Property | Value |
|---|---|
| Trigger | Click `[data-testid="cypress-headernav-profile"]` |
| Result | Dropdown panel, **265 × 277 at `x = 1112, y = 84`** |
| Radius | `12px` |
| Shadow | `0 2px 16px rgba(0, 0, 0, 0.12)` |
| Items | `Help Centre`, `Become a host`, `Refer a host`, `Find a co-host`, `Log in or sign up` |
| Semantics | **No `role="menu"`** — it is a plain positioned panel **[M]** |
| URL / scroll | Unchanged / not locked |
| Keyboard | `Escape` closes |

#### Hover — search pill **[M]**

```
rest:  box-shadow: none;
hover: box-shadow: 0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10);
transition: box-shadow 0.175s cubic-bezier(0.2, 0, 0, 1);
```

> **[N] Not observed:** logo navigation target, `Become a host`, and the globe/language button.

---

### 1.3 Share

| Property | Value |
|---|---|
| Trigger | Click `Share` in the title row |
| Result | **Modal, 568 × 544 at `x = 428, y = 178`** (centered) |
| Radius | `32px` |
| Shadow | `0 8px 28px rgba(0, 0, 0, 0.28)` |
| Background | `#FFFFFF` |
| Heading | `Share this place` + a listing summary line (`Apartment in Candolim · ★4.84 · 2 bedrooms · 3 beds · 2 bathrooms`) |
| Options | `Copy Link`, `Email`, `Messages`, `WhatsApp`, `Messenger`, `Facebook`, `Twitter` |
| URL | **Unchanged** |
| Scroll | **Locked** (`overflow: hidden`, `position: fixed`) |
| Focus on open | Dialog container |
| `Escape` | Closes; dialog count 2 → 1 **[M]** |

---

### 1.4 Save

| Property | Value |
|---|---|
| Trigger | Click `Save` (`aria-label="Add to wishlist"`) |
| Result **logged out** | **Login modal — `Log in or sign up`, 480 × 488 at `x = 472, y = 206`** |
| Radius | `32px` |
| Shadow | `0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10)` |
| Content | `Phone number or email` field + `Continue` + `or` divider (social options) |
| URL | Unchanged |
| Scroll | **Locked** |
| `Escape` | Closes **[M]** |

> **[N] Not observed:** the logged-in path (heart fill toggle, wishlist picker). The button
> already exposes `data-testid="pdp-save-button-unsaved"`, implying a saved counterpart,
> but that state was never rendered.

---

### 1.5 Gallery

#### Tile hover — **darkening scrim** *(corrected)*

Hovered tile 2 with a real mouse and re-read the image's computed style:

| Property | Rest | Hover |
|---|---|---|
| `transform` | `none` | `none` |
| `filter` | `none` | `none` |
| `opacity` | `1` | `1` |
| Overlay child background | none | none |

> **Correction.** The reading above was a FALSE NEGATIVE. It sampled `transform`,
> `filter` and `opacity` on the `<img>` and the background of any child `<div>` — but the
> reference applies the effect on a **separate overlay layer**, which none of those probes
> reach. Reference screenshots show the tile darkening on hover. This is the same blind
> spot already flagged for the primary CTA (§1.8).
>
> **Implement a subtle darkening scrim** (~10% black) over the tile on hover, at 0.3s on
> the sitewide curve. Do NOT scale, zoom or filter the image itself — those properties
> genuinely are unchanged.
>
> **Lesson for future measurement:** `getComputedStyle` on an element cannot see effects
> applied by pseudo-elements or sibling overlay layers. A negative result there means
> "not on this element", not "not present".

#### Tile click **[M]**

| Property | Value |
|---|---|
| Trigger | Click any of the 5 tiles (each is a `<button>`) |
| Result | Opens the **Photo Tour** (§2) |
| URL | `?modal=PHOTO_TOUR_SCROLLABLE` |
| Scroll | Locked |
| Focus | Moves to the tour's `Close` button |

Verified that a tile click and the `Show all photos` button produce the **identical** state —
same dialog, same URL, same focus target. **[M]**

#### "Show all photos" **[M]**

| Property | Value |
|---|---|
| Rest | `background: #F2F2F2`, `border-radius: 8px`, 12px/500 |
| Hover | `background: #EBEBEB` |
| Transition | `box-shadow .2s, transform .25s, background-color .3s, border-color .3s, color .3s` |
| Click | Same as tile click above |

---

### 1.6 Amenities — "Show all N amenities"

| Property | Value |
|---|---|
| Trigger | Click the button |
| Rest → hover | `#F2F2F2` → `#EBEBEB` over 0.3s |
| Result | **Modal, 780 × 820 at `x = 322, y = 40`** |
| Radius | `32px` |
| Shadow | `0 8px 28px rgba(0, 0, 0, 0.28)` |
| Heading | `What this place offers` |
| Content | Category groups — `Bathroom`, `Bedroom and laundry`, `Entertainment`, … each with items |
| Overflow | Shell is `clip`; the body scrolls internally |
| URL | **Unchanged** |
| Scroll | **Locked** |
| Focus on open | Dialog container (`DIV "What this place offers"`) |
| `Tab` (1st) | `BUTTON "Close"` — trapped inside |
| `Escape` | Closes, restores scroll to **1501** (exact), focus → `BUTTON "Show all 16 amenities"` **[M]** |

---

### 1.7 Description — "Show more"

Present only when the description exceeds the clamp. Two of five sampled listings had
descriptions too short to truncate; listing `1366334327879894384` (510 chars) truncates.

#### Truncated state **[M]**

```css
-webkit-line-clamp: 8;
display: flow-root;
overflow: clip;
```

#### The control **[M]**

| Property | Value |
|---|---|
| Label | `Show more` |
| `aria-label` | `Show more about this place` |
| Type | 16px, weight **500** |
| `text-decoration` | **`none`** (computed) — it is *not* underlined at rest |

#### Click result **[M]**

| Property | Value |
|---|---|
| Result | **Modal, 780 × 438 at `x = 322, y = 231`** |
| Radius | `32px` |
| Shadow | `0 8px 28px rgba(0, 0, 0, 0.28)` |
| Heading | `About this space` |
| Content | Full description with sub-headings (`The space`, …) |
| URL | **`?modal=DESCRIPTION`** |
| Scroll | **Locked** |
| Focus on open | Dialog container (`DIV "About this space"`) |
| `Escape` | Closes; focus → `BUTTON "Show more about this place"` **[M]** |

Note this modal shares the Amenities modal's **780px width, 32px radius and shadow**, but
is height-fitted to content (438 vs 820) and vertically centered.

---

### 1.8 Booking controls

#### CHECK-IN / CHECKOUT **[M]**

| Property | Value |
|---|---|
| Trigger | Click either date cell |
| Result | **Floating date-picker panel, 661 × 466 at `x = 618, y = 810`** |
| Radius | `16px` |
| Shadow | `0 6px 20px rgba(0, 0, 0, 0.20)` |
| Background | `#FFFFFF` |
| Focus | Moves to an `<input>` inside the field |
| URL | **Unchanged** |
| Scroll | **NOT locked** — `body` stays `overflow: visible`, `position: static` |
| Dialog | **None** — this is a popover, not `role="dialog"` |
| `Escape` | Closes; focus → `BUTTON "Change dates; Check-in: …; Checkout: …"` **[M]** |

The panel (661px) is **wider than the booking card** (372.3px) and is left-anchored to
`x = 618`, so it overhangs the card toward the page centre.

An **inline** availability calendar also exists lower in the left column
(`AVAILABILITY_CALENDAR_INLINE`), independent of this popover. **[M]**

#### GUESTS **[M]**

| Property | Value |
|---|---|
| Trigger | Click the `GUESTS` row |
| Result | Stepper popover |
| Rows | `Adults`, `Children`, `Infants` (and typically `Pets`) |
| Controls | Circular buttons, `border-radius: 50%` |
| `aria-label` | `Increase Adults` / `Decrease Adults`, etc. |
| Disabled state | `disabled` is set at the minimum; border colour `rgb(193,193,193)` = `#C1C1C1` vs `#222222` when enabled |
| URL / scroll | Unchanged / not locked |
| `Escape` | Closes |

#### Primary CTA **[M]**

| Property | Value |
|---|---|
| Label | `Check availability` (no dates) / `Reserve` (dates set) |
| Click result | **No modal.** Scrolls the page (1501 → 1510) and moves focus into the check-in `<input>` — i.e. it sends the user to the date selection |
| URL | Unchanged |
| Scroll | Not locked |
| Hover | **[M‑neg]** No computed change — `background-image`, `background-color`, `box-shadow` and `transform` are identical at rest and on hover |
| Declared transition | `box-shadow .2s, transform .25s, border-color .3s, color .3s` |

> The CTA declares transitions it never visibly uses in the state sampled. If a hover effect
> exists it is applied via a pseudo-element, which `getComputedStyle` on the element cannot
> see. Treat CTA hover as **unresolved** rather than absent.

#### Rare-find banner **[M]**

A small `role="dialog"` (372 × 52, radius 12px, `0 6px 16px rgba(0,0,0,0.12)`) sits at the
top of the booking column reading *"Rare find! This place is usually booked."* It is
present on load and is **not** an overlay — note it so it is not mistaken for a modal when
counting dialogs.

---

### 1.9 Host controls

> **[N] Not observed.** `Message host` was not activated. Logged out, it most likely opens
> the same login modal as `Save`, but that was not verified — do not specify it as fact.

---

### 1.10 Footer

| Property | Value |
|---|---|
| Links | Plain anchors, e.g. `href="/help/home?from=footer"` |
| `target` | `null` → **same-tab navigation** **[M]** |
| Rest | `color: #222222`, `text-decoration: none` |
| Hover | **`text-decoration: underline`**, colour unchanged **[M]** |
| Modal / scroll lock | None |

---

## 2. Photo Tour

### 2.1 Opening **[M]**

| Property | Value |
|---|---|
| Triggers | Any gallery tile, **or** the `Show all photos` button — identical result |
| URL | Pushes **`?modal=PHOTO_TOUR_SCROLLABLE`** |
| Shell | `[role="dialog"]`, `aria-modal="true"`, **full viewport 1425 × 900** |
| Background | **`#FFFFFF`** — a white full-screen page, *not* a dark scrim |
| Radius / shadow | `0` / `none` — edge-to-edge |
| Dialog count | 1 → **2** (the rare-find banner is the first) |
| Body | `overflow: hidden; position: fixed`, `scrollY` pinned to 0 |
| Focus on open | **`BUTTON "Close"`** |
| Entry animation | **[N]** Sampled at steady state (`opacity: 1`, `transform: none`, `animation: none`); any entry transition was not captured |

### 2.2 Layout regions **[M]**

| Region | Detail |
|---|---|
| Top bar | `Close` (✕ + label) at `x = 24, y = 24`; `Share` (77.1 × 34) and `Save` (71 × 34) right-aligned, radius 8px |
| Heading | `Photo tour` |
| Category strip | Room thumbnails **146.3 × 96.2**, **16px gaps**, **7 per row**, wrapping |
| Body | One section per room: heading, sub-details (`King bed`, `Air conditioning · TV`), and large photos ≈ **741.3 × 496.7**, `object-fit: cover` |

### 2.3 Scrolling **[M]**

| Property | Value |
|---|---|
| Wheel over the dialog | Scrolls the **dialog body** |
| Page beneath | Does not move — `scrollY` stays 0 |
| Category thumbnail click | `aria-label="Scroll to <Room>"` — scrolls the body to that room's section |

Thumbnails are **navigation**, not photo triggers. Clicking one moves the scroll position;
it does **not** open the lightbox. This is an easy behaviour to get wrong.

### 2.4 Image click **[M]**

Clicking a **large photo in the body** opens the Lightbox (§3), stacking a third dialog on
top. Dialog count 2 → 3.

### 2.5 Hover **[M‑neg] / [N]**

No hover effect was detected on tour thumbnails. The `Share`/`Save` buttons declare
`box-shadow .2s, transform .1s` and the close control declares `transform 0.25s`, both on
`cubic-bezier(0.2, 0, 0, 1)`; the resulting visual states were **[N]** not captured.

### 2.6 Keyboard and focus **[M]**

| Key | Behaviour |
|---|---|
| On open | Focus → `Close` |
| `Tab` | `Close → Share → Save → Scroll to Living room → Scroll to Full kitchen → …` |
| Trap | **Every** tabbed element reported `inDialog: true` across 8 presses — focus never escapes |
| `Escape` | Closes the tour, clears `?modal=`, unlocks body, **restores focus to `Show all photos`** |

### 2.7 Body scroll **[M]**

Locked on open (`overflow: hidden`, `position: fixed`); fully restored on close
(`overflow: visible`, `position: static`, prior offset returned).

---

## 3. Lightbox

### 3.1 Open **[M]**

| Property | Value |
|---|---|
| Trigger | Click a large photo **inside the Photo Tour** — it is not reachable from the listing page directly |
| URL | Appends **`&modalItem=<photoId>`** (e.g. `…&modalItem=2798062073`) |
| Dialogs | 2 → **3** — it stacks *over* the tour; the tour is not unmounted |
| Background | **Black `#000`**, fully opaque, full viewport — *this build overrides it to white by product decision; controls are ink-on-white and the nav circles carry a hairline border + shadow. See Lightbox.jsx.* |
| Image | **1233 × 676.2** at `x = 96, y = 112` — insets 96px L/R, 112px T/B |
| Fit | **`object-fit: contain`**, `object-position: 50% 50%`, radius 0 |
| Focus on open | The dialog container (`DIV "Photo tour"`) |

### 3.2 Controls **[M]**

| Control | Geometry | Notes |
|---|---|---|
| Close | `x = 40, y = 40`, 89 × 34 | ✕ icon **+ "Close" label**, white, radius 8px |
| Counter | top-centre | `1 / 34` |
| Share | `x = 1333, y = 46.7`, 16 × 16 | circular |
| Save | `x = 1369, y = 46.7`, 16 × 16 | circular |
| Previous | `x = 47.5, y = 442.6` | **absent on photo 1** |
| Next | `x = 1365.5, y = 442.6` | vertically centered |

### 3.3 Counter **[M]**

| Property | Value |
|---|---|
| Visible | `1 / 34` — current / total |
| Accessible | A separate `aria-live="polite"` region announcing **`Showing photo 1 of 34`** |
| Updates | On every navigation, together with the URL's `modalItem` |

Two live regions (`polite`, `assertive`) exist but only the polite one carries the count.

### 3.4 Navigation **[M]**

| Action | Counter | URL |
|---|---|---|
| Open | `1 / 34` | `modalItem=2798062073` |
| `ArrowRight` | `2 / 34` | `modalItem=2798062096` |
| `ArrowLeft` | `1 / 34` | reverts |

`Previous` renders only from photo 2 onward — confirmed by the `Tab` order, which lists
`Next` but no `Previous` while on photo 1.

### 3.5 Focus trapping **[M]**

Tab order on photo 1, seven presses:

```
Close → Share → Save → (image region) → Next → Close → Share
                                                 ↑ wraps
```

Every element reported `inDialog: true`. The cycle **wraps from the last control back to
Close**, confirming a closed trap.

### 3.6 Escape — two-stage **[M]**

This is the single most important behaviour to replicate exactly:

| Press | Dialogs | URL | Body | Focus |
|---|---|---|---|---|
| *(lightbox open)* | 3 | `…&modal=PHOTO_TOUR_SCROLLABLE&modalItem=…` | locked | in lightbox |
| **1st `Escape`** | **2** | `…&modal=PHOTO_TOUR_SCROLLABLE` — `modalItem` dropped | **still locked** | `BUTTON "Scroll to Full bathroom 1"` — the tour control focused before opening |
| **2nd `Escape`** | **0** | `?adults=2&locale=en` — `modal` dropped | **unlocked** | `BUTTON "Show all photos"` |

`Escape` closes **one layer at a time**. The body stays locked between the two presses
because the Photo Tour is still open. Focus is restored at *each* level to that level's
trigger.

### 3.7 Body scroll locking **[M]**

`body { overflow: hidden; position: fixed }` for the entire lightbox + tour lifetime;
released only when the last dialog closes.

### 3.8 Transitions **[M] / [N]**

| Target | Declared |
|---|---|
| Prev / Next / Close icon buttons | `transform 0.25s cubic-bezier(0.2, 0, 0, 1)` |
| Share / Save | `box-shadow .2s, transform .1s` |

**[N]** Whether the photo itself cross-fades or swaps instantly on navigation was not
captured, nor was the open/close animation of the lightbox shell.

---

## 4. Keyboard reference

| Context | Key | Behaviour | Confidence |
|---|---|---|---|
| Lightbox | `ArrowRight` | Next photo; counter + URL update | **[M]** |
| Lightbox | `ArrowLeft` | Previous photo | **[M]** |
| Lightbox | `Escape` | Close lightbox → Photo Tour (body stays locked) | **[M]** |
| Lightbox | `Tab` | Cycles trapped, wraps to `Close` | **[M]** |
| Photo Tour | `Escape` | Close tour → page; focus → `Show all photos` | **[M]** |
| Photo Tour | `Tab` | `Close → Share → Save → Scroll to <Room>…`, trapped | **[M]** |
| Amenities modal | `Escape` | Close; focus → trigger; scroll restored | **[M]** |
| Amenities modal | `Tab` | First stop is `Close` | **[M]** |
| Description modal | `Escape` | Close; focus → `Show more about this place` | **[M]** |
| Share / Login modal | `Escape` | Close | **[M]** |
| Date picker | `Escape` | Close; focus → `Change dates` button | **[M]** |
| Guest stepper | `Escape` | Close | **[M]** |
| Header search | `Escape` | Collapse | **[M]** |
| Inline calendar | — | Documents arrow-key day/week navigation, `PageUp`/`PageDown` by month, `Escape` to clear, via its own instruction text | **[M]** (text) |

The inline calendar's own help text states: *"To navigate this calendar with a keyboard use
the right or left arrow keys to move by day, up or down to move by week, page up or page
down to move by month, activate to select the date in focus and escape to clear your
selections."* The described behaviour was **[N] not individually exercised**.

---

## 5. Not observed

Do not invent these. Verify before implementing.

| # | Item | Status |
|---|---|---|
| 1 | `Message host` | Never activated **[N]** |
| 2 | Reviews modal ("Show all N reviews") | Sampled listings had too few reviews to render the button **[N]** |
| 3 | Logged-in `Save` | Only the logged-out login-modal path was seen **[N]** |
| 4 | Globe / language button | Not clicked **[N]** |
| 5 | Logo and `Become a host` navigation | Not followed **[N]** |
| 6 | Modal enter/exit animation | Sampled at steady state only **[N]** |
| 7 | Lightbox photo-change transition | Instant vs. cross-fade unresolved **[N]** — implementation decision: a 240ms directional slide-and-fade (32px from the side the photo came from, sitewide curve); see Lightbox.jsx |
| 8 | Primary CTA hover | No computed change; possible pseudo-element **[M‑neg] / unresolved** |
| 9 | Photo Tour thumbnail hover | No effect detected **[M‑neg]** |
| 10 | Map interactions (pan, zoom, marker) | Not exercised **[N]** |
| 11 | All responsive behaviour | Only 1440px tested — mobile gallery, bottom booking bar, drawer navigation **[N]** |
| 12 | Deep-linking | Whether loading a URL that already contains `?modal=PHOTO_TOUR_SCROLLABLE` re-opens the tour was not tested **[N]** |

---

## 6. Implementation priorities

Ranked by how badly an error would show:

1. **Two-stage `Escape`** with per-level focus restoration (§3.6).
2. **Scroll lock + exact offset restoration** (§0.2) — verified to the pixel.
3. **Focus trap with wrap** in every modal (§0.3).
4. **URL as modal state** — `?modal=PHOTO_TOUR_SCROLLABLE`, `&modalItem=<id>`, `?modal=DESCRIPTION`.
5. **Tile click ≡ Show-all-photos click** — identical resulting state (§1.5).
6. **Popovers do not lock scroll**; modals do (§0.1).
7. **No gallery tile hover effect** (§1.5) — resist adding one.
8. **`Previous` hidden on the first photo** (§3.4).
9. **Counter + `aria-live` announcement** as separate outputs (§3.3).
10. **Hover vocabulary**: secondary buttons `#F2F2F2 → #EBEBEB`; footer links underline;
    search pill gains shadow — all `cubic-bezier(0.2, 0, 0, 1)`, ≤300ms.
