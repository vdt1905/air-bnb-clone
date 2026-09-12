import Icon from '../common/Icon.jsx';
import { useState } from 'react';
import { useUiActions } from '../../store/uiStore.js';

/**
 * Promo card above the booking panel, per the reference screenshots:
 * green tag icon, "Get 10% off your next stay." with a "Terms apply" link,
 * and a grey "Claim" button on the right.
 *
 * Claiming flips the label to "Claimed" with a short settle animation and a
 * check mark; the button is then disabled so it cannot be claimed twice.
 * Local useState — nothing else on the page needs to know.
 */
export default function PromoBanner({ promo }) {
  const [claimed, setClaimed] = useState(false);
  const { openDetail } = useUiActions();
  if (!promo) return null;

  return (
    <div
      className="mb-6 flex items-center gap-4 rounded-card border border-line bg-white"
      style={{ padding: '16px 20px' }}
    >
      <span className="shrink-0" style={{ color: '#2e8b57' }}>
        <Icon name="tag" size={24} strokeWidth={1.75} className="-rotate-90" filled />
      </span>

      <div className="flex-1">
        <p className="text-base text-ink">{promo.text}</p>
        <button
          type="button"
          className="text-base font-medium text-ink underline"
          onClick={(e) =>
            openDetail(
              'Offer terms',
              'Get 10% off your next stay. This offer is subject to availability and eligibility. The discount applies to a future booking.',
              e.currentTarget
            )
          }
        >
          {promo.linkLabel}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setClaimed(true)}
        disabled={claimed}
        aria-pressed={claimed}
        data-testid="promo-claim"
        className={[
          'shrink-0 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-base font-medium motion-control',
          claimed
            ? 'bg-control text-ink motion-safe:animate-[pop_300ms_cubic-bezier(0.2,0,0,1)]'
            : 'bg-control text-ink hover:bg-control-hover',
        ].join(' ')}
      >
        {claimed && <Icon name="check-circle" size={16} strokeWidth={2} />}
        {claimed ? 'Claimed' : promo.cta}
      </button>
    </div>
  );
}
