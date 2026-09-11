// Static seed data. The only module that knows where listings physically live
// is listingModel.js, so swapping this for a database touches one file.
//
// Fully populated in IMPLEMENTATION_PLAN M3, which requires:
//   - 34 photos (3:2), grouped into 9 rooms
//   - >= 16 amenities, including >= 2 with available: false
//   - a description long enough to exceed the 8-line clamp
//   - two fixtures: one rated, one isNew
export const listings = [];
