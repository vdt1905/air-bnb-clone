import { useEffect } from 'react';
import PhotoTile from './PhotoTile.jsx';
import ShowAllPhotosButton from './ShowAllPhotosButton.jsx';
import { GALLERY } from '../../constants/layout.js';
import { useGalleryActions } from '../../store/galleryStore.js';

/**
 * The 5-image mosaic. Measured (REFERENCE_ANALYSIS.md §4):
 *   1120 x 476.1 overall, 8px gaps both axes
 *   560 + 8 + 272 + 8 + 272 = 1120
 *   12px radius on the WRAPPER with overflow:hidden, so only the four outer
 *   corners round. Individual tiles keep border-radius 0.
 *
 * Photo Tour opens in M15; onOpenTour is a no-op until then.
 */
export default function PhotoGrid({ photos }) {
  // Actions only: a stable reference, so this never re-renders on cursor moves.
  const { openPhotoTour, setPhotoCount } = useGalleryActions();

  useEffect(() => {
    setPhotoCount(photos.length);
  }, [photos.length, setPhotoCount]);

  const open = (index) => (event) => openPhotoTour(index, event.currentTarget);

  const visible = [...photos].sort((a,b) => (a.heroOrder ?? 99) - (b.heroOrder ?? 99)).slice(0, GALLERY.visibleCount);
  if (visible.length === 0) return null;

  const [hero, ...rest] = visible;

  return (
    <div id="photos" className="photo-mosaic relative scroll-mt-24">
      <div
        data-testid="photo-grid"
        className="photo-mosaic-grid grid overflow-hidden"
        style={{
          gap: `${GALLERY.gap}px`,
          borderRadius: `${GALLERY.radius}px`,
          gridTemplateRows: '1fr 1fr',
        }}
      >
        <PhotoTile
          photo={hero}
          priority
          onOpen={open(0)}
          style={{ gridRow: 'span 2' }}
        />
        {rest.map((photo, i) => (
          <PhotoTile key={photo.id} photo={photo} onOpen={open(i + 1)} />
        ))}
      </div>

      <ShowAllPhotosButton onClick={open(0)} />
    </div>
  );
}
