import CenteredModal from '../modal/CenteredModal.jsx';
import { useIsModalOpen } from '../../store/uiStore.js';
import { useListingData } from '../../store/listingStore.js';
import { MODALS } from '../../constants/modals.js';

/**
 * Measured (INTERACTION_SPEC.md §1.7):
 *   780 × 438 at x=322.3, y=231 — same 780px width and 32px radius as the
 *   Amenities modal, but height-fitted to content and vertically centred
 *   heading "About this space"
 *   full description with sub-headings ("The space", …)
 *   URL gains ?modal=description — one of only two URL-backed overlays
 *   Escape restores focus to "Show more about this place"
 */
export default function DescriptionModal() {
  const isOpen = useIsModalOpen(MODALS.DESCRIPTION);
  const listing = useListingData();

  if (!isOpen || !listing?.description) return null;

  const { summary, sections = [] } = listing.description;

  return (
    <CenteredModal id={MODALS.DESCRIPTION} label="About this space" width={780}>
      <h2
        className="text-ink"
        style={{ fontSize: '26px', lineHeight: '30px', fontWeight: 500, letterSpacing: '-0.52px' }}
      >
        About this space
      </h2>

      <p className="mt-6 whitespace-pre-line text-body text-ink">{summary}</p>

      {sections.map((section) => (
        <section key={section.heading} className="mt-8">
          <h3 className="text-body font-medium text-ink">{section.heading}</h3>
          <p className="mt-2 whitespace-pre-line text-body text-ink">{section.body}</p>
        </section>
      ))}
    </CenteredModal>
  );
}
