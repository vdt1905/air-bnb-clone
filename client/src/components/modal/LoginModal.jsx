import CenteredModal from './CenteredModal.jsx';
import { useIsModalOpen } from '../../store/uiStore.js';
import { MODALS } from '../../constants/modals.js';

/**
 * Measured (INTERACTION_SPEC.md §1.4):
 *   480 × 488 at x=472, y=206 — centred
 *   radius 32px
 *   shadow 0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10)
 *     — note this differs from the other modals' 0 8px 28px rgba(0,0,0,0.28)
 *   heading "Log in or sign up"
 *   a "Phone number or email" field, a Continue button, then an "or" divider
 *   URL unchanged; scroll locked
 *
 * This is what the reference shows when a logged-out visitor clicks Save.
 * It is PRESENTATIONAL ONLY — the project has no authentication
 * (TECHNICAL_ARCHITECTURE.md §9.8), so the form submits nothing. The
 * logged-in Save path was never observed [N] and is not invented here.
 */
export default function LoginModal() {
  const isOpen = useIsModalOpen(MODALS.LOGIN);
  if (!isOpen) return null;

  return (
    <CenteredModal
      id={MODALS.LOGIN}
      label="Log in or sign up"
      width={480}
      height={488}
      shadow="0 0 0 1px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.10)"
    >
      <h2
        className="text-ink"
        style={{ fontSize: '22px', lineHeight: '26px', fontWeight: 500, letterSpacing: '-0.44px' }}
      >
        Log in or sign up
      </h2>

      <form
        className="mt-6"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="login-note"
      >
        <label htmlFor="login-identifier" className="sr-only">
          Phone number or email
        </label>
        <input
          id="login-identifier"
          type="text"
          autoComplete="email"
          placeholder="Phone number or email"
          className="w-full rounded-card border border-line px-4 py-4 text-body text-ink outline-none placeholder:text-muted focus-visible:border-ink"
        />

        <button
          type="submit"
          className="mt-4 flex w-full items-center justify-center text-white motion-control"
          style={{
            height: '48px',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 500,
            background: 'var(--gradient-cta)',
          }}
        >
          Continue
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <span className="text-base text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <p id="login-note" className="text-base text-muted">
        This is a demonstration project — sign-in is not implemented.
      </p>
    </CenteredModal>
  );
}
