import CenteredModal from '../modal/CenteredModal.jsx';
import Icon from '../common/Icon.jsx';
import { useIsModalOpen } from '../../store/uiStore.js';
import { useListingData } from '../../store/listingStore.js';
import { MODALS } from '../../constants/modals.js';

/**
 * Measured (INTERACTION_SPEC.md §1.6):
 *   780 × 820 at x=322.3, y=40 — centred with a 40px viewport margin
 *   radius 32px, shadow 0 8px 28px rgba(0,0,0,0.28)
 *   heading "What this place offers"
 *   content grouped under category headings (Bathroom, Bedroom and laundry, …)
 *   shell overflow clip; the body scrolls internally
 *   URL is NOT changed — this modal is store-only state
 *
 * Unavailable amenities keep their strikethrough here too: the reference never
 * filters them out (REFERENCE_ANALYSIS.md §6).
 */
export default function AmenitiesModal() {
  const isOpen = useIsModalOpen(MODALS.AMENITIES);
  const listing = useListingData();

  if (!isOpen || !listing) return null;

  // Preserve payload order within each category.
  const categories = new Map();
  for (const amenity of listing.amenities) {
    const key = amenity.category ?? 'Other';
    if (!categories.has(key)) categories.set(key, []);
    categories.get(key).push(amenity);
  }

  return (
    <CenteredModal
      id={MODALS.AMENITIES}
      label="What this place offers"
      width={780}
      height={820}
    >
      <h2
        className="text-ink"
        style={{ fontSize: '26px', lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.52px' }}
      >
        What this place offers
      </h2>

      {[...categories.entries()].map(([category, items]) => (
        <section key={category} className="mt-8">
          <h3 className="text-body font-medium text-ink">{category}</h3>
          <ul className="mt-2">
            {items.map((amenity) => {
              const unavailable = amenity.available === false;
              return (
                <li
                  key={amenity.id}
                  className="flex items-center gap-4 border-b border-line py-4"
                >
                  <span className={unavailable ? 'text-muted' : 'text-ink'}>
                    <Icon name={amenity.icon} size={24} />
                  </span>
                  <span className={`text-body ${unavailable ? 'text-muted line-through' : 'text-ink'}`}>
                    {amenity.label}
                    {unavailable && <span className="sr-only"> (unavailable)</span>}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </CenteredModal>
  );
}
