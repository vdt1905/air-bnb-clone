import SectionHeading from '../common/SectionHeading.jsx';
import Divider from '../common/Divider.jsx';
import Button from '../common/Button.jsx';
import { useUiActions } from '../../store/uiStore.js';
import { MODALS } from '../../constants/modals.js';
import AmenityItem from './AmenityItem.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §6):
 *   2-column grid, column pitch 334.7px, item width 265.5px, row pitch 48px
 *   exactly 10 items shown before the button
 *   button 205.8 x 48, #F2F2F2, radius 12px, padding 14px 24px, 16px/500
 */
const VISIBLE = 10;

export default function Amenities({ amenities }) {
  const { openModal } = useUiActions();
  if (!amenities?.length) return null;
  const visible = amenities.slice(0, VISIBLE);

  return (
    <>
      <Divider />
      <section id="amenities" className="scroll-mt-24 py-8" aria-labelledby="amenities-heading">
        <SectionHeading id="amenities-heading">What this place offers</SectionHeading>

        <ul
          data-testid="amenities-grid"
          className="mt-6 grid"
          style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', columnGap: '16px' }}
        >
          {visible.map((amenity) => (
            <AmenityItem key={amenity.id} amenity={amenity} />
          ))}
        </ul>

        {amenities.length > VISIBLE && (
          <Button
            variant="outline"
            onClick={(e) => openModal(MODALS.AMENITIES, e.currentTarget)}
            data-testid="show-all-amenities"
            style={{ height: '48px', padding: '14px 24px', fontSize: '16px' }}
          >
            Show all {amenities.length} amenities
          </Button>
        )}
      </section>
    </>
  );
}
