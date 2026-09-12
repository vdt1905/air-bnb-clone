export function formatDate(isoDate, locale = 'en-US') {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));
}

/**
 * Long, human date for accessible labels.
 * Calendar day buttons were labelled with raw ISO ("2026-09-02"), which screen
 * readers read as digits and punctuation. This yields "Wednesday, 2 September
 * 2026" instead.
 */
export function formatDateLong(isoDate, locale = 'en-GB') {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
