import Icon from '../common/Icon.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §5): the rating line renders either
 *   "* 4.84 . 76 reviews"   (rated)
 * or
 *   "New . 1 review"        (isNew)
 * Two different code paths, both seeded in the API.
 */
export default function Rating({ rating }) {
  if (!rating) return null;

  if (rating.isNew) {
    return (
      <p className="flex items-center gap-1.5 text-body text-ink">
        <Icon name="star" size={14} filled strokeWidth={0} />
        <span className="font-medium">New</span>
        <span aria-hidden="true">·</span>
        <a href="#reviews" className="underline">
          {rating.count} {rating.count === 1 ? 'review' : 'reviews'}
        </a>
      </p>
    );
  }

  return (
    <p className="flex items-center gap-1.5 text-body text-ink">
      <Icon name="star" size={14} filled strokeWidth={0} />
      <span className="font-medium">{rating.value}</span>
      <span aria-hidden="true">·</span>
      <a href="#reviews" className="underline">
        {rating.count} reviews
      </a>
    </p>
  );
}
