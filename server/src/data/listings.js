/**
 * Static seed data.
 *
 * This is the ONLY module that knows where listing data physically lives.
 * `listingModel.js` is the sole consumer, so replacing this with a database
 * touches exactly one file (TECHNICAL_ARCHITECTURE.md §9.3).
 *
 * Shape: TECHNICAL_ARCHITECTURE.md §5.4
 * Requirements: IMPLEMENTATION_PLAN.md M3
 *
 * Image paths are local static paths served by the client. The files
 * themselves are produced in M7/M20 — see ASSET_INVENTORY.md §10. Every
 * master is 3:2 (1440x960), matching the measured reference.
 */

const PHOTO_BASE = '/images/listings';

/**
 * Nine room groups totalling 34 photos, matching the reference's Photo Tour
 * structure (REFERENCE_ANALYSIS.md §12).
 */
const PHOTO_PLAN = [
  { room: 'Living room', count: 5, details: ['Air conditioning', 'TV'] },
  { room: 'Full kitchen', count: 4, details: ['Induction hob', 'Refrigerator'] },
  { room: 'Dining area', count: 3, details: ['Seats 6'] },
  { room: 'Bedroom 1', count: 5, details: ['1 king bed'] },
  { room: 'Bedroom 2', count: 4, details: ['1 king bed'] },
  { room: 'Full bathroom 1', count: 3, details: ['Hot water', 'Shower'] },
  { room: 'Full bathroom 2', count: 3, details: ['Hot water'] },
  { room: 'Exterior', count: 4, details: ['Balcony'] },
  { room: 'Pool', count: 3, details: ['Shared outdoor pool'] },
];

const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Derives the flat photo list from the room plan.
 *
 * The reference serves one photo list rendered three ways — gallery (5 of 34),
 * Photo Tour (all 34, grouped) and Lightbox (all 34, one at a time). Keeping a
 * single ordered array with a `room` tag is what makes that possible without
 * duplicating assets (ASSET_INVENTORY.md §2.3).
 */
function buildPhotos(listingSlug, plan) {
  const photos = [];
  let index = 0;

  for (const { room, count } of plan) {
    for (let n = 1; n <= count; n += 1) {
      index += 1;
      const roomSlug = slugify(room);
      photos.push({
        id: `p${String(index).padStart(2, '0')}`,
        url: `${PHOTO_BASE}/${listingSlug}/${roomSlug}-${String(n).padStart(2, '0')}.jpg`,
        alt: `${room} — view ${n}`,
        room,
        width: 1440,
        height: 960,
      });
    }
  }

  return photos;
}

const buildRoomGroups = (plan) =>
  plan.map(({ room, details }) => ({ name: room, details }));

/** Inclusive date range as ISO strings. No formatted dates leave the API. */
function dateRange(startIso, nights) {
  const dates = [];
  const cursor = new Date(`${startIso}T00:00:00Z`);
  for (let i = 0; i < nights; i += 1) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return dates;
}

