export function formatDate(isoDate, locale = 'en-US') {
  if (!isoDate) return '';
  return new Intl.DateTimeFormat(locale, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(`${isoDate}T00:00:00`));
}
