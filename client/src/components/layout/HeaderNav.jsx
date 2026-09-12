import Icon from '../common/Icon.jsx';
import AccountMenu from './AccountMenu.jsx';
import {useUiActions} from '../../store/uiStore.js';

/**
 * Right-hand header cluster.
 *
 * Per the reference: "Become a host" as a text link, then the globe and the
 * menu as two EQUAL circular icon buttons — not a bare icon beside a pill.
 * Both sit on the subtle control surface and darken on hover, following the
 * measured secondary-button hover (#F2F2F2 → #EBEBEB).
 */
export default function HeaderNav() {
  const {openDetail}=useUiActions();
  return (
    <nav aria-label="User navigation" className="flex items-center gap-1">
      <button
        onClick={e=>openDetail('Become a host','Share your space and help guests feel at home. Hosting tools help you manage your listing, availability and guest messages.',e.currentTarget)}
        className="rounded-pill px-4 py-3 text-base font-medium text-ink motion-control hover:bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        Become a host
      </button>

      <button
        type="button"
        aria-label="Choose a language and region"
        onClick={e=>openDetail('Language and region','English (India)\n\nCurrency: Indian rupee — INR ₹\n\nThis listing is shown in English with prices in Indian rupees.',e.currentTarget)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-control text-ink motion-control hover:bg-control-hover"
      >
        <Icon name="globe" size={16} strokeWidth={2} />
      </button>

      <AccountMenu />
    </nav>
  );
}