/* -------------------------------------------------------------------------
   Fixture 1 — rated listing.
   Renders the Overview block as "4.84 · 76 reviews".
------------------------------------------------------------------------- */
const ratedListing = {
  id: 'listing-001',
  title: 'Sea Breeze 2BHK with Pool, Steps from Candolim Beach',
  propertyType: 'Entire rental unit',

  location: {
    city: 'Candolim',
    region: 'Goa',
    country: 'India',
    coordinates: { lat: 15.5186, lng: 73.7626 },
  },

  capacity: { guests: 4, bedrooms: 2, beds: 2, bathrooms: 2 },

  rating: { value: 4.84, count: 76, isNew: false },

  photos: buildPhotos('listing-001', PHOTO_PLAN),
  roomGroups: buildRoomGroups(PHOTO_PLAN),

  host: {
    id: 'host-001',
    name: 'Sangita',
    avatarUrl: '/images/hosts/host-001.jpg',
    monthsHosting: 7,
    reviewCount: 69,
    rating: 4.67,
    bio: 'We host homes designed for comfort and calm. Hosting is more than providing a stay — it is about making you feel welcome and genuinely at home.',
    responseRate: 100,
    responseTime: 'within an hour',
  },

  highlights: [
    {
      icon: 'key',
      title: 'Self check-in',
      subtitle: 'You can check in with the building staff.',
    },
    {
      icon: 'pool',
      title: 'Dive right in',
      subtitle: 'This is one of the few places in the area with a pool.',
    },
    {
      icon: 'sparkle',
      title: 'Great for families',
      subtitle: 'Relax with the whole family at this peaceful place to stay.',
    },
  ],

  // Long enough to exceed the measured 8-line clamp at 653.3px, so the
  // "Show more" control renders (INTERACTION_SPEC.md §1.7).
  description: {
    summary:
      'Wake up to the sound of the Arabian Sea just a few minutes from your door. This bright two-bedroom apartment sits on a quiet lane in Candolim, close enough to walk to the beach shacks but far enough back that evenings stay peaceful. The living room opens onto a balcony that catches the afternoon breeze, and the kitchen is fully equipped for anything from morning coffee to a full dinner for six. Both bedrooms have king beds, blackout curtains and their own bathrooms with hot water around the clock. Guests share a clean outdoor pool with the rest of the building, which is rarely busy outside of December. The apartment is on the third floor with lift access, and building staff are on site to let you in whenever you arrive. Fresh linen, towels and basic toiletries are provided, along with fast wifi that holds up for video calls if you are working while you travel. Parking is free on the premises and there is a supermarket two minutes away on foot.',
    sections: [
      {
        heading: 'The space',
        body: 'Two king bedrooms, two full bathrooms, an open-plan living and dining area, and a balcony overlooking the garden. Roughly 1,100 square feet on the third floor with lift access.',
      },
      {
        heading: 'Guest access',
        body: 'Guests have the entire apartment plus shared access to the building pool and garden. Building staff can assist with luggage and check-in at any hour.',
      },
      {
        heading: 'The neighbourhood',
        body: 'Candolim Beach is a nine-minute walk. Restaurants, pharmacies and a supermarket are all within a few hundred metres. Fort Aguada is a fifteen-minute drive.',
      },
    ],
  },

  // 18 amenities, 3 of them unavailable. Unavailable entries are carried in
  // the payload rather than filtered, because the reference renders them with
  // strikethrough (REFERENCE_ANALYSIS.md §6).
  amenities: [
    { id: 'kitchen', label: 'Kitchen', icon: 'kitchen', category: 'Cooking and dining', available: true },
    { id: 'wifi', label: 'Wifi', icon: 'wifi', category: 'Internet and office', available: true },
    { id: 'parking', label: 'Free parking on premises', icon: 'car', category: 'Parking and facilities', available: true },
    { id: 'pool', label: 'Pool', icon: 'pool', category: 'Parking and facilities', available: true },
    { id: 'pets', label: 'Pets allowed', icon: 'pet', category: 'Property features', available: true },
    { id: 'tv', label: 'TV', icon: 'tv', category: 'Entertainment', available: true },
    { id: 'washer', label: 'Washing machine', icon: 'washer', category: 'Bedroom and laundry', available: true },
    { id: 'aircon', label: 'Air conditioning', icon: 'snowflake', category: 'Heating and cooling', available: true },
    { id: 'hot-water', label: 'Hot water', icon: 'droplet', category: 'Bathroom', available: true },
    { id: 'hairdryer', label: 'Hairdryer', icon: 'hairdryer', category: 'Bathroom', available: true },
    { id: 'shampoo', label: 'Shampoo', icon: 'bottle', category: 'Bathroom', available: true },
    { id: 'essentials', label: 'Essentials', icon: 'essentials', category: 'Bedroom and laundry', available: true },
    { id: 'hangers', label: 'Hangers', icon: 'hanger', category: 'Bedroom and laundry', available: true },
    { id: 'iron', label: 'Iron', icon: 'iron', category: 'Bedroom and laundry', available: true },
    { id: 'workspace', label: 'Dedicated workspace', icon: 'desk', category: 'Internet and office', available: true },
    { id: 'balcony', label: 'Balcony', icon: 'balcony', category: 'Property features', available: true },
    { id: 'co-alarm', label: 'Carbon monoxide alarm', icon: 'alarm', category: 'Home safety', available: false },
    { id: 'smoke-alarm', label: 'Smoke alarm', icon: 'alarm', category: 'Home safety', available: false },
    { id: 'heating', label: 'Heating', icon: 'heat', category: 'Heating and cooling', available: false },
  ],

  sleepingArrangements: [
    {
      name: 'Bedroom 1',
      beds: ['1 king bed'],
      imageUrl: `${PHOTO_BASE}/listing-001/bedroom-1-01.jpg`,
    },
    {
      name: 'Bedroom 2',
      beds: ['1 king bed'],
      imageUrl: `${PHOTO_BASE}/listing-001/bedroom-2-01.jpg`,
    },
  ],

  // Numbers only. Formatting is the client's job (TECHNICAL_ARCHITECTURE.md §7).
  pricing: { nightlyRate: 7100, currency: 'INR' },

  availability: {
    blockedDates: [...dateRange('2026-10-10', 6), ...dateRange('2026-12-24', 10)],
    minNights: 2,
  },

  reviews: [
    {
      id: 'r1',
      author: 'Yogesh',
      avatarUrl: '/images/guests/guest-001.jpg',
      rating: 5,
      date: '2026-09-07',
      body: 'Best stay in Candolim. The apartment was spotless, the pool was quiet, and the beach really is a short walk. Sangita replied within minutes every time.',
    },
    {
      id: 'r2',
      author: 'Meera',
      avatarUrl: '/images/guests/guest-002.jpg',
      rating: 5,
      date: '2026-08-21',
      body: 'Spacious and very well kept. The kitchen had everything we needed and the balcony was the best part of the trip. Would book again without hesitating.',
    },
    {
      id: 'r3',
      author: 'Daniel',
      avatarUrl: '/images/guests/guest-003.jpg',
      rating: 4,
      date: '2026-08-02',
      body: 'Great location and comfortable beds. The building can be a little noisy in the morning, but the apartment itself was exactly as described.',
    },
    {
      id: 'r4',
      author: 'Priya',
      avatarUrl: '/images/guests/guest-004.jpg',
      rating: 5,
      date: '2026-07-15',
      body: 'Check-in was effortless even though we arrived late. Wifi was strong enough for a full day of calls. Highly recommended for a longer stay.',
    },
  ],

  policies: {
    checkIn: 'after 2:00 pm',
    checkOut: 'before 11:00 am',
    maxGuests: 4,
    cancellation: 'Free cancellation before 1 October. Cancel before check-in for a partial refund.',
    safety: [
      'Carbon monoxide alarm not reported',
      'Smoke alarm not reported',
      'Not suitable for children and infants',
    ],
  },
};

