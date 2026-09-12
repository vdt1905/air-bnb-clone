import { useEffect } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const visible = (el) =>
  !el.hasAttribute('inert') &&
  el.offsetWidth + el.offsetHeight > 0 &&
  getComputedStyle(el).visibility !== 'hidden';

/**
 * Traps Tab inside a container, wrapping at both ends.
 *
 * Measured (INTERACTION_SPEC.md §2.6, §3.5): tabbing through the reference's
 * overlays never escapes — every stop reports `inDialog: true` — and the cycle
 * wraps from the last control back to the first.
 *
 * `active` lets a stacked overlay hand the trap over: when the Lightbox opens
 * on top of the Photo Tour, only the topmost dialog keeps its trap armed.
 *
 * @param containerRef ref to the dialog element
 * @param active       whether this trap is the one in charge
 * @param initialFocus optional ref to focus on open (the tour focuses Close)
 */
export function useFocusTrap(containerRef, active = true, initialFocus = null) {
  // Initial focus runs ONCE, on mount — not every time `active` flips.
  //
  // Without this split, closing the Lightbox re-activates the Photo Tour's
  // trap, which would re-focus the tour's Close button and clobber the focus
  // that closeTopModal() just restored to the photo the user came from.
  // The measured behaviour restores focus per stack level, so the re-entry
  // must be silent.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusables = [...container.querySelectorAll(FOCUSABLE)].filter(visible);
    const target = initialFocus?.current ?? focusables[0] ?? container;
    target.focus({ preventScroll: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!active || !container) return undefined;

    const focusables = () => [...container.querySelectorAll(FOCUSABLE)].filter(visible);

    const onKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      // Wrap in both directions, and pull focus back if it has escaped.
      if (event.shiftKey) {
        if (current === first || !container.contains(current)) {
          event.preventDefault();
          last.focus();
        }
      } else if (current === last || !container.contains(current)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [containerRef, active]);
}
