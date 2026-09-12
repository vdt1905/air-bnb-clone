import { useEffect } from 'react';
import {
  useListingData,
  useListingStatus,
  useListingError,
  useListingActions,
} from '../store/listingStore.js';

/**
 * Fetches a listing and exposes its load state.
 *
 * Each field is subscribed separately rather than selecting the whole store,
 * so a component reading only `status` does not re-render when `listing`
 * arrives. `actions` is referentially stable, so it is safe in the effect's
 * dependency array and never re-triggers the fetch.
 */
export function useListing(id) {
  const listing = useListingData();
  const status = useListingStatus();
  const error = useListingError();
  const actions = useListingActions();

  useEffect(() => {
    actions.fetchListing(id);
  }, [id, actions]);

  return {
    listing,
    status,
    error,
    refetch: () => actions.fetchListing(id),
  };
}
