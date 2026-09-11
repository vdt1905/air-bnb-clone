// Minimal class combiner. Deliberately not clsx/tailwind-merge: one small
// helper beats two dependencies for this surface.
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}
