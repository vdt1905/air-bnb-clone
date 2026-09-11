import { create } from 'zustand';
import { getListing } from '../services/listingService.js';

// Server data only. See TECHNICAL_ARCHITECTURE.md §3.4.
export const useListingStore = create((set) => ({
  listing: null,
  status: 'idle', // idle | loading | success | error
  error: null,

  fetchListing: async (id) => {
    set({ status: 'loading', error: null });
    try {
      const listing = await getListing(id);
      set({ listing, status: 'success', error: null });
    } catch (error) {
      set({ listing: null, status: 'error', error });
    }
  },

  reset: () => set({ listing: null, status: 'idle', error: null }),
}));
