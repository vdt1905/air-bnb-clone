/**
 * Lightbox photo counter.
 *
 * Measured (INTERACTION_SPEC.md §3.3): a visible `1 / 34` at top-centre, PLUS
 * a separate `aria-live="polite"` region announcing "Showing photo 1 of 34".
 * They are two distinct outputs — the visible label is terse, the announcement
 * is a full sentence — so screen readers get the change without the terse
 * form being read as "one slash thirty-four".
 */
export default function PhotoCounter({ current, total }) {
  return (
    <>
      <p
        data-testid="lightbox-counter"
        aria-hidden="true"
        className="text-base text-white"
      >
        {current} / {total}
      </p>

      <p aria-live="polite" className="sr-only">
        Showing photo {current} of {total}
      </p>
    </>
  );
}
