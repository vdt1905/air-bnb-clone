// Modal identities. Values marked `urlValue` are deep-linkable because the
// reference puts them in the URL; the rest are store-only.
// See INTERACTION_SPEC.md §0.1 and TECHNICAL_ARCHITECTURE.md §3.2.
export const MODALS = {
  PHOTO_TOUR: 'photos',
  LIGHTBOX: 'lightbox',
  AMENITIES: 'amenities',
  DESCRIPTION: 'description',
  SHARE: 'share',
  LOGIN: 'login',
};

// Only these sync to the URL.
export const URL_BACKED_MODALS = [MODALS.PHOTO_TOUR, MODALS.DESCRIPTION];

export const URL_PARAM = { modal: 'modal', photo: 'photo' };
