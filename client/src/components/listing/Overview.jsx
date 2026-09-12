import SectionHeading from '../common/SectionHeading.jsx';
import Rating from './Rating.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §5): padding 32px 0,
 * heading 22/26 w500 ls -0.44px, capacity line 16/20 with middle-dot
 * separators and NO icons.
 */
export default function Overview({ listing, hideRating = false }) {
  const { propertyType, location, capacity, rating } = listing;

  const capacityParts = [
    `${capacity.guests} guests`,
    `${capacity.bedrooms} ${capacity.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`,
    `${capacity.beds} ${capacity.beds === 1 ? 'bed' : 'beds'}`,
    `${capacity.bathrooms} ${capacity.bathrooms === 1 ? 'bathroom' : 'bathrooms'}`,
  ];

  return (
    <section className="py-8" aria-labelledby="overview-heading">
      <SectionHeading id="overview-heading">
        {propertyType} in {location.city}, {location.country}
      </SectionHeading>
      <p className="mt-1 text-body text-ink">{capacityParts.join(' · ')}</p>
      {!hideRating && (
        <div className="mt-2">
          <Rating rating={rating} />
        </div>
      )}
    </section>
  );
}
