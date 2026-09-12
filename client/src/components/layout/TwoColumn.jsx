/**
 * Measured split (REFERENCE_ANALYSIS.md §1):
 *   left 653.3px | gutter 93.4px | right 372.3px  = 1119px + rounding = 1120px
 */
export default function TwoColumn({ main, aside }) {
  // NOTE: the aside column must stretch to the row height (no `items-start`).
  // A sticky child can only travel within its parent's box — if the column
  // shrink-wraps its content, `position: sticky` silently does nothing and the
  // booking card scrolls away instead of pinning at top: 80px.
  return (
    <div className="listing-columns flex items-stretch" style={{ gap: 'var(--column-gutter)' }}>
      <div className="min-w-0" style={{ width: 'var(--main-column)' }}>
        {main}
      </div>
      <div className="booking-column shrink-0" style={{ width: 'var(--aside-column)' }}>
        {aside}
      </div>
    </div>
  );
}
