import { useEffect } from 'react';

/**
 * ArrowLeft / ArrowRight navigation for the Lightbox.
 *
 * Measured (INTERACTION_SPEC.md §3.4): arrows move between photos and update
 * both the counter and the URL. Movement is CLAMPED, never wrapping — the
 * store enforces that, and the reference confirms it by hiding `Previous` at
 * index 0 rather than cycling to the end.
 *
 * Bound only while `active`, so the Photo Tour underneath never responds to
 * arrows once the Lightbox is closed.
 */
export function useKeyboardNav({ active, onNext, onPrev }) {
  useEffect(() => {
    if (!active) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, onNext, onPrev]);
}
