import { useState } from 'react';
import Icon from '../common/Icon.jsx';
import { addMonths, toIso, parseIso } from '../../utils/dateRange.js';
import MonthGrid from './MonthGrid.jsx';

/**
 * Measured (INTERACTION_SPEC.md §1.8):
 *   661 × 466, radius 16px, shadow 0 6px 20px rgba(0,0,0,.20), white
 *   two months side by side
 *   IT IS A POPOVER, NOT A MODAL — it must NOT lock body scroll and carries
 *   no role="dialog". Getting this wrong is a visible deviation.
 *
 * Disabled days use #D1D1D1, matching the measured disabled colour.
 */
export default function DatePickerPopover({
  checkIn,
  checkOut,
  blockedDates,
  onChange,
  onClose,
}) {
  const todayIso = toIso(new Date());
  const anchor = checkIn ? parseIso(checkIn) : new Date();
  const [view, setView] = useState({
    year: anchor.getUTCFullYear(),
    month: anchor.getUTCMonth(),
  });

  const second = addMonths(view.year, view.month, 1);

  const pick = (iso) => {
    // First click sets check-in; second completes the range.
    if (!checkIn || (checkIn && checkOut) || iso <= checkIn) {
      onChange(iso, null);
    } else {
      onChange(checkIn, iso);
      onClose?.();
    }
  };

  return (
    <div
      data-testid="date-picker"
      role="group"
      aria-label="Choose check-in and checkout dates"
      className="absolute right-0 z-40 bg-white p-6"
      style={{
        top: 'calc(100% + 8px)',
        width: '661px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-pop)',
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setView(addMonths(view.year, view.month, -1))}
          className="rounded-full p-2 text-ink motion-control hover:bg-control"
        >
          <Icon name="chevronLeft" size={16} strokeWidth={2} />
        </button>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setView(addMonths(view.year, view.month, 1))}
          className="rounded-full p-2 text-ink motion-control hover:bg-control"
        >
          <Icon name="chevronRight" size={16} strokeWidth={2} />
        </button>
      </div>

      <div className="flex gap-8">
        <MonthGrid
          {...view}
          checkIn={checkIn}
          checkOut={checkOut}
          blockedDates={blockedDates}
          todayIso={todayIso}
          onPick={pick}
        />
        <MonthGrid
          {...second}
          checkIn={checkIn}
          checkOut={checkOut}
          blockedDates={blockedDates}
          todayIso={todayIso}
          onPick={pick}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => onChange(null, null)}
          className="rounded-lg px-4 py-2 text-base font-medium text-ink underline motion-control hover:bg-control"
        >
          Clear dates
        </button>
      </div>
    </div>
  );
}
