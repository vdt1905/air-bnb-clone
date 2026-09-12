import Logo from './Logo.jsx';
import SearchPill from './SearchPill.jsx';
import HeaderNav from './HeaderNav.jsx';

/**
 * Measured (REFERENCE_ANALYSIS.md §2):
 *   height 96px, 1px solid #DDDDDD bottom rule, 48px page gutter.
 *   NOT sticky on the listing page — it scrolls away with the content.
 */
export default function Header() {
  return (
    <header
      className="w-full border-b border-line bg-white"
      style={{ height: 'var(--header-height)' }}
    >
      <div className="header-inner flex h-full items-center justify-between">
        <Logo />
        <div className="header-search"><SearchPill /></div>
        <HeaderNav />
      </div>
    </header>
  );
}
