import {useState,useRef,useEffect} from 'react';
import Icon from '../common/Icon.jsx';
import {useBookingParams} from '../../hooks/useBookingParams.js';
import DatePickerPopover from '../booking/DatePickerPopover.jsx';
import GuestStepperPopover from '../booking/GuestStepperPopover.jsx';
export default function SearchPill(){
  const [open,setOpen]=useState(null),[destination,setDestination]=useState(''),[searched,setSearched]=useState(false);
  const root=useRef(null),trigger=useRef(null);
  const {checkIn,checkOut,guests,totalGuests,setDates,setGuests}=useBookingParams();
  useEffect(()=>{
    if(!open)return;
    const click=e=>{if(!root.current?.contains(e.target))setOpen(null);};
    const key=e=>{if(e.key==='Escape'){setOpen(null);trigger.current?.focus();}};
    document.addEventListener('mousedown',click);document.addEventListener('keydown',key);
    return()=>{document.removeEventListener('mousedown',click);document.removeEventListener('keydown',key);};
  },[open]);
  const search=()=>{setSearched(true);setOpen(null);};
  return <div ref={root} className="relative">
    <div className="flex h-[54px] w-[446px] items-center rounded-full border border-line bg-white pl-5 pr-2 shadow-sm motion-pill hover:shadow-md">
      <img src="/images/mirashya/search.png" alt="" className="mr-1 h-9 w-9 object-contain"/>
      {[['location',searched?(destination||'Candolim'):'Anywhere'],['dates',searched&&checkIn?'Your dates':'Anytime'],['guests',searched?`${totalGuests} guests`:'Add guests']].map(([id,label],i)=><div key={id} className="flex items-center">
        {i>0&&<span className="h-7 w-px bg-line"/>}
        <button ref={i===0?trigger:null} data-testid={`search-${id}`} className={`rounded-full px-4 py-3 whitespace-nowrap text-[15px] ${i===2?'text-muted':'font-medium'} hover:bg-surface`} onClick={()=>setOpen(open===id?null:id)} aria-expanded={open===id}>{label}</button>
      </div>)}
      <button aria-label="Search" className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white hover:bg-[#e51d50]" onClick={()=>open?search():setOpen('location')}><Icon name="search" size={16} strokeWidth={2.5}/></button>
    </div>
    {open==='location'&&<form className="absolute left-0 top-[68px] w-full rounded-3xl border border-line bg-white p-6 shadow-pop overlay-enter" onSubmit={e=>{e.preventDefault();setOpen('dates');}}>
      <label className="block text-body font-semibold" htmlFor="search-destination">Where to?</label>
      <input id="search-destination" autoFocus value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Search destinations" className="mt-4 w-full rounded-xl border border-line p-4"/>
      <p className="mt-5 text-micro text-muted">SUGGESTED DESTINATION</p>
      <button type="button" onClick={()=>{setDestination('Candolim, Goa');setOpen('dates');}} className="mt-3 flex w-full items-center gap-4 rounded-xl p-3 text-left hover:bg-surface"><span className="rounded-xl bg-control p-3"><Icon name="pin"/></span><span className="text-body">Candolim, Goa<span className="block text-base text-muted">For a relaxing beach getaway</span></span></button>
    </form>}
    {open==='dates'&&<DatePickerPopover checkIn={checkIn} checkOut={checkOut} blockedDates={[]} onChange={setDates} onClose={()=>setOpen('guests')}/>}
    {open==='guests'&&<><GuestStepperPopover guests={guests} maxGuests={4} onChange={setGuests}/><button className="absolute right-6 top-[410px] z-50 rounded-full bg-ink px-6 py-3 text-white" onClick={search}>Search</button></>}
  </div>;
}
