import { useState } from 'react';
import CenteredModal from '../modal/CenteredModal.jsx';
import Icon from '../common/Icon.jsx';
import { useIsModalOpen } from '../../store/uiStore.js';
import { useListingData } from '../../store/listingStore.js';
import { MODALS } from '../../constants/modals.js';

/**
 * Measured (INTERACTION_SPEC.md §1.3):
 *   568 × 544 at x=428, y=178 — centred
 *   radius 32px, shadow 0 8px 28px rgba(0,0,0,0.28)
 *   heading "Share this place" plus a listing summary line
 *     ("Apartment in Candolim · ★4.84 · 2 bedrooms · 3 beds · 2 bathrooms")
 *   options: Copy Link, Email, Messages, WhatsApp, Messenger, Facebook, Twitter
 *   URL unchanged; scroll locked
 */
const OPTIONS = [
  { id: 'copy', label: 'Copy Link', icon: 'share' },
  { id: 'email', label: 'Email', icon: 'share' },
  { id: 'messages', label: 'Messages', icon: 'share' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'share' },
  { id: 'messenger', label: 'Messenger', icon: 'share' },
  { id: 'facebook', label: 'Facebook', icon: 'share' },
  { id: 'twitter', label: 'Twitter', icon: 'share' },
];

export default function ShareModal() {
  const isOpen = useIsModalOpen(MODALS.SHARE);
  const listing = useListingData();
  const [copied, setCopied] = useState(false);

  if (!isOpen || !listing) return null;

  const { propertyType, location, capacity, rating } = listing;
  const summary = [
    `${propertyType} in ${location.city}`,
    rating?.isNew ? 'New' : `★${rating?.value}`,
    `${capacity.bedrooms} bedrooms`,
    `${capacity.beds} beds`,
    `${capacity.bathrooms} bathrooms`,
  ].join(' · ');

  const onSelect = async (id) => {
    const url=encodeURIComponent(window.location.href);
    const text=encodeURIComponent(listing.title);
    const links={email:`mailto:?subject=${text}&body=${url}`,messages:`sms:?body=${text}%20${url}`,whatsapp:`https://wa.me/?text=${text}%20${url}`,messenger:`https://www.facebook.com/sharer/sharer.php?u=${url}`,facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}`,twitter:`https://twitter.com/intent/tweet?text=${text}&url=${url}`};
    if(id!=='copy'){window.open(links[id],'_blank','noopener,noreferrer');return;}
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — leave the label unchanged */
    }
  };

  return (
    <CenteredModal id={MODALS.SHARE} label="Share this place" width={568} height={544}>
      <h2
        className="text-ink"
        style={{ fontSize: '22px', lineHeight: '26px', fontWeight: 500, letterSpacing: '-0.44px' }}
      >
        Share this place
      </h2>

      <div className="mt-4 flex items-center gap-3">
        <img
          src={listing.photos?.[0]?.url}
          alt=""
          aria-hidden="true"
          width={1440}
          height={960}
          className="object-cover"
          style={{ width: '48px', height: '48px', borderRadius: '8px' }}
        />
        <p className="text-base text-muted">{summary}</p>
      </div>

      <ul className="mt-6 grid grid-cols-2" style={{ gap: '12px' }}>
        {OPTIONS.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect(option.id)}
              className="flex w-full items-center gap-3 rounded-card border border-line px-4 py-4 text-left text-body text-ink motion-control hover:bg-control"
            >
              <Icon name={option.icon} size={20} />
              {option.id === 'copy' && copied ? 'Link copied' : option.label}
            </button>
          </li>
        ))}
      </ul>
    </CenteredModal>
  );
}
