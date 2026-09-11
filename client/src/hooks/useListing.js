import { useEffect } from 'react';
import { useListingStore } from '../store/listingStore.js';

export function useListing(id) {
  const listing = useListingStore((s) => s.listing);
  const status = useListingStore((s) => s.status);
  const error = useListingStore((s) => s.error);
  const fetchListing = useListingStore((s) => s.fetchListing);

  useEffect(() => {
    if (id) fetchListing(id);
  }, [id, fetchListing]);

  return { listing, status, error, refetch: () => fetchListing(id) };
}
