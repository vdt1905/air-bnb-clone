import {useState} from 'react';
import SectionHeading from '../common/SectionHeading.jsx';
import Icon from '../common/Icon.jsx';
import MonthGrid from '../booking/MonthGrid.jsx';
import {useBookingParams} from '../../hooks/useBookingParams.js';
import {useUiActions} from '../../store/uiStore.js';
import {addMonths,toIso,parseIso,nightsBetween} from '../../utils/dateRange.js';
export default function AvailabilityCalendar({availability}) {
  const {checkIn,checkOut,setDates}=useBookingParams();
  const {openDetail}=useUiActions();
  const anchor=checkIn?parseIso(checkIn):new Date();
  const [view,setView]=useState({year:anchor.getUTCFullYear(),month:anchor.getUTCMonth()});
  const nights=nightsBetween(checkIn,checkOut);
  const pick=iso=>{if(!checkIn||checkOut||iso<=checkIn)setDates(iso,null);else setDates(checkIn,iso);};
  const pretty=iso=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(parseIso(iso));
  return <section className="border-t border-line py-8" aria-labelledby="availability-heading">
    <SectionHeading id="availability-heading">{nights?`${nights} nights in Candolim`:'Select check-in date'}</SectionHeading>
    <p className="mt-2 text-base text-muted">{nights?`${pretty(checkIn)} - ${pretty(checkOut)}`:'Add your travel dates for exact pricing'}</p>
    <div className="relative mt-7">
      <button className="icon-circle absolute -top-2 left-0" aria-label="Previous month" onClick={()=>setView(addMonths(view.year,view.month,-1))}><Icon name="chevronLeft" size={18}/></button>
      <button className="icon-circle absolute -top-2 right-0" aria-label="Next month" onClick={()=>setView(addMonths(view.year,view.month,1))}><Icon name="chevronRight" size={18}/></button>
      <div className="inline-calendar" data-testid="inline-calendar">{[view,addMonths(view.year,view.month,1)].map(v=><MonthGrid key={`${v.year}-${v.month}`} {...v} checkIn={checkIn} checkOut={checkOut} blockedDates={availability.blockedDates} todayIso={toIso(new Date())} onPick={pick}/>)}</div>
    </div>
    <div className="mt-5 flex items-center justify-between">
      <button aria-label="Calendar keyboard shortcuts" className="rounded border border-line p-1" onClick={e=>openDetail('Calendar keyboard shortcuts','Use the left and right arrow keys to move by day, and up and down to move by week. Press Enter to select a date. Select a check-in date, then a checkout date. Use Clear dates to start again.',e.currentTarget)}><Icon name="keyboard" size={22}/></button>
      <button className="rounded-lg p-2 underline hover:bg-surface" onClick={()=>setDates(null,null)}>Clear dates</button>
    </div>
  </section>;
}
