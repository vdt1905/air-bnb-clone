import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useListing } from '../hooks/useListing.js';
import { useBookingParams } from '../hooks/useBookingParams.js';
import { isRangeAvailable } from '../utils/dateRange.js';
import { useUiActions } from '../store/uiStore.js';

import Header from '../components/layout/Header.jsx';
import StickyNav from '../components/layout/StickyNav.jsx';
import PageContainer from '../components/layout/PageContainer.jsx';
import TwoColumn from '../components/layout/TwoColumn.jsx';

import Skeleton from '../components/common/Skeleton.jsx';
import ErrorState from '../components/common/ErrorState.jsx';

import ListingTitleBar from '../components/listing/ListingTitleBar.jsx';
import PhotoGrid from '../components/gallery/PhotoGrid.jsx';
import Overview from '../components/listing/Overview.jsx';
import GuestFavouriteCard from '../components/listing/GuestFavouriteCard.jsx';
import HostStrip from '../components/listing/HostStrip.jsx';
import Highlights from '../components/listing/Highlights.jsx';
import Description from '../components/listing/Description.jsx';
import SleepingArrangement from '../components/listing/SleepingArrangement.jsx';
import Amenities from '../components/listing/Amenities.jsx';
import AvailabilityCalendar from '../components/listing/AvailabilityCalendar.jsx';
import Reviews from '../components/listing/Reviews.jsx';
import LocationSection from '../components/listing/LocationSection.jsx';
import HostSection from '../components/listing/HostSection.jsx';
import ThingsToKnow from '../components/listing/ThingsToKnow.jsx';
import NearbyStays from '../components/listing/NearbyStays.jsx';

import BookingCard from '../components/booking/BookingCard.jsx';
import ModalRoot from '../components/modal/ModalRoot.jsx';

/**
 * Composition only â every section is its own component
 * (TECHNICAL_ARCHITECTURE.md Â§2). This page holds no layout logic beyond the
 * 1120px container and the 653.3 / 93.4 / 372.3 split.
 *
 * Sections carry ids (`photos`, `amenities`, `reviews`, `location`) so the
 * sticky sub-nav can scroll-spy them.
 */
function LoadingState() {
  return (
    <PageContainer>
      <div className="space-y-6 py-8">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="w-full rounded-gallery" style={{ height: '476.1px' }} />
        <div className="flex gap-[93.4px]">
          <div className="flex-1 space-y-4">
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-40 w-full" />
          </div>
          <Skeleton style={{ width: '372.3px', height: '300px' }} className="rounded-card" />
        </div>
      </div>
    </PageContainer>
  );
}

export default function ListingPage() {
  const { id } = useParams();
  const { listing, status, error, refetch } = useListing(id);
  const bookingRef = useRef(null);

  // The sticky nav's Reserve must NOT move the page: the reader stays exactly
  // where they were. With valid dates it raises the same toast as the card's
  // CTA; without them it says what is missing instead of scrolling to the card.
  const { checkIn, checkOut } = useBookingParams();
  const { showToast } = useUiActions();
  const reserveInPlace = () => {
    const reservable =
      Boolean(checkIn && checkOut) &&
      isRangeAvailable(checkIn, checkOut, listing?.availability.blockedDates, listing?.availability.minNights);
    showToast(reservable ? 'You won’t be charged yet' : 'Add your travel dates to reserve');
  };

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-card focus:bg-white focus:px-4 focus:py-3 focus:text-ink focus:shadow-card"
      >
        Skip to content
      </a>

      <Header />

      <main id="main-content">
        {status === 'loading' && <LoadingState />}

        {status === 'error' && (
          <PageContainer>
            <ErrorState message={error?.message} onRetry={refetch} />
          </PageContainer>
        )}

        {status === 'success' && listing && (
          <>
            <StickyNav listing={listing} onReserve={reserveInPlace} />

            <PageContainer>
              <ListingTitleBar title={listing.title} />

              <PhotoGrid photos={listing.photos} />

              <TwoColumn
                main={
                  <>
                    <Overview listing={listing} hideRating={listing.guestFavourite} />
                    {listing.guestFavourite && !listing.rating.isNew && (
                      <div className="pb-8">
                        <GuestFavouriteCard rating={listing.rating} />
                      </div>
                    )}
                    <HostStrip host={listing.host} />
                    <Highlights highlights={listing.highlights} />
                    <Description description={listing.description} translated={listing.translated} />
                    <SleepingArrangement arrangements={listing.sleepingArrangements} />
                    <Amenities amenities={listing.amenities} />
                    <AvailabilityCalendar availability={listing.availability} />
                  </>
                }
                aside={
                  <div ref={bookingRef}>
                    <BookingCard listing={listing} />
                  </div>
                }
              />

              <Reviews
                rating={listing.rating}
                reviews={listing.reviews}
                breakdown={listing.ratingBreakdown}
                tags={listing.reviewTags}
                guestFavourite={listing.guestFavourite}
              />
              <LocationSection location={listing.location} neighbourhood={listing.neighbourhood} />
              <HostSection host={listing.host} />
              <ThingsToKnow policies={listing.policies} />
              <NearbyStays stays={listing.nearbyStays} currency={listing.pricing.currency} />
            </PageContainer>
          </>
        )}
      </main>

      {/* Overlays portal out of the page tree (TECHNICAL_ARCHITECTURE.md Â§2). */}
      <ModalRoot />
    </>
  );
}
