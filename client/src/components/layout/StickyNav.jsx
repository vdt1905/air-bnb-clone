import { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon.jsx';
import { useBookingParams } from '../../hooks/useBookingParams.js';
import { nightsBetween, isRangeAvailable } from '../../utils/dateRange.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { scrollBehavior } from '../../utils/cn.js';

/**
 * Sub-navigation that appears once the gallery scrolls out of view.
 *
 * From the reference screenshots:
 *   - fixed to the top, 80px tall, white, 1px #DDDDDD bottom rule
 *   - left: Photos · Amenities · Reviews · Location as tabs; the active one
 *     carries a 2px dark underline and follows the scroll position
 *   - right: price + nights, rating + review count, and a Reserve pill
 *
 * The main header is NOT sticky (measured), so this bar effectively takes its
 * place while scrolled. It sits at z-40 — beneath every modal at z-50.
 *
 * Visibility and the active tab both come from IntersectionObserver rather
 * than scroll listeners, so nothing runs per frame.
 */
export const NAV_HEIGHT = 72;

const TABS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
];

export default function StickyNav({ listing, onReserve }) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState('photos');
  const ratioRef = useRef(new Map());

  const { checkIn, checkOut } = useBookingParams();
  const nights = nightsBetween(checkIn, checkOut);
  const available = isRangeAvailable(
    checkIn,
    checkOut,
    listing.availability.blockedDates,
    listing.availability.minNights
  );
  const total = nights > 0 ? listing.pricing.nightlyRate * nights : null;

  // Show once the gallery's bottom edge passes the top of the viewport.
  useEffect(() => {
    const gallery = document.getElementById('photos');
    if (!gallery) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(gallery);
    return () => io.disconnect();
  }, []);

  // Scroll-spy: the tab whose section is most present in the viewport wins.
  useEffect(() => {
    const sections = TABS.map((t) => document.getElementById(t.id)).filter(Boolean);
    if (!sections.length) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratioRef.current.set(e.target.id, e.intersectionRatio);
        let best = null;
        let bestRatio = 0;
        for (const [id, ratio] of ratioRef.current) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: `-${NAV_HEIGHT}px 0px -55% 0px`, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const goTo = (id) => (event) => {
    event.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT - 24;
    window.scrollTo({ top, behavior: scrollBehavior() });
  };

  return (
    <div
      data-testid="sticky-nav"
      aria-hidden={!visible}
      className={[
        'fixed inset-x-0 top-0 z-40 border-b border-line bg-white',
        'transition-transform duration-200 ease-airbnb',
        visible ? 'translate-y-0' : '-translate-y-full pointer-events-none',
      ].join(' ')}
      style={{ height: `${NAV_HEIGHT}px` }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between"
        style={{ width: 'var(--content-width)' }}
      >
        <nav aria-label="Page sections" className="flex h-full items-stretch" style={{ gap: '24px' }}>
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <a
                key={tab.id}
                href={`#${tab.id}`}
                onClick={goTo(tab.id)}
                aria-current={isActive ? 'location' : undefined}
                tabIndex={visible ? 0 : -1}
                className="relative flex items-center text-base font-medium text-ink"
              >
                {tab.label}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-3 h-0.5 bg-ink transition-opacity duration-200 ease-airbnb"
                  style={{ opacity: isActive ? 1 : 0 }}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center" style={{ gap: '24px' }}>
          <div className="text-right">
            {total !== null && available ? (
              <p className="text-base text-ink">
                <span className="font-semibold">{formatCurrency(total, listing.pricing.currency)}</span>{' '}
                for {nights} {nights === 1 ? 'night' : 'nights'}
              </p>
            ) : (
              <p className="text-base text-ink">
                <span className="font-semibold">Add dates</span> for prices
              </p>
            )}
            <p className="flex items-center justify-end gap-1 text-base text-ink">
              <Icon name="star" size={12} filled strokeWidth={0} />
              {listing.rating.isNew ? 'New' : listing.rating.value} · {listing.rating.count}{' '}
              {listing.rating.count === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          <button
            type="button"
            onClick={onReserve}
            tabIndex={visible ? 0 : -1}
            className="reserve-button flex items-center justify-center px-6 text-white"
            style={{
              height: '48px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 500,
            }}
          >
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
