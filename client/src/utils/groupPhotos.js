/**
 * photos[] → room sections for the Photo Tour.
 *
 * The reference serves ONE photo list rendered three ways — gallery (5 of 34),
 * tour (all 34, grouped by room) and lightbox (all 34, one at a time)
 * (ASSET_INVENTORY.md §2.3). Grouping is therefore derived here rather than
 * duplicated in the payload.
 *
 * `roomGroups` supplies the canonical order and the sub-details line
 * ("King bed", "Air conditioning · TV"). Any room present on a photo but
 * missing from roomGroups is still emitted, so no photo is ever dropped.
 *
 * Each photo keeps its `index` into the original array, because the Lightbox
 * addresses photos by that index.
 */
export function groupPhotos(photos = [], roomGroups = []) {
  const byRoom = new Map();

  photos.forEach((photo, index) => {
    const room = photo.room ?? 'Photos';
    if (!byRoom.has(room)) byRoom.set(room, []);
    byRoom.get(room).push({ ...photo, index });
  });

  const sections = [];
  const seen = new Set();

  // Canonical order first.
  for (const group of roomGroups) {
    const roomPhotos = byRoom.get(group.name);
    if (!roomPhotos?.length) continue;
    seen.add(group.name);
    sections.push({
      name: group.name,
      details: group.details ?? [],
      photos: roomPhotos,
    });
  }

  // Then anything not covered by roomGroups, in first-appearance order.
  for (const [room, roomPhotos] of byRoom) {
    if (seen.has(room)) continue;
    sections.push({ name: room, details: [], photos: roomPhotos });
  }

  return sections;
}

/** The lead photo of each section — the Photo Tour's category strip. */
export const sectionThumbnails = (sections) =>
  sections.map((section) => ({
    name: section.name,
    photo: section.photos[0],
  }));
