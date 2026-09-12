import Icon from '../common/Icon.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §6): item width 265.5px, row height 48
 * (padding-bottom 24), icon 24x24, label 16/20.
 * Unavailable amenities are rendered with STRIKETHROUGH and greyed - the
 * reference keeps them visible rather than omitting them.
 */
export default function AmenityItem({ amenity }) {
  const unavailable = amenity.available === false;

  return (
    <li className="flex items-center gap-4" style={{ paddingBottom: '24px' }}>
      <span className={unavailable ? 'text-muted' : 'text-ink'}>
        <Icon name={amenity.icon} size={24} />
      </span>
      <span
        className={`text-body ${unavailable ? 'text-muted line-through' : 'text-ink'}`}
      >
        {amenity.label}
        {unavailable && <span className="sr-only"> (unavailable)</span>}
      </span>
    </li>
  );
}
