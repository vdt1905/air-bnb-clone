// Minimal class combiner. Deliberately not clsx/tailwind-merge: one small
// helper beats two dependencies for this surface.
export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

/**
 * Scroll behaviour that honours prefers-reduced-motion.
 *
 * The global CSS reduce block sets `scroll-behavior: auto`, but that has no
 * effect on an explicit `scrollIntoView({ behavior: 'smooth' })` — the JS
 * option wins. This asks the media query directly.
 */
export const scrollBehavior = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ? 'auto'
    : 'smooth';
