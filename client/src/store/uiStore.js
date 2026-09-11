import { create } from 'zustand';

// Overlay orchestration: the modal stack, a reference-counted scroll lock and
// the focus-return chain.
//
// closeTopModal() is the single most important function in the client. It pops
// ONE level, restores THAT level's focus target, and only releases the scroll
// lock at zero — which is what reproduces the measured two-stage Escape where
// the body stays locked between the first and second press.
// See INTERACTION_SPEC.md §3.6.
export const useUiStore = create((set, get) => ({
  modalStack: [],
  lockCount: 0,
  focusReturnStack: [],

  openModal: (id, triggerEl = null) =>
    set((s) => ({
      modalStack: [...s.modalStack, id],
      lockCount: s.lockCount + 1,
      focusReturnStack: [...s.focusReturnStack, triggerEl],
    })),

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

  closeAllModals: () => set({ modalStack: [], lockCount: 0, focusReturnStack: [] }),

  isOpen: (id) => get().modalStack.includes(id),
  topModal: () => get().modalStack[get().modalStack.length - 1] ?? null,
}));
