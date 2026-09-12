import { listings } from '../data/listings.js';

/**
 * Data access + shape normalisation.
 *
 * Knows nothing about HTTP. Its job is to guarantee that whatever leaves this
 * layer matches the documented payload (TECHNICAL_ARCHITECTURE.md §5.4), so no
 * downstream layer has to defend against missing fields.
 *
 * Two rules enforced here:
 *   1. No formatted strings — prices stay numbers, dates stay ISO.
 *   2. Unavailable amenities are KEPT, never filtered. The reference renders
 *      them with strikethrough (REFERENCE_ANALYSIS.md §6), so dropping them
 *      server-side would lose information the UI needs.
 */

const asArray = (value) => (Array.isArray(value) ? value : []);

/** Derives room groups from the photo list when not supplied explicitly. */
function deriveRoomGroups(photos) {
  const seen = new Map();
  for (const photo of photos) {
    if (photo.room && !seen.has(photo.room)) {
      seen.set(photo.room, { name: photo.room, details: [] });
    }
  }
  return [...seen.values()];
}

function normalize(listing) {
  if (!listing) return null;

  const photos = asArray(listing.photos).map((photo, index) => ({
    id: photo.id ?? `p${index + 1}`,
    url: photo.url,
    alt: photo.alt ?? '',
    room: photo.room ?? null,
    width: photo.width ?? 1440,
    height: photo.height ?? 960,
    heroOrder: photo.heroOrder ?? null,
  }));

  const roomGroups = asArray(listing.roomGroups).length
    ? listing.roomGroups
    : deriveRoomGroups(photos);

  return {
    id: listing.id,
    title: listing.title,
    propertyType: listing.propertyType,
    location: listing.location,
    capacity: listing.capacity,

    rating: {
      value: listing.rating?.value ?? null,
      count: listing.rating?.count ?? 0,
      isNew: Boolean(listing.rating?.isNew),
    },

    photos,
    photoCount: photos.length,
    roomGroups,

    host: listing.host
      ? {
          ...listing.host,
          verified: Boolean(listing.host.verified),
          facts: asArray(listing.host.facts),
          coHosts: asArray(listing.host.coHosts),
        }
      : null,
    highlights: asArray(listing.highlights),
    description: listing.description,

    // Deliberately unfiltered.
    amenities: asArray(listing.amenities),
    amenityCount: asArray(listing.amenities).length,

    sleepingArrangements: asArray(listing.sleepingArrangements),
    pricing: listing.pricing,

    availability: {
      blockedDates: asArray(listing.availability?.blockedDates),
      minNights: listing.availability?.minNights ?? 1,
    },

    reviews: asArray(listing.reviews),
    policies: listing.policies,

    // Sections added to match the reference screenshots. All optional; the
    // client renders nothing for absent ones.
    guestFavourite: Boolean(listing.guestFavourite),
    ratingBreakdown: listing.ratingBreakdown ?? null,
    reviewTags: asArray(listing.reviewTags),
    promo: listing.promo ?? null,
    translated: Boolean(listing.translated),
    neighbourhood: listing.neighbourhood ?? null,
    nearbyStays: asArray(listing.nearbyStays),
  };
}

/** Returns the normalised listing, or null when the id is unknown. */
export function findById(id) {
  const listing = listings.find((entry) => entry.id === id);
  return listing ? normalize(listing) : null;
}

/** Returns every listing, normalised. Not currently routed. */
export function findAll() {
  return listings.map(normalize);
}
