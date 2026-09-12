import { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import DatePickerPopover from './DatePickerPopover.jsx';
import GuestStepperPopover from './GuestStepperPopover.jsx';
import PromoBanner from './PromoBanner.jsx';
import { formatDateLong } from '../../utils/formatDate.js';
import { useBookingParams } from '../../hooks/useBookingParams.js';
import { nightsBetween, isRangeAvailable } from '../../utils/dateRange.js';
import { formatCurrency } from '../../utils/formatCurrency.js';
import { formatDate } from '../../utils/formatDate.js';
import { scrollBehavior } from '../../utils/cn.js';
import {useUiActions} from '../../store/uiStore.js';

/**
 * Measured (REFERENCE_ANALYSIS.md §8):
 *   <aside> 372.3px, 1px solid #DDDDDD, radius 12px,
 *   shadow 0 6px 16px rgba(0,0,0,0.12), padding 24px, sticky top 80px
 *   inner content width 322.5px
 *   date cells 160.8 × 56, padding 26px 12px 10px
 *   guest row 322.5 × 60
 *   CTA 48px, radius 999px, brand gradient, 16px/500 white
 *
 * Price total is computed client-side (nightly × nights) — no money changes
 * hands, so a quote endpoint would be infrastructure for nothing
 * (TECHNICAL_ARCHITECTURE.md §9.5).
 *
 * Popover open state is LOCAL useState, and neither popover locks page scroll.
 */
const INNER = '100%';

function PriceBlock({ pricing, nights, available, checkIn, checkOut }) {
  if (!checkIn || !checkOut) {
    return (
      <p className="text-ink" style={{ fontSize: '22px', fontWeight: 500 }}>
        Add dates for prices
      </p>
    );
  }

  if (!available) {
    return (
      <div>
        <p className="text-ink" style={{ fontSize: '22px', fontWeight: 500 }}>
          Those dates are not available
        </p>
        <p className="mt-1 text-base text-muted">Try adjusting your stay.</p>
      </div>
    );
  }

  const total = pricing.nightlyRate * nights;

  // Reference: underlined bold price, then "for N nights" in regular weight,
  // all on one line.
  return (
    <p className="flex items-baseline gap-1.5 text-ink">
      <span className="underline" style={{ fontSize: '22px', fontWeight: 600 }}>
        {formatCurrency(total, pricing.currency)}
      </span>
      <span className="text-body">for {nights} {nights === 1 ? 'night' : 'nights'}</span>
    </p>
  );
}

export default function BookingCard({ listing }) {
  const { openDetail, showToast } = useUiActions();
  const { checkIn, checkOut, guests, totalGuests, setDates, setGuests } = useBookingParams();
  const [openPopover, setOpenPopover] = useState(null); // 'dates' | 'guests' | null
  const cardRef = useRef(null);
  const checkInRef = useRef(null);
  const deadline = checkIn ? new Date(new Date(checkIn).getTime() - 86400000).toISOString().slice(0,10) : listing.policies?.cancellationDeadline;
  const deadlineLabel = deadline
    ? formatDateLong(deadline).replace(/^\w+, /, '').replace(/ \d{4}$/, '')
    : null;

  const { pricing, availability, policies } = listing;
  const nights = nightsBetween(checkIn, checkOut);
  const available = isRangeAvailable(
    checkIn,
    checkOut,
    availability.blockedDates,
    availability.minNights
  );

  useEffect(() => {
    if (!openPopover) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpenPopover(null);
        checkInRef.current?.focus();
      }
    };
    const onClick = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) setOpenPopover(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [openPopover]);

  // Two states, matching the reference:
  //   "Check availability" (no valid dates) — opens no modal; scrolls to and
  //     focuses check-in so the visitor can pick dates.
  //   "Reserve" (valid, available dates) — raises the bottom-of-screen
  //     "You won't be charged yet" notice. No booking is ever submitted
  //     (TECHNICAL_ARCHITECTURE.md §5.2).
  const reservable = Boolean(checkIn && checkOut && available);
  const onCta = () => {
    if (reservable) {
      showToast('You won’t be charged yet');
      return;
    }
    setOpenPopover('dates');
    checkInRef.current?.focus();
    checkInRef.current?.scrollIntoView({ block: 'center', behavior: scrollBehavior() });
  };

  const guestLabel = [
    `${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}`,
    guests.infants > 0 ? `${guests.infants} infant${guests.infants === 1 ? '' : 's'}` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    // The reference starts the booking column 32px below the left column's
    // first section (overview y=650.1, booking sidebar y=682.1) — matching the
    // 32px top padding the content sections carry.
    <div style={{ position: 'sticky', top: 'var(--sticky-offset)', paddingTop: '32px' }}>
      <PromoBanner promo={listing.promo} />

      <aside
        ref={cardRef}
        data-testid="booking-card"
        aria-label="Booking"
        className="relative border border-line bg-white"
        style={{ borderRadius: '14px', padding: '26px', boxShadow: 'var(--shadow-card)', borderColor:'#ebebeb' }}
      >
        <PriceBlock
          pricing={pricing}
          nights={nights}
          available={available}
          checkIn={checkIn}
          checkOut={checkOut}
        />

        <div className="relative mt-6" style={{ width: INNER }}>
          <div className="overflow-hidden rounded-card border border-line">
            <div className="flex">
              {[
                { key: 'checkIn', label: 'CHECK-IN', value: checkIn, ref: checkInRef },
                { key: 'checkOut', label: 'CHECKOUT', value: checkOut, ref: null },
              ].map((cell, i) => (
                <button
                  key={cell.key}
                  ref={cell.ref}
                  type="button"
                  data-testid={`change-dates-${cell.key}`}
                  aria-expanded={openPopover === 'dates'}
                  onClick={() => setOpenPopover(openPopover === 'dates' ? null : 'dates')}
                  className={`flex flex-col items-start text-left motion-control hover:bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink ${
                    i === 1 ? 'border-l border-line' : ''
                  }`}
                  style={{ width: '160.8px', height: '56px', padding: '26px 12px 10px' }}
                >
                  <span
                    className="absolute text-ink"
                    style={{ marginTop: '-16px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}
                  >
                    {cell.label}
                  </span>
                  <span className={cell.value ? 'text-base text-ink' : 'text-base text-muted'}>
                    {cell.value ? formatDate(cell.value) : 'Add date'}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              data-testid="guest-field"
              aria-expanded={openPopover === 'guests'}
              onClick={() => setOpenPopover(openPopover === 'guests' ? null : 'guests')}
              className="flex w-full items-center justify-between border-t border-line px-3 text-left motion-control hover:bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
              style={{ width: INNER, height: '60px' }}
            >
              <span>
                <span
                  className="block text-ink"
                  style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em' }}
                >
                  GUESTS
                </span>
                <span className="block text-base text-ink">{guestLabel}</span>
              </span>
              <Icon name="chevronDown" size={16} strokeWidth={2} />
            </button>
          </div>

          {openPopover === 'dates' && (
            <DatePickerPopover
              checkIn={checkIn}
              checkOut={checkOut}
              blockedDates={availability.blockedDates}
              onChange={setDates}
              onClose={() => setOpenPopover(null)}
            />
          )}

          {openPopover === 'guests' && (
            <GuestStepperPopover
              guests={guests}
              maxGuests={policies?.maxGuests ?? listing.capacity.guests}
              onChange={setGuests}
            />
          )}
        </div>

        {available && nights > 0 && deadlineLabel && (
          <p
            className="mt-4 rounded-lg bg-surface text-center text-base text-ink"
            style={{ padding: '9px 12px', width: INNER, fontSize:'14px' }}
          >
            Free cancellation before <span className="font-medium">{deadlineLabel}</span>
          </p>
        )}

        <button
          type="button"
          data-testid="pdp-cta"
          onClick={onCta}
          className="reserve-button mt-5 flex items-center justify-center text-white motion-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          style={{
            width: INNER,
            height: '53px',
            borderRadius: '999px',
            padding: '14px 24px',
            fontSize: '16px',
            lineHeight: '20px',
            fontWeight: 500,
            background: 'var(--gradient-cta)',
          }}
        >
          {checkIn && checkOut && available ? 'Reserve' : 'Check availability'}
        </button>

        {available && nights > 0 && (
          <p className="mt-4 text-center text-base text-muted">You won&rsquo;t be charged yet</p>
        )}
      </aside>

      {/* A button, not an <a href="#report">: there is no #report target, so a
          fragment link sends focus nowhere. It is an action, not navigation. */}
      <p className="mt-5 flex justify-center">
        <button type="button" className="flex items-center gap-2 rounded text-base text-muted underline" onClick={e=>openDetail('Report this listing','If something about this listing seems incorrect, contact support with the listing name and details of your concern.',e.currentTarget)}>
          <Icon name="flag" size={16} />
          Report this listing
        </button>
      </p>
    </div>
  );
}
