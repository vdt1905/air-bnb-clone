import { useState } from 'react';
import SectionHeading from '../common/SectionHeading.jsx';
import Divider from '../common/Divider.jsx';
import Icon from '../common/Icon.jsx';
import { formatCurrency } from '../../utils/formatCurrency.js';

/**
 * "More stays nearby" carousel, per the reference screenshots: heading with a
 * "1 / 2" page counter and circular prev/next controls on the right, then a
 * row of five cards — rounded 1:1 image, title, "₹price ★rating".
 *
 * Five cards per page. Pages slide with the sitewide curve; reduced-motion
 * users get an instant change via the global CSS override.
 */
const PER_PAGE = 5;
const GAP = 16;

export default function NearbyStays({ stays, currency = 'INR' }) {
  const [page, setPage] = useState(0);
  if (!stays?.length) return null;

  const pages = Math.ceil(stays.length / PER_PAGE);
  const cardWidth = 'calc((100% - 64px) / 5)';
  // The last page is END-aligned like the reference: it slides only as far as
  // needed to show the final five cards, so it is never a partial row.
  const offset = Math.min(page * PER_PAGE, Math.max(0, stays.length - PER_PAGE));

  return (
    <>
      <Divider />
      <section className="py-12" aria-labelledby="nearby-heading">
        <div className="flex items-center justify-between">
          <SectionHeading id="nearby-heading">More stays nearby</SectionHeading>

          {pages > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-base text-ink" aria-live="polite">
                {page + 1} / {pages}
              </span>
              <button
                type="button"
                aria-label="Previous stays"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink motion-control hover:bg-control disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevronLeft" size={14} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label="Next stays"
                disabled={page === pages - 1}
                onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink motion-control hover:bg-control disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Icon name="chevronRight" size={14} strokeWidth={2} />
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 overflow-hidden">
          <ul
            className="flex transition-transform duration-300 ease-airbnb"
            style={{ gap: `${GAP}px`, transform: `translateX(calc(${-offset} * (${cardWidth} + ${GAP}px)))` }}
          >
            {stays.map((stay) => (
              <li key={stay.id} className="shrink-0" style={{ width: cardWidth }}>
                <a href="#" className="group block">
                  <img
                    src={stay.imageUrl}
                    alt=""
                    aria-hidden="true"
                    width={1440}
                    height={960}
                    loading="lazy"
                    decoding="async"
                    className="block w-full object-cover"
                    style={{ aspectRatio: '1 / 1', borderRadius: '12px' }}
                  />
                  <p className="mt-3 text-base font-medium text-ink group-hover:underline" style={{ lineHeight: '20px' }}>
                    {stay.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-base text-ink">
                    <span>{formatCurrency(stay.price, currency)}</span>
                    <Icon name="star" size={12} filled strokeWidth={0} />
                    <span>{stay.rating}</span>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
