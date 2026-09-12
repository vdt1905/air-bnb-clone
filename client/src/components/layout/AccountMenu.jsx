import { useState, useRef, useEffect } from 'react';
import Icon from '../common/Icon.jsx';
import {useUiActions} from '../../store/uiStore.js';

/**
 * Measured (INTERACTION_SPEC.md §1.2): panel 265 x 277, radius 12px,
 * shadow 0 2px 16px rgba(0,0,0,.12). No role="menu" in the reference — it is a
 * plain positioned panel. Escape closes. Scroll is NOT locked.
 */
const ITEMS = [
  { label: 'Help Centre', href: '/help' },
  { label: 'Become a host', href: '/host', strong: true },
  { label: 'Refer a host', href: '/refer' },
  { label: 'Find a co-host', href: '/co-host' },
  { label: 'Log in or sign up', href: '/login' },
];

export default function AccountMenu() {
  const {openModal,openDetail}=useUiActions();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        data-testid="account-menu-trigger"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Main navigation menu"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-control text-ink motion-control hover:bg-control-hover"
      >
        <Icon name="menu" size={16} strokeWidth={2} />
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-3 overflow-hidden bg-white py-2 shadow-menu"
          style={{ width: '265px', borderRadius: '12px' }}
        >
          {ITEMS.map((item, i) => (
            <button
              key={item.label}
              onClick={e=>{setOpen(false);if(item.href==='/login')openModal('login',rootRef.current?.querySelector('button'));else openDetail(item.label,item.label==='Help Centre'?'Explore the photo tour, select your dates, or contact your host for help with this stay.':'Find out how to welcome guests and manage a home with Airbnb.',rootRef.current?.querySelector('button'));}}
              className={`block w-full text-left px-4 py-3 text-base text-ink motion-control hover:bg-control ${
                item.strong ? 'font-medium' : ''
              }`}
            >
              {item.label}
              {i === 1 && (
                <span className="mt-1 block text-micro text-muted">
                  It&rsquo;s easy to start hosting and earn extra income.
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
