import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Dates and guest counts live in the URL because the reference puts them there
 * (?check_in, ?check_out, ?adults, ?children, ?infants) — see
 * TECHNICAL_ARCHITECTURE.md §3.2. Keeping them in the URL gives shareable
 * links and working Back/Forward for free.
 *
 * Popover open/closed state deliberately does NOT live here: that is local
 * useState inside the field that owns it.
 */
const toInt = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const readDate = (value) => {
  if (!ISO.test(value ?? '')) return null;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10) === value ? value : null;
};

export function useBookingParams() {
  const [params, setParams] = useSearchParams();

  const checkIn = readDate(params.get('check_in'));
  const checkOut = readDate(params.get('check_out'));

  const guests = useMemo(
    () => ({
      adults: Math.max(1, Math.min(4, toInt(params.get('adults'), 1))),
      children: Math.min(4 - Math.max(1, Math.min(4, toInt(params.get('adults'), 1))), toInt(params.get('children'), 0)),
      infants: Math.min(5, toInt(params.get('infants'), 0)),
    }),
    [params]
  );

  const update = useCallback(
    (next) => {
      setParams(
        (prev) => {
          const draft = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(next)) {
            if (value === null || value === undefined || value === '') draft.delete(key);
            else draft.set(key, String(value));
          }
          return draft;
        },
        { replace: true }
      );
    },
    [setParams]
  );

  const setDates = useCallback(
    (nextCheckIn, nextCheckOut) =>
      update({ check_in: nextCheckIn, check_out: nextCheckOut }),
    [update]
  );

  const setGuests = useCallback((next) => update(next), [update]);

  const totalGuests = guests.adults + guests.children;

  return { checkIn, checkOut, guests, totalGuests, setDates, setGuests };
}
