import { create } from 'zustand';
import { getListing } from '../services/listingService.js';

/**
 * Server data for the listing page.
 *
 * Qualifies as shared state because ~12 components across different subtrees
 * read it and it must outlive the component that triggered the fetch
 * (TECHNICAL_ARCHITECTURE.md §3.1). Nothing else lives here — dates, guests
 * and modal state have their own homes.
 *
 * Zustand v5: `actions` is created once, so selecting it is referentially
 * stable. Slices are read with atomic selectors.
 */
export const useListingStore = create((set, get) => ({
  listing: null,
  status: 'idle', // idle | loading | success | error
  error: null,

  actions: {
    fetchListing: async (id) => {
      if (!id) return;

      set({ status: 'loading', error: null });
      try {
        const listing = await getListing(id);
        set({ listing, status: 'success', error: null });
      } catch (error) {
        set({ listing: null, status: 'error', error });
      }
    },

    refetch: () => {
      const id = get().listing?.id;
      if (id) get().actions.fetchListing(id);
    },

    reset: () => set({ listing: null, status: 'idle', error: null }),
  },
}));

/* --------------------------------------------------------------------------
   Scoped selector hooks.

   Field-level selectors matter here: without them, every component reading the
   listing would re-render on any store write. `usePhotos` and friends return
   the SAME array reference the payload already holds — they never build a new
   one, which would defeat React's bail-out.
-------------------------------------------------------------------------- */

export const useListingStatus = () => useListingStore((s) => s.status);

export const useListingError = () => useListingStore((s) => s.error);

export const useListingData = () => useListingStore((s) => s.listing);

export const usePhotos = () => useListingStore((s) => s.listing?.photos ?? null);

export const useHost = () => useListingStore((s) => s.listing?.host ?? null);

export const useAmenities = () => useListingStore((s) => s.listing?.amenities ?? null);

/** Stable action namespace — subscribing to it never triggers a re-render. */
export const useListingActions = () => useListingStore((s) => s.actions);