/* -------------------------------------------------------------------------
   Fixture 2 — new listing.
   Renders the Overview block as "New · 1 review" instead of a rating, which is
   a different code path in the UI (IMPLEMENTATION_PLAN.md M8).
------------------------------------------------------------------------- */
const newListing = {
  ...ratedListing,
  id: 'listing-002',
  title: 'Garden Studio with Balcony, Quiet Lane in Candolim',
  propertyType: 'Entire serviced apartment',
  capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
  rating: { value: null, count: 1, isNew: true },
  photos: buildPhotos('listing-002', PHOTO_PLAN),
  host: {
    ...ratedListing.host,
    id: 'host-002',
    name: 'Arjun',
    avatarUrl: '/images/hosts/host-002.jpg',
    monthsHosting: 2,
    reviewCount: 1,
    rating: null,
  },
  sleepingArrangements: [
    {
      name: 'Bedroom 1',
      beds: ['1 queen bed'],
      imageUrl: `${PHOTO_BASE}/listing-002/bedroom-1-01.jpg`,
    },
  ],
  pricing: { nightlyRate: 4200, currency: 'INR' },
  availability: { blockedDates: dateRange('2026-11-01', 4), minNights: 1 },
  reviews: [
    {
      id: 'r1',
      author: 'Nikhil',
      avatarUrl: '/images/guests/guest-005.jpg',
      rating: 5,
      date: '2026-09-09',
      body: 'Lovely little studio and a very responsive host. Everything was clean and exactly as pictured.',
    },
  ],
};

export const listings = [ratedListing, newListing];
