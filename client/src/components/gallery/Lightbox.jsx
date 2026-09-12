import { useRef, useCallback, useEffect } from 'react';
import ModalShell from '../modal/ModalShell.jsx';
import PhotoCounter from './PhotoCounter.jsx';
import Icon from '../common/Icon.jsx';
import { useCloseModal, useIsTopModal } from '../../hooks/useModalStack.js';
import { useKeyboardNav } from '../../hooks/useKeyboardNav.js';
import {
  useIsLightboxOpen,
  useCurrentPhotoIndex,
  useHasPrevPhoto,
  useHasNextPhoto,
  useGalleryActions,
} from '../../store/galleryStore.js';
import { useListingData } from '../../store/listingStore.js';
import { MODALS } from '../../constants/modals.js';
import { SLOT_WIDTH } from '../../constants/images.js';
import {useUiActions} from '../../store/uiStore.js';

/**
 * Full-screen Lightbox, stacked over the Photo Tour.
 *
 * Measured contract (INTERACTION_SPEC.md §3):
 *   - reachable ONLY from a photo inside the Photo Tour
 *   - background black #000, fully opaque, full viewport
 *   - image box inset 96px L/R and 112px T/B, `object-fit: contain`
 *     (the page's only `contain` — everything else is `cover`)
 *   - Close at 40,40 as ✕ + "Close" label, radius 8px
 *   - counter top-centre + a separate aria-live announcement
 *   - Previous ABSENT at index 0; Next vertically centred
 *   - Arrow keys move, clamped, never wrapping
 *   - Escape closes ONLY this layer: the tour stays open and the body stays
 *     locked (the lock is reference-counted in uiStore)
 *
 * State comes entirely from galleryStore — this component holds no photo
 * index of its own.
 *
 * The photo-change transition is [N] (never captured on the reference), so
 * this swaps instantly: an invented cross-fade is the riskier guess
 * (IMPLEMENTATION_PLAN M18).
 */
const INSET_X = 96;
const INSET_Y = 112;

function NavButton({ direction, onClick }) {
  const isNext = direction === 'next';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? 'Next photo' : 'Previous photo'}
      data-testid={isNext ? 'lightbox-next' : 'lightbox-prev'}
      className="absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink motion-icon hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      style={isNext ? { right: '32px' } : { left: '32px' }}
    >
      <Icon name={isNext ? 'chevronRight' : 'chevronLeft'} size={12} strokeWidth={3} />
    </button>
  );
}

export default function Lightbox() {
  const {openModal}=useUiActions();
  const isOpen = useIsLightboxOpen();
  const isTop = useIsTopModal(MODALS.LIGHTBOX);
  const listing = useListingData();
  const index = useCurrentPhotoIndex();
  const hasPrev = useHasPrevPhoto();
  const hasNext = useHasNextPhoto();
  const { nextPhoto, prevPhoto } = useGalleryActions();
  const close = useCloseModal(MODALS.LIGHTBOX);
  const containerRef = useRef(null);

  const onNext = useCallback(() => nextPhoto(), [nextPhoto]);
  const onPrev = useCallback(() => prevPhoto(), [prevPhoto]);

  // Arrows are live only while the Lightbox is the topmost dialog.
  useKeyboardNav({ active: isOpen && isTop, onNext, onPrev });

  // Warm the adjacent photos so next/previous swaps land instantly instead of
  // flashing an empty frame. Not an animation — it is what lets us keep the
  // measured instant swap honest under rapid navigation.
  const photoList = listing?.photos;
  useEffect(() => {
    if (!isOpen || !photoList) return;
    for (const offset of [1, -1]) {
      const neighbour = photoList[index + offset];
      if (neighbour) {
        const img = new Image();
        img.src = neighbour.url;
      }
    }
  }, [isOpen, index, photoList]);

  if (!isOpen || !listing) return null;

  const photos = listing.photos ?? [];
  const photo = photos[index];
  if (!photo) return null;

  return (
    <ModalShell
      id={MODALS.LIGHTBOX}
      label={`Photo ${index + 1} of ${photos.length}`}
      initialFocusRef={containerRef}
      className="bg-black motion-safe:animate-[fade-in_180ms_cubic-bezier(0.2,0,0,1)]"
    >
      {/* Focus lands on the dialog container, as measured. tabIndex -1 makes
          it programmatically focusable without adding a tab stop. */}
      <div ref={containerRef} tabIndex={-1} className="h-full w-full outline-none">
        {/* Top bar */}
        <div
          className="absolute inset-x-0 flex items-center justify-between"
          style={{ top: '40px', paddingLeft: '40px', paddingRight: '40px' }}
        >
          <button
            type="button"
            onClick={close}
            data-testid="lightbox-close"
            className="inline-flex items-center justify-center gap-2 text-base text-white motion-icon hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            style={{ width: '89px', height: '34px', borderRadius: '8px' }}
          >
            <Icon name="close" size={16} strokeWidth={2} />
            Close
          </button>

          <PhotoCounter current={index + 1} total={photos.length} />

          <div className="flex items-center" style={{ gap: '20px' }}>
            <button
              type="button"
              aria-label="Share this photo"
              onClick={e=>openModal(MODALS.SHARE,e.currentTarget)}
              className="flex h-4 w-4 items-center justify-center rounded-full text-white motion-icon-sm hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Icon name="share" size={16} strokeWidth={2} />
            </button>
            <button
              type="button"
              aria-label="Save this photo"
              onClick={e=>openModal(MODALS.LOGIN,e.currentTarget)}
              className="flex h-4 w-4 items-center justify-center rounded-full text-white motion-icon-sm hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <Icon name="heart" size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Image region. Inset 96 / 112 as measured; the <img> fills that box
            and `contain` letterboxes the picture inside it. */}
        <div
          tabIndex={0}
          role="group"
          aria-label={photo.alt}
          data-testid="lightbox-image-region"
          className="absolute outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          style={{
            left: `${INSET_X}px`,
            right: `${INSET_X}px`,
            top: `${INSET_Y}px`,
            bottom: `${INSET_Y}px`,
          }}
        >
          {/* No `key` here on purpose: keying by photo id would unmount and
              remount the element on every move, blanking the frame mid-swap
              during rapid next/previous. Reusing one element plus the neighbour
              preload above keeps the change instant, which is what the
              reference does — its photo-change transition is [N], so an
              invented cross-fade would be the riskier guess. */}
          <img
            src={photo.url}
            alt=""
            aria-hidden="true"
            width={SLOT_WIDTH.lightbox}
            height={(SLOT_WIDTH.lightbox * 2) / 3}
            decoding="async"
            data-testid="lightbox-image"
            className="h-full w-full"
            style={{ objectFit: 'contain', objectPosition: '50% 50%', borderRadius: 0 }}
          />
        </div>

        {/* Previous is absent on the first photo — measured, not styling. */}
        {hasPrev && <NavButton direction="prev" onClick={onPrev} />}
        {hasNext && <NavButton direction="next" onClick={onNext} />}
      </div>
    </ModalShell>
  );
}
