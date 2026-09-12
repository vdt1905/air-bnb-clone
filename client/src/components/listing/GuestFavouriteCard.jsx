import Icon from '../common/Icon.jsx';
import Laurel from '../common/Laurel.jsx';

/**
 * The bordered "Guest favourite" card under the overview, from the reference
 * screenshots: laurel-flanked label on the left, explanatory copy, then the
 * rating with five stars and the review count, separated by hairlines.
 *
 * Renders only when the listing carries the flag — for a new or unrated
 * listing the plain rating line in Overview is used instead.
 */
export default function GuestFavouriteCard({ rating }) {
  const stars = Math.round(rating.value);

  return (
    <div
      className="flex items-center rounded-card border border-line bg-white"
      style={{ padding: '20px 24px' }}
    >
      <div className="flex items-center gap-1 text-ink">
        <Laurel size={32} />
        <p
          className="text-center font-semibold leading-tight text-ink"
          style={{ fontSize: '16px', width: '64px' }}
        >
          Guest favourite
        </p>
        <Laurel size={32} side="right" />
      </div>

      <p className="ml-6 flex-1 text-base text-ink" style={{ maxWidth: '300px' }}>
        One of the most loved homes on Airbnb, according to guests
      </p>

      <div className="ml-auto flex items-center">
        <div className="px-6 text-center">
          <p className="text-ink" style={{ fontSize: '22px', fontWeight: 600, lineHeight: '26px' }}>
            {rating.value}
          </p>
          <p className="mt-0.5 flex justify-center gap-0.5 text-ink" role="img" aria-label={`${rating.value} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Icon key={i} name="star" size={10} filled={i < stars} strokeWidth={i < stars ? 0 : 1.5} />
            ))}
          </p>
        </div>

        <span className="h-10 w-px bg-line" aria-hidden="true" />

        <a href="#reviews" className="px-6 text-center">
          <p className="text-ink" style={{ fontSize: '22px', fontWeight: 600, lineHeight: '26px' }}>
            {rating.count}
          </p>
          <p className="mt-0.5 text-micro text-ink underline">Reviews</p>
        </a>
      </div>
    </div>
  );
}
