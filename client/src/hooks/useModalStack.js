import { useEffect } from 'react';
import { useUiStore, useUiActions, useTopModal } from '../store/uiStore.js';

/**
 * Restores focus to the element that opened an overlay.
 *
 * Deferred to the next frame on purpose. When the Lightbox closes, the Photo
 * Tour beneath it is still marked `inert` at the moment the store updates —
 * React has not committed the attribute removal yet — and focusing inside an
 * inert subtree silently fails, dropping focus to <body>. One frame later the
 * commit has landed and the element is focusable again.
 */
function restoreFocus(element) {
  if (!element) return;

  requestAnimationFrame(() => {
    if (document.contains(element)) {
      element.focus({ preventScroll: true });
    }
  });
}

/**
 * Binds `Escape` to the modal stack.
 *
 * Measured (INTERACTION_SPEC.md §3.6): Escape closes exactly ONE layer. From
 * the Lightbox it returns to the Photo Tour with the body STILL locked; a
 * second press closes the tour and unlocks. `closeTopModal()` returns that
 * level's trigger element, which is what we focus.
 *
 * Mount once, at the modal root.
 */
export function useModalStack() {
  const actions = useUiActions();
  const top = useTopModal();

  useEffect(() => {
    if (!top) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;

      event.stopPropagation();
      restoreFocus(actions.closeTopModal());
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [top, actions]);
}

/**
 * Closes a specific overlay and returns focus to whatever opened it.
 * Used by Close buttons, which must not depend on stack position.
 */
export function useCloseModal(id) {
  const actions = useUiActions();

  return () => restoreFocus(actions.closeModal(id));
}

/** True when `id` is the topmost dialog — drives focus traps and inert. */
export const useIsTopModal = (id) =>
  useUiStore((s) => s.modalStack[s.modalStack.length - 1] === id);
