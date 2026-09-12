import {useRef} from 'react';
import {monthGrid,monthLabel,isBlocked} from '../../utils/dateRange.js';
import {formatDateLong} from '../../utils/formatDate.js';
export default function MonthGrid({year,month,checkIn,checkOut,blockedDates,todayIso,onPick,width}) {
  const ref=useRef(null);
  const cells=monthGrid(year,month);
  const navigate=(e)=>{
    const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[e.key];
    if(delta===undefined)return;
    e.preventDefault();
    const buttons=[...ref.current.querySelectorAll('button')];
    let next=buttons.indexOf(e.target)+delta;
    while(buttons[next]?.disabled)next+=Math.sign(delta);
    buttons[next]?.focus();
  };
  return <div ref={ref} style={{width:width?`${width}px`:'100%',minWidth:0}} role="group" aria-label={monthLabel(year,month)} onKeyDown={navigate}>
    <p className="mb-5 text-center text-body font-medium">{monthLabel(year,month)}</p>
    <div className="calendar-days">
      {['S','M','T','W','T','F','S'].map((d,i)=><span key={i} className="pb-3 text-center text-[14px]" aria-hidden="true">{d}</span>)}
      {cells.map((iso,i)=>{
        if(!iso)return <span key={`empty-${i}`}/>;
        const start=iso===checkIn,end=iso===checkOut,range=checkIn&&checkOut&&iso>checkIn&&iso<checkOut;
        return <div key={iso} className={`calendar-cell ${range?'in-range':''} ${start&&checkOut?'range-start':''} ${end?'range-end':''}`}>
          <button type="button" className={`calendar-day ${start||end?'selected':''}`} disabled={iso<todayIso||isBlocked(iso,blockedDates)} aria-label={formatDateLong(iso)} aria-pressed={start||end} onClick={()=>onPick(iso)}>{Number(iso.slice(-2))}</button>
        </div>;
      })}
    </div>
  </div>;
}
