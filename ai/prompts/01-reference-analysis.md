# Phase 1 — Reference Analysis

You are a senior frontend reverse-engineering and UI analysis
specialist.

We are building an ORIGINAL implementation of the following reference:

https://airbnb-clone-umber-two.vercel.app

The goal is to reproduce the observable visual appearance and
behaviour of the reference, NOT its source code.

IMPORTANT:
- Do NOT copy source code.
- Do NOT inspect or reproduce implementation details.
- Do NOT attempt to lift-and-shift the application.
- Analyze only observable UI, layout, assets, and behaviour.
- The reference is the single source of truth.

## Analyze the following

### 1. Global Layout
Identify:
- viewport assumptions
- page maximum width
- horizontal margins
- header height
- major sections
- vertical spacing
- columns
- sticky/fixed elements

### 2. Header
Document:
- logo
- search interface
- navigation
- buttons
- icons
- dimensions
- spacing
- hover behaviour
- scroll behaviour

### 3. Listing Header
Document:
- title
- location
- rating
- reviews
- share
- save
- typography
- spacing
- alignment

### 4. Photo Gallery
Document:
- number of visible images
- grid structure
- dimensions
- gaps
- border radius
- image cropping
- object positioning
- Show All Photos button
- hover behaviour
- click behaviour

### 5. Property Information
Document:
- guest information
- bedrooms
- beds
- bathrooms
- host information
- icons
- separators

### 6. Amenities
Document:
- layout
- visible items
- icons
- spacing
- Show More interaction

### 7. Description
Document:
- typography
- line height
- width
- truncation
- expansion behaviour

### 8. Booking Card
Document:
- width
- position
- sticky behaviour
- border
- shadow
- radius
- price
- date fields
- guest selector
- CTA
- interactions

### 9. Host Section
Document:
- avatar
- host details
- buttons
- layout
- spacing

### 10. Location
Document:
- location text
- map/visual
- dimensions
- spacing

### 11. Footer
Document:
- structure
- columns
- links
- spacing
- typography

### 12. Photo Tour
Document:
- opening trigger
- layout
- full-screen behaviour
- close behaviour
- scrolling
- image layout
- transitions
- keyboard interactions

### 13. Lightbox
Document:
- opening trigger
- image dimensions
- background
- previous/next controls
- close control
- image counter
- transitions
- keyboard navigation
- Escape behaviour
- focus behaviour
- scroll locking

### 14. Typography
Identify:
- font family if observable
- font sizes
- weights
- line heights
- letter spacing

### 15. Colors
Identify approximate:
- primary text
- secondary text
- borders
- backgrounds
- buttons
- hover states
- overlays

### 16. Animations
Document:
- hover transitions
- modal transitions
- image transitions
- button transitions
- scroll effects

## Output

Create:

docs/reference/REFERENCE_ANALYSIS.md

Use a structured format.

At the end include:

## Critical Visual Anchors

List the 10 most visually important elements that must be
pixel-accurate.

## Critical Behaviours

List the 10 most important interactions that must match.
