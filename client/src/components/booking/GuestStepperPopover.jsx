import Icon from '../common/Icon.jsx';

/**
 * Measured (INTERACTION_SPEC.md §1.8):
 *   circular stepper buttons (border-radius 50%)
 *   aria-labels of the form "Increase Adults" / "Decrease Adults"
 *   disabled at the minimum, border colour #C1C1C1 vs #222222 when enabled
 *   popover — does NOT lock body scroll
 */
const ROWS = [
  { key: 'adults', label: 'Adults', hint: 'Age 13+', min: 1 },
  { key: 'children', label: 'Children', hint: 'Ages 2-12', min: 0 },
  { key: 'infants', label: 'Infants', hint: 'Under 2', min: 0 },
];

function StepperButton({ action, label, disabled, onClick }) {
  return (
    <button
      type="button"
      aria-label={`${action} ${label}`}
      disabled={disabled}
      onClick={onClick}
      className={[
        'flex h-8 w-8 items-center justify-center rounded-full border motion-control',
        disabled
          ? 'cursor-not-allowed border-[#C1C1C1] text-[#C1C1C1]'
          : 'border-ink text-ink hover:bg-control',
      ].join(' ')}
    >
      <Icon name={action === 'Increase' ? 'plus' : 'minus'} size={14} strokeWidth={2} />
    </button>
  );
}

export default function GuestStepperPopover({ guests, maxGuests, onChange }) {
  const totalCounted = guests.adults + guests.children;

  return (
    <div
      data-testid="guest-stepper"
      role="group"
      aria-label="Choose number of guests"
      className="absolute right-0 z-40 bg-white p-6"
      style={{
        top: 'calc(100% + 8px)',
        width: '372.3px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-pop)',
      }}
    >
      {ROWS.map((row, i) => {
        const value = guests[row.key];
        const atMax = row.key !== 'infants' && totalCounted >= maxGuests;

        return (
          <div
            key={row.key}
            className={`flex items-center justify-between py-4 ${i > 0 ? 'border-t border-line' : ''}`}
          >
            <div>
              <p className="text-body text-ink">{row.label}</p>
              <p className="text-base text-muted">{row.hint}</p>
            </div>

            <div className="flex items-center gap-3">
              <StepperButton
                action="Decrease"
                label={row.label}
                disabled={value <= row.min}
                onClick={() => onChange({ [row.key]: value - 1 })}
              />
              <span className="w-6 text-center text-body text-ink" aria-hidden="true">
                {value}
              </span>
              <span className="sr-only" aria-live="polite">
                {value} {row.label.toLowerCase()}
              </span>
              <StepperButton
                action="Increase"
                label={row.label}
                disabled={atMax}
                onClick={() => onChange({ [row.key]: value + 1 })}
              />
            </div>
          </div>
        );
      })}

      <p className="mt-2 text-base text-muted">This place has a maximum of {maxGuests} guests.</p>
    </div>
  );
}
