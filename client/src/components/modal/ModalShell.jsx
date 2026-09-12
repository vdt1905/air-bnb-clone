import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap } from '../../hooks/useFocusTrap.js';
import { useIsTopModal } from '../../hooks/useModalStack.js';
import { cn } from '../../utils/cn.js';

/**
 * The one implementation of the measured modal contract
 * (INTERACTION_SPEC.md §0). Six overlays share it; none of them re-implement
 * focus, portalling or ARIA.
 *
 * Responsibilities:
 *   - portal into #modal-root, so no page stacking context can clip it
 *   - role="dialog" + aria-modal="true" + an accessible name
 *   - focus trap with wrap, armed only while THIS dialog is topmost
 *   - initial focus (the Photo Tour lands on Close)
 *
 * Deliberately NOT here:
 *   - the scroll lock, which is reference-counted once at the modal root
 *   - Escape, which belongs to the stack rather than any single dialog
 *
 * Popovers (date picker, guest stepper, account menu) must NOT use this — they
 * do not lock scroll and carry no dialog role.
 */
export default function ModalShell({
  id,
  label,
  initialFocusRef,
  className,
  style,
  children,
}) {
  const containerRef = useRef(null);

  // Only the topmost dialog keeps its trap armed, so a stacked Lightbox takes
  // over cleanly from the Photo Tour beneath it.
  const isTop = useIsTopModal(id);
  useFocusTrap(containerRef, isTop, initialFocusRef);

  const root = typeof document !== 'undefined' && document.getElementById('modal-root');
  if (!root) return null;

  return createPortal(
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={label}
      data-modal-id={id}
      // `inert` on a non-topmost dialog removes its whole subtree from the
      // tab order, hit-testing and the a11y tree. With the Lightbox stacked
      // over the Photo Tour this is what actually prevents interaction with
      // the layer beneath, rather than relying on the opaque backdrop.
      inert={!isTop ? true : undefined}
      className={cn('fixed inset-0 z-50 flex flex-col', className)}
      style={{...style,zIndex:isTop?70:60}}
    >
      {children}
    </div>,
    root
  );
}
