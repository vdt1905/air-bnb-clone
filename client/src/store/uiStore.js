import { create } from 'zustand';

/**
 * Cross-cutting overlay mechanics: the modal STACK, a reference-counted scroll
 * lock, and the focus-return chain.
 *
 * Ownership boundary (TECHNICAL_ARCHITECTURE.md §3):
 *   uiStore      — what is open, in what ORDER, plus lock + focus bookkeeping.
 *                  It spans gallery and non-gallery overlays alike, because the
 *                  two-stage Escape has to walk one ordered stack.
 *   galleryStore — which PHOTO is showing. It calls into this store to open and
 *                  close, so "is the tour open" is stored exactly once.
 *
 * closeTopModal() is the critical function: it pops ONE level, restores THAT
 * level's focus target, and releases the scroll lock only at zero — which is
 * what reproduces the measured behaviour where the body stays locked between
 * the first and second Escape (INTERACTION_SPEC.md §3.6).
 *
 * Zustand v5 note: `actions` is created once and never replaced, so
 * `useUiStore((s) => s.actions)` is referentially stable and never causes a
 * re-render. State slices are read with atomic selectors that return
 * primitives, so React can bail out on unchanged values.
 */
export const useUiStore = create((set, get) => ({
  /** Ordered bottom→top, e.g. ['photos', 'lightbox']. */
  modalStack: [],
  /** Reference count, not a boolean: stacked modals must not each unlock. */
  lockCount: 0,
  /** Parallel to modalStack; holds the element that opened each level. */
  focusReturnStack: [],
  detail: null,
  /** Transient bottom-of-screen notice, e.g. "You won't be charged yet". */
  toast: null,
  /**
   * Whether this listing is saved. Shared state because Save appears in two
   * subtrees — the title bar and the Photo Tour's top bar — and both must
   * reflect the same heart. Session-only: there is no account to persist to.
   */
  wishlisted: false,

  actions: {
    /** Flips the saved state and announces it. Returns the new value. */
    toggleWishlist: () => {
      const next = !get().wishlisted;
      set({ wishlisted: next, toast: { id: Date.now(), message: next ? 'Saved to wishlist' : 'Removed from wishlist' } });
      return next;
    },

    /**
     * Shows a toast. Lives here rather than in a component because it is
     * raised from two different subtrees — the booking card's CTA and the
     * sticky nav's Reserve — and must survive either unmounting.
     * `id` changes on every call so a repeat of the same message re-arms the
     * auto-dismiss timer instead of being ignored.
     */
    showToast: (message) => set({ toast: { id: Date.now(), message } }),
    hideToast: () => set({ toast: null }),

    openDetail: (title, body, triggerEl = null) => {
      set({ detail: { title, body } });
      get().actions.openModal('detail', triggerEl);
    },
    openModal: (id, triggerEl = null) => {
      // Re-opening an already-open overlay must not double-count the lock.
      if (get().modalStack.includes(id)) return;

      set((s) => ({
        modalStack: [...s.modalStack, id],
        lockCount: s.lockCount + 1,
        focusReturnStack: [...s.focusReturnStack, triggerEl ?? null],
      }));
    },

    /** Pops one level. Returns the element focus should return to. */
    closeTopModal: () => {
      const { modalStack, lockCount, focusReturnStack } = get();
      if (modalStack.length === 0) return null;

      const returnTo = focusReturnStack[focusReturnStack.length - 1] ?? null;

      set({
        modalStack: modalStack.slice(0, -1),
        lockCount: Math.max(lockCount - 1, 0),
        focusReturnStack: focusReturnStack.slice(0, -1),
      });

      return returnTo;
    },

    /**
     * Closes `id` and everything stacked above it — closing the Photo Tour has
     * to take the Lightbox with it. Returns the focus target of `id` itself,
     * which is the trigger the user actually came from.
     */
    closeModal: (id) => {
      const { modalStack, focusReturnStack } = get();
      const index = modalStack.indexOf(id);
      if (index === -1) return null;

      const returnTo = focusReturnStack[index] ?? null;

      set({
        modalStack: modalStack.slice(0, index),
        lockCount: index,
        focusReturnStack: focusReturnStack.slice(0, index),
      });

      return returnTo;
    },

    closeAllModals: () => {
      const returnTo = get().focusReturnStack[0] ?? null;
      set({ modalStack: [], lockCount: 0, focusReturnStack: [] });
      return returnTo;
    },
  },
}));

/* --------------------------------------------------------------------------
   Scoped selector hooks.

   Components use these rather than hand-rolling selectors, so every
   subscription stays narrow and returns a primitive. Returning a fresh object
   or array from a selector would re-render on every store write (and in
   Zustand v5 can loop), so none of these do.
-------------------------------------------------------------------------- */

/** Boolean — re-renders only when THIS overlay opens or closes. */
export const useIsModalOpen = (id) =>
  useUiStore((s) => s.modalStack.includes(id));

/** String | null — the top of the stack. */
export const useTopModal = () =>
  useUiStore((s) => s.modalStack[s.modalStack.length - 1] ?? null);

/** Boolean — whether any overlay currently holds the scroll lock. */
export const useIsScrollLocked = () => useUiStore((s) => s.lockCount > 0);

/** Number — stack depth, for the two-stage Escape. */
export const useModalDepth = () => useUiStore((s) => s.modalStack.length);

/** Object | null — the current toast. Stable reference until it changes. */
export const useToast = () => useUiStore((s) => s.toast);

/** Boolean — whether the listing is saved to the wishlist. */
export const useWishlisted = () => useUiStore((s) => s.wishlisted);

/** Stable action namespace — subscribing to it never triggers a re-render. */
export const useUiActions = () => useUiStore((s) => s.actions);
