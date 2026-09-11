import { create } from 'zustand';

// Derived gallery concerns shared between PhotoTour and Lightbox.
// activeIndex is mirrored from the URL (?photo=<id>) — see §3.5.
export const useGalleryStore = create((set, get) => ({
  activeIndex: 0,
  direction: 'next',
  activeRoomGroup: null,
  photoCount: 0,

  setPhotoCount: (photoCount) => set({ photoCount }),
  setActiveRoomGroup: (activeRoomGroup) => set({ activeRoomGroup }),

  setActiveIndex: (index) => {
    const { activeIndex, photoCount } = get();
    const max = Math.max(photoCount - 1, 0);
    const next = Math.min(Math.max(index, 0), max);
    set({ activeIndex: next, direction: next >= activeIndex ? 'next' : 'prev' });
  },

  // Clamped, never wrapping: the reference hides Previous at index 0.
  next: () => get().setActiveIndex(get().activeIndex + 1),
  prev: () => get().setActiveIndex(get().activeIndex - 1),

  reset: () => set({ activeIndex: 0, direction: 'next', activeRoomGroup: null }),
}));
