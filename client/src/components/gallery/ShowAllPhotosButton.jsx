import Icon from '../common/Icon.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §4):
 *   140.3 x 32, background #F2F2F2, radius 8px, padding 8px 16px,
 *   12px/16px weight 500, inset 24px from the gallery's bottom-right corner,
 *   hover -> #EBEBEB.
 */
export default function ShowAllPhotosButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="show-all-photos"
      className="absolute inline-flex items-center justify-center gap-2 border border-ink bg-white text-ink motion-control hover:bg-control-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      style={{
        right: '24px',
        bottom: '24px',
        width: '158px',
        height: '36px',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '16px',
        fontWeight: 500,
      }}
    >
      <Icon name="grid" size={12} strokeWidth={2} />
      Show all photos
    </button>
  );
}
