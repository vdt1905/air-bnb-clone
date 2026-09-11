// The reference serves one 3:2 master through a fixed width ladder.
// See ASSET_INVENTORY.md §2.1.
export const IMAGE_WIDTHS = [120, 240, 480, 720, 1200, 1440];

export const ASPECT_RATIO = 3 / 2;

// Which ladder rung each slot requests, as measured.
export const SLOT_WIDTH = {
  galleryHero: 1200,
  gallerySecondary: 720,
  tourLarge: 1200,
  tourSecondary: 720,
  tourThumb: 480,
  lightbox: 1440,
  sleeping: 480,
  avatarSmall: 120,
  avatarLarge: 240,
};
