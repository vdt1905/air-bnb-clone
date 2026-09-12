import { create } from 'zustand';
import { useUiStore } from './uiStore.js';
import { MODALS } from '../constants/modals.js';

/**
 * Gallery state: which photo is showing, and the open/close actions for the
 * Photo Tour and Lightbox.
 *
 * Why this is shared state rather than useState: the trigger lives in
 * PhotoGrid, but the consumers (PhotoTour, Lightbox) are portal siblings in a
 * different subtree, and the selected photo has to survive the unmount of the
 * component that set it. Both halves of the placement rule are met
 * (TECHNICAL_ARCHITECTURE.md §3.1).
 *
 * Open/closed is NOT duplicated here. This store owns the photo cursor and
 * delegates stack, scroll-lock and focus bookkeeping to uiStore, so there is
 * exactly one source of truth for "is the tour open".
 *
 * Zustand v5: `actions` is created once and never replaced, so selecting it is
 * referentially stable. Every state slice is a primitive so atomic selectors
 * let React bail out.
 */
const clamp = (index, count) => Math.min(Math.max(index, 0), Math.max(count - 1, 0));

export const useGalleryStore = create((set, get) => ({
  /** Index into listing.photos — the single cursor both overlays read. */
  currentIndex: 0,
  /** 'next' | 'prev' — direction of the last move, for transitions. */
  direction: 'next',
  /** Total photos, so next/prev can clamp without reading the listing. */
  photoCount: 0,
  /** Room group the tour is scrolled to. */
  activeRoomGroup: null,

  actions: {
    setPhotoCount: (photoCount) => {
      if (get().photoCount === photoCount) return;
      set({ photoCount, currentIndex: clamp(get().currentIndex, photoCount) });
    },

    setActiveRoomGroup: (activeRoomGroup) => {
      if (get().activeRoomGroup === activeRoomGroup) return;
      set({ activeRoomGroup });
    },

    /** Current image. Clamped — never wraps. */
    setCurrentIndex: (index) => {
      const { currentIndex, photoCount } = get();
      const next = clamp(index, photoCount);
      if (next === currentIndex) return; // no-op writes would re-render subscribers
      set({ currentIndex: next, direction: next > currentIndex ? 'next' : 'prev' });
    },

    /**
     * Next / previous image.
     *
     * Clamped rather than wrapping: the reference hides `Previous` at index 0
     * and never cycles past the end (INTERACTION_SPEC.md §3.4).
     */
    nextPhoto: () => get().actions.setCurrentIndex(get().currentIndex + 1),
    prevPhoto: () => get().actions.setCurrentIndex(get().currentIndex - 1),

    /* ---- Photo Tour ---------------------------------------------------- */

    openPhotoTour: (index = 0, triggerEl = null) => {
      get().actions.setCurrentIndex(index);
      useUiStore.getState().actions.openModal(MODALS.PHOTO_TOUR, triggerEl);
    },

    /** Closes the tour and anything above it (i.e. the lightbox too). */
    closePhotoTour: () => useUiStore.getState().actions.closeModal(MODALS.PHOTO_TOUR),

    /* ---- Lightbox ------------------------------------------------------ */

    openLightbox: (index, triggerEl = null) => {
      if (typeof index === 'number') get().actions.setCurrentIndex(index);
      useUiStore.getState().actions.openModal(MODALS.LIGHTBOX, triggerEl);
    },

    /** Closes only the lightbox — the tour beneath it stays open and locked. */
    closeLightbox: () => useUiStore.getState().actions.closeModal(MODALS.LIGHTBOX),

    reset: () => set({ currentIndex: 0, direction: 'next', activeRoomGroup: null }),
  },
}));

/* --------------------------------------------------------------------------
   Scoped selector hooks — narrow subscriptions returning primitives.
-------------------------------------------------------------------------- */

/** Number — re-renders only when the photo cursor actually moves. */
export const useCurrentPhotoIndex = () => useGalleryStore((s) => s.currentIndex);

export const usePhotoCount = () => useGalleryStore((s) => s.photoCount);

export const useGalleryDirection = () => useGalleryStore((s) => s.direction);

export const useActiveRoomGroup = () => useGalleryStore((s) => s.activeRoomGroup);

/** Booleans, read from uiStore so open/closed lives in exactly one place. */
export const useIsPhotoTourOpen = () =>
  useUiStore((s) => s.modalStack.includes(MODALS.PHOTO_TOUR));

export const useIsLightboxOpen = () =>
  useUiStore((s) => s.modalStack.includes(MODALS.LIGHTBOX));

/** True only on the first photo — the reference hides `Previous` there. */
export const useHasPrevPhoto = () => useGalleryStore((s) => s.currentIndex > 0);

export const useHasNextPhoto = () =>
  useGalleryStore((s) => s.currentIndex < s.photoCount - 1);

/** Stable action namespace — subscribing to it never triggers a re-render. */
export const useGalleryActions = () => useGalleryStore((s) => s.actions);
