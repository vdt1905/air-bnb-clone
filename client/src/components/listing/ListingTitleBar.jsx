import Icon from '../common/Icon.jsx';
import { useUiActions, useWishlisted } from '../../store/uiStore.js';
import { MODALS } from '../../constants/modals.js';

/**
 * Title row: h1 on the left, Share + Save on the right.
 *
 * Save is a toggle, not a login prompt. It sits on a clear background like
 * Share (grey only on hover); when saved the heart fills brand-pink with a short pop, and a
 * toast confirms "Saved to wishlist" / "Removed from wishlist". State lives in
 * uiStore so the Photo Tour's Save button shows the same heart.
 */
function TextAction({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base text-ink motion-control hover:bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <Icon name={icon} size={16} strokeWidth={2} />
      <span className="underline">{label}</span>
    </button>
  );
}

export function SaveButton() {
  const saved = useWishlisted();
  const { toggleWishlist } = useUiActions();

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      data-testid="save-button"
      className={[
        'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-base text-ink motion-control hover:bg-control',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
      ].join(' ')}
    >
      {/* key re-mounts the icon on every toggle so the pop replays. */}
      <span
        key={saved ? 'on' : 'off'}
        className="inline-flex motion-safe:animate-[heart-pop_320ms_cubic-bezier(0.2,0,0,1)]"
        style={{ color: saved ? 'var(--color-rausch-from)' : 'inherit' }}
      >
        <Icon name="heart" size={16} strokeWidth={2} filled={saved} />
      </span>
      <span className="underline">{saved ? 'Saved' : 'Save'}</span>
    </button>
  );
}

export default function ListingTitleBar({ title }) {
  const { openModal } = useUiActions();
  return (
    <div className="flex items-center justify-between gap-6 pt-9 pb-6">
      <h1
        className="text-ink"
        style={{ fontSize: '28px', lineHeight: '34px', fontWeight: 600, margin: 0 }}
      >
        {title}
      </h1>
      <div className="flex shrink-0 items-center gap-1">
        <TextAction icon="share" label="Share" onClick={(e) => openModal(MODALS.SHARE, e.currentTarget)} />
        <SaveButton />
      </div>
    </div>
  );
}
