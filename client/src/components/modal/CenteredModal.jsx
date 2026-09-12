import { useRef } from 'react';
import ModalShell from './ModalShell.jsx';
import Icon from '../common/Icon.jsx';
import { useCloseModal } from '../../hooks/useModalStack.js';

/**
 * Shared shell for the four centred modals: Amenities, Description, Share and
 * Login. The Photo Tour and Lightbox are full-bleed and do not use this.
 *
 * Measured (INTERACTION_SPEC.md §1.3–1.7):
 *   background #FFFFFF, border-radius 32px
 *   shadow 0 8px 28px rgba(0,0,0,0.28)   (Login uses its own, see `shadow`)
 *   Close: 16×16 ✕ icon button, 24px inset from the panel's top-left
 *   shell `overflow: clip`; the body scrolls internally
 *   scrim rgba(0,0,0,0.25)  (REFERENCE_ANALYSIS.md §15)
 *
 * Scroll lock, focus trap, Escape and portalling all come from ModalShell +
 * uiStore — identical to the overlays already shipped.
 */
export default function CenteredModal({
  id,
  label,
  width,
  height,
  shadow = 'var(--shadow-modal)',
  children,
  footer,
}) {
  const closeRef = useRef(null);
  const close = useCloseModal(id);

  return (
    <ModalShell
      id={id}
      label={label}
      initialFocusRef={closeRef}
      className="items-center justify-center motion-safe:animate-[fade-in_180ms_cubic-bezier(0.2,0,0,1)]"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
    >
      {/* Clicking the scrim closes, matching every dismissible overlay here. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={close}
        className="absolute inset-0 cursor-default"
        style={{ background: 'transparent' }}
      />

      <div
        className="relative flex flex-col overflow-clip bg-white"
        style={{
          width: `${width}px`,
          maxHeight: height ? `${height}px` : 'calc(100vh - 80px)',
          height: height ? `${height}px` : undefined,
          borderRadius: 'var(--radius-modal)',
          boxShadow: shadow,
        }}
      >
        <div className="shrink-0" style={{ padding: '24px' }}>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            data-testid={`${id}-close`}
            className="flex h-4 w-4 items-center justify-center rounded-full text-ink motion-icon hover:scale-105"
          >
            <Icon name="close" size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain" style={{ padding: '0 48px 48px' }}>
          {children}
        </div>

        {footer}
      </div>
    </ModalShell>
  );
}
