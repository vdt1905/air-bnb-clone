# Verification record

Checked on 12 September 2026 using local headless Google Chrome and the production Vite build.

## Automated checks

- `npm run build`: passes; browser fallback data regenerated from the server model.
- `npm test`: 47 server tests pass across three suites.
- `npm run test:browser`: all 11 browser scenarios pass. They cover the rendered listing, three desktop widths, tour/lightbox navigation, focus and scroll restoration, browser Back, direct photo URLs, date and guest updates, reserve feedback, amenities, review search, map controls, header menus, sharing, Save, the nearby carousel and malformed URL values.
- axe WCAG 2 A/AA and 2.1 AA rules report no violations in the initial listing, photo tour and lightbox states tested. This is an automated check, not a complete accessibility certification.

## Visual checks

Local screenshots are in `docs/reference/implementation-*.png`. The listing was checked at a 1910px viewport against the supplied desktop screenshots. Key alignment targets are a 1236px content area, five-photo hero, 720px main information column, 410px booking column, and a 1078px photo-tour content area with 506px room-photo columns. Desktop overflow is also checked at 1280px and 1440px.

Photographs, hero order, room group order, font, section spacing, booking fields and gallery sizing were inspected visually. Reduced motion is supported through a global media query; default hover/press/overlay/carousel effects use CSS transitions and keyframes.

## Reference constraints and remaining differences

- The supplied Vercel reference returned a security checkpoint. The screenshots determine fixed layout/text; exact live hover timing, all hidden dialogs and every scroll transition could not be observed or certified as identical.
- The same property's public Airbnb page provided rendered photo URLs. No deployed JavaScript/CSS application source was copied. Asset origins are in `docs/reference/asset-manifest.json` and `client/public/images/CREDITS.md`.
- The six visible review excerpts and aggregate count are fixed to the screenshots. Unseen review text, some supporting copy, avatars and nearby-property photos are approximations from the existing fixtures.
- Reserve, account, language and search controls demonstrate local UI state. They do not book a stay, authenticate a user, change a production locale or search a marketplace. Save is shared across views for the current page session.
- The implementation targets desktop. No mobile layout, production payment workflow or infrastructure deployment is claimed.

## Reproduce

Run `npm ci`, then `npm run check`. Chrome must be installed; use `npx playwright install chrome` if necessary. Browser tests use their own preview on port 5191 with the bundled data so a development API already running on port 5000 cannot change the fixture under test.
