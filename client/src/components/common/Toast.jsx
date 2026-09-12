import { useEffect } from 'react';
import { useToast, useUiActions } from '../../store/uiStore.js';

/**
 * Bottom-of-screen notice, per the reference screenshot: a dark rounded pill,
 * centred horizontally near the bottom edge, white medium-weight text.
 *
 * Auto-dismisses. The timer is keyed on the toast's `id`, so raising the same
 * message again restarts it rather than being swallowed. Announced politely to
 * assistive tech via role="status"; it is not focusable and never traps.
 *
 * Sits at z-40 — above the page, beneath modals at z-50 — and ignores pointer
 * events so it can never block the Reserve button that raised it.
 */
const DURATION_MS = 3000;

export default function Toast() {
  const toast = useToast();
  const { hideToast } = useUiActions();

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(hideToast, DURATION_MS);
    return () => clearTimeout(t);
  }, [toast, hideToast]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-40 flex justify-center"
      style={{ bottom: '40px' }}
    >
      {toast && (
        <p
          key={toast.id}
          data-testid="toast"
          className="rounded-lg bg-ink px-6 py-4 text-body font-medium text-white shadow-modal motion-safe:animate-[toast-in_200ms_cubic-bezier(0.2,0,0,1)]"
        >
          {toast.message}
        </p>
      )}
    </div>
  );
}
