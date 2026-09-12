/**
 * Date helpers for the booking card.
 *
 * All dates are ISO strings (YYYY-MM-DD) — the API never sends formatted
 * dates, and formatting is the client's job (TECHNICAL_ARCHITECTURE.md §7).
 *
 * UTC is used throughout so a night count never shifts across a DST boundary.
 */
export const toIso = (date) => date.toISOString().slice(0, 10);

export const parseIso = (iso) => new Date(`${iso}T00:00:00Z`);

/** Nights between two ISO dates. Returns 0 for a missing or inverted range. */
export function nightsBetween(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const ms = parseIso(checkOut).getTime() - parseIso(checkIn).getTime();
  const nights = Math.round(ms / 86_400_000);
  return nights > 0 ? nights : 0;
}

/** Every date in [checkIn, checkOut), i.e. the nights actually occupied. */
export function datesInRange(checkIn, checkOut) {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights === 0) return [];

  const cursor = parseIso(checkIn);
  const out = [];
  for (let i = 0; i < nights; i += 1) {
    out.push(toIso(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return out;
}

/**
 * A range is available when no occupied night is blocked and it meets the
 * minimum-nights rule. Drives the measured "Those dates are not available"
 * state (REFERENCE_ANALYSIS.md §8).
 */
export function isRangeAvailable(checkIn, checkOut, blockedDates = [], minNights = 1) {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights === 0) return false;
  if (nights < minNights) return false;

  const blocked = new Set(blockedDates);
  return datesInRange(checkIn, checkOut).every((date) => !blocked.has(date));
}

export const isBlocked = (iso, blockedDates = []) => blockedDates.includes(iso);

/** Calendar grid for one month, padded with nulls to start on Sunday. */
export function monthGrid(year, month) {
  const first = new Date(Date.UTC(year, month, 1));
  const startOffset = first.getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(toIso(new Date(Date.UTC(year, month, day))));
  }
  return cells;
}

export const addMonths = (year, month, delta) => {
  const date = new Date(Date.UTC(year, month + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
};

export const monthLabel = (year, month) =>
  new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(Date.UTC(year, month, 1))
  );
