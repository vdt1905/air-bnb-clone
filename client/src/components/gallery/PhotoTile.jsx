/**
 * One gallery tile. Measured (REFERENCE_ANALYSIS.md §4):
 *   - each tile is a <button> wrapping the image
 *   - object-fit: cover, object-position: 50% 50%
 *   - border-radius 0 on the <img>; the 12px rounding lives on the grid wrapper
 *
 * Hover: the reference darkens the tile. Phase 1 recorded no change because it
 * read `transform`/`filter`/`opacity` off the <img> and the effect is applied
 * as a separate overlay layer — the same blind spot flagged for the primary
 * CTA. Confirmed from reference screenshots, so it is implemented here as an
 * overlay rather than a filter, which keeps the image itself untouched.
 *
 * Timing follows the measured motion contract: 0.3s on the one sitewide curve.
 */
export default function PhotoTile({ photo, onOpen, className, style, priority = false }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`View photo: ${photo.alt}`}
      className={`group relative block h-full w-full overflow-hidden bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ink ${className ?? ''}`}
      style={style}
    >
      <img
        src={photo.url}
        alt=""
        aria-hidden="true"
        width={photo.width}
        height={photo.height}
        // All five mosaic tiles are above the fold, so all five load eagerly —
        // the reference measures every gallery image as `loading: auto`
        // (ASSET_INVENTORY.md §2.4). Only the hero gets fetchPriority="high".
        loading="eager"
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className="h-full w-full object-cover"
        style={{ objectPosition: '50% 50%' }}
      />

      {/* Hover scrim. Separate layer so the photo is never filtered or scaled. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ease-airbnb group-hover:opacity-10"
      />
    </button>
  );
}
