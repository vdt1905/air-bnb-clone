export default function Logo() {
  return <a href="/" aria-label="Airbnb home" className="flex items-center gap-1.5 text-[#ff385c] rounded-lg">
    <svg width="34" height="38" viewBox="0 0 34 38" fill="none" aria-hidden="true">
      <path d="M17 3c-2.2 0-3.5 2.1-4.6 4.8L3.5 27.5C.3 35 6.2 39 11.5 34.4c4.3-3.6 11.1-12 10.1-16.5-.5-2-2.2-3.1-4.6-3.1s-4.1 1.1-4.6 3.1c-1 4.5 5.8 12.9 10.1 16.5 5.3 4.6 11.2.6 8-6.9L21.6 7.8C20.5 5.1 19.2 3 17 3Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span style={{fontSize:28,fontWeight:700,letterSpacing:'-1.5px'}}>airbnb</span>
  </a>;
}
