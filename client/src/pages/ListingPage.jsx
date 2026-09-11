import { useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing.js';
import PageContainer from '../components/layout/PageContainer.jsx';
import Skeleton from '../components/common/Skeleton.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

// Foundation shell only (IMPLEMENTATION_PLAN M4).
// Section components land in M5-M14; overlays in M15-M16.
export default function ListingPage() {
  const { id } = useParams();
  const { listing, status, error, refetch } = useListing(id);

  return (
    <main id="main-content">
      <PageContainer className="py-10">
        {status === 'loading' && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton style={{ height: '476.1px' }} className="w-full rounded-gallery" />
          </div>
        )}

        {status === 'error' && <ErrorState message={error?.message} onRetry={refetch} />}

        {status === 'success' && listing && (
          <div className="text-body text-muted">
            <h1 className="text-h1 text-ink">{listing.title}</h1>
            <p className="mt-2">
              Foundation ready — {listing.photos?.length ?? 0} photos loaded. UI sections
              are implemented in milestones M5–M16.
            </p>
          </div>
        )}
      </PageContainer>
    </main>
  );
}
