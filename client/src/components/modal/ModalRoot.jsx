import { useScrollLock } from '../../hooks/useScrollLock.js';
import { useModalStack } from '../../hooks/useModalStack.js';
import { useModalUrlSync } from '../../hooks/useModalUrlSync.js';
import PhotoTour from '../gallery/PhotoTour.jsx';
import Lightbox from '../gallery/Lightbox.jsx';
import AmenitiesModal from '../listing/AmenitiesModal.jsx';
import DescriptionModal from '../listing/DescriptionModal.jsx';
import ShareModal from '../listing/ShareModal.jsx';
import LoginModal from './LoginModal.jsx';
import DetailModal from './DetailModal.jsx';
import ReviewsModal from '../listing/ReviewsModal.jsx';
import Toast from '../common/Toast.jsx';

/**
 * Mounts the cross-cutting overlay machinery exactly once, then renders
 * whichever overlays are open.
 *
 * Why these hooks live here rather than in ModalShell:
 *   useScrollLock   reference-counted across the whole stack — running it
 *                   per-dialog would unlock the page when the Lightbox closes
 *                   on top of an open Photo Tour.
 *   useModalStack   binds Escape to the STACK, not to any single dialog, which
 *                   is what makes the measured two-stage Escape possible.
 *   useModalUrlSync mirrors only the two URL-backed overlays.
 *
 * All six overlays from INTERACTION_SPEC.md are represented. Each decides for
 * itself whether it is open; stacking order is governed by uiStore.modalStack,
 * and ModalShell marks every non-topmost dialog inert.
 */
export default function ModalRoot() {
  useScrollLock();
  useModalStack();
  useModalUrlSync();

  return (
    <>
      <PhotoTour />
      <Lightbox />
      <AmenitiesModal />
      <DescriptionModal />
      <ShareModal />
      <LoginModal />
      <DetailModal />
      <ReviewsModal />
      <Toast />
    </>
  );
}
