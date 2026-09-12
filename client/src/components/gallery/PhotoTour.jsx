import { useMemo, useRef, useCallback } from 'react';
import ModalShell from '../modal/ModalShell.jsx';
import CategoryStrip from './CategoryStrip.jsx';
import RoomSection from './RoomSection.jsx';
import Icon from '../common/Icon.jsx';
import { useCloseModal } from '../../hooks/useModalStack.js';
import { useIsPhotoTourOpen, useGalleryActions } from '../../store/galleryStore.js';
import { useUiActions, useWishlisted } from '../../store/uiStore.js';
import { useListingData } from '../../store/listingStore.js';
import { groupPhotos } from '../../utils/groupPhotos.js';
import { scrollBehavior } from '../../utils/cn.js';
import { MODALS } from '../../constants/modals.js';

export default function PhotoTour() {
  const isOpen = useIsPhotoTourOpen();
  const listing = useListingData();
  const closeRef = useRef(null);
  const sectionRefs = useRef(new Map());
  const close = useCloseModal(MODALS.PHOTO_TOUR);
  const { openLightbox } = useGalleryActions();
  const { openModal, toggleWishlist } = useUiActions();
  // Same wishlist state as the title bar's Save, so the two hearts agree.
  const saved = useWishlisted();
  const sections = useMemo(() => groupPhotos(listing?.photos, listing?.roomGroups), [listing]);
  const registerRef = useCallback((name, node) => { if (node) sectionRefs.current.set(name, node); else sectionRefs.current.delete(name); }, []);
  const scrollToRoom = name => sectionRefs.current.get(name)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
  if (!isOpen || !listing) return null;
  return <ModalShell id={MODALS.PHOTO_TOUR} label="Photo tour" initialFocusRef={closeRef} className="bg-white overlay-enter">
    <div className="tour-header">
      <button ref={closeRef} className="icon-circle" aria-label="Close photo tour" data-testid="tour-close" onClick={close}><Icon name="chevronLeft" size={22} /></button>
      <h2>Photo tour</h2>
      <div className="flex gap-2">
        <button className="icon-circle" aria-label="Share this place" onClick={e => openModal(MODALS.SHARE, e.currentTarget)}><Icon name="share" size={20} /></button>
        <button
          className="icon-circle"
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          aria-pressed={saved}
          data-testid="tour-save"
          onClick={toggleWishlist}
        >
          <span
            key={saved ? 'on' : 'off'}
            className="inline-flex motion-safe:animate-[heart-pop_320ms_cubic-bezier(0.2,0,0,1)]"
            style={{ color: saved ? 'var(--color-rausch-from)' : 'inherit' }}
          >
            <Icon name="heart" size={21} filled={saved} />
          </span>
        </button>
      </div>
    </div>
    <div data-testid="tour-body" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <div className="tour-content">
        <CategoryStrip sections={sections} onSelect={scrollToRoom} />
        <div className="tour-sections">{sections.map(section => <RoomSection key={section.name} section={section} registerRef={registerRef} onOpenPhoto={openLightbox} />)}</div>
      </div>
    </div>
  </ModalShell>;
}
