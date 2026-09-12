import { useEffect, useRef } from 'react';
import { useIsScrollLocked } from '../store/uiStore.js';

/**
 * Body scroll lock, driven by uiStore's reference COUNT rather than a boolean.
 *
 * Measured contract (INTERACTION_SPEC.md §0.2):
 *   while locked   body { overflow: hidden; position: fixed }, scrollY pinned
 *   on release     overflow visible, position static, and the EXACT prior
 *                  offset restored (verified 1501 → 1501 on the reference)
 *
 * The count matters: with the Lightbox stacked on the Photo Tour, closing the
 * lightbox must NOT unlock the page. `useIsScrollLocked` is `lockCount > 0`,
 * so this effect only runs at the 0↔1 boundary and inner opens/closes are
 * transparent to it.
 *
 * `position: fixed` is what actually pins the page; `top: -<offset>` keeps the
 * viewport visually where it was rather than jumping to the top.
 *
 * Mount once, at the app's modal root.
 */
export function useScrollLock() {
  const locked = useIsScrollLocked();
  const offsetRef = useRef(0);

  useEffect(() => {
    if (!locked) return undefined;

    const { body } = document;
    const pageRoot=document.getElementById('root');
    if(pageRoot)pageRoot.inert=true;
    const offset = window.scrollY;
    offsetRef.current = offset;

    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${offset}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      if(pageRoot)pageRoot.inert=false;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;

      // Restore synchronously so the page never flashes at the top.
      window.scrollTo(0, offsetRef.current);
    };
  }, [locked]);
}
