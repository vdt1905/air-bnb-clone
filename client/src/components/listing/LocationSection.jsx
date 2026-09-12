import {useState,useRef} from 'react';
import SectionHeading from '../common/SectionHeading.jsx';
import Icon from '../common/Icon.jsx';
import {useUiActions} from '../../store/uiStore.js';
export default function LocationSection({location,neighbourhood}){
  const [zoom,setZoom]=useState(1),[position,setPosition]=useState({x:0,y:0}),[marker,setMarker]=useState(false);
  const drag=useRef(null);
  const {openDetail}=useUiActions();
  return <section id="location" className="border-t border-line py-12 scroll-mt-20" aria-labelledby="location-heading">
    <SectionHeading id="location-heading">Where you’ll be</SectionHeading>
    <p className="mt-7 text-body">{location.city}, {location.region}, {location.country}</p>
    <div className="relative mt-6 h-[530px] overflow-hidden rounded-[14px] bg-[#e9efe3]" aria-label="Map of the Candolim area">
      <div className="absolute inset-0 cursor-grab active:cursor-grabbing" onPointerDown={e=>{drag.current={x:e.clientX-position.x,y:e.clientY-position.y};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current)setPosition({x:e.clientX-drag.current.x,y:e.clientY-drag.current.y});}} onPointerUp={()=>drag.current=null}>
        <div className="absolute -inset-[40%] transition-transform duration-200" style={{transform:`translate(${position.x}px,${position.y}px) scale(${zoom})`,backgroundColor:'#e9efe3'}}>
          <div className="absolute inset-0 bg-[#acd4e4]" style={{clipPath:'polygon(0 0, 51% 0, 26% 100%, 0 100%)'}}/>
          <span className="absolute h-[110px] w-[110px] rounded-full bg-[#d1e4c7]" style={{left:'38%',top:'38%'}}/><span className="absolute h-[148px] w-[148px] rounded-full bg-[#d1e4c7]" style={{left:'60%',top:'47%'}}/>
          <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(#b7c6b529 1px, transparent 1px),linear-gradient(90deg,#b7c6b529 1px,transparent 1px)',backgroundSize:'100px 100px'}}/>
        </div>
      </div>
      <button className="absolute left-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md hover:bg-surface" aria-label="Reset map view" onClick={()=>{setZoom(1);setPosition({x:0,y:0});}}><Icon name="search" size={18}/></button>
      <div className="absolute right-3 top-3 flex flex-col gap-2">{[1,-1].map(d=><button key={d} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-md hover:bg-surface disabled:opacity-50" aria-label={d===1?'Zoom in':'Zoom out'} disabled={d===1?zoom>=2:zoom<=.8} onClick={()=>setZoom(z=>Math.max(.8,Math.min(2,z+d*.2)))}><Icon name={d===1?'plus':'minus'} size={18}/></button>)}</div>
      <button className="absolute left-1/2 top-1/2 flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-lg" aria-label="Show property location" aria-expanded={marker} onClick={()=>setMarker(v=>!v)}><Icon name="house" size={40} strokeWidth={2}/></button>
      {marker&&<div className="absolute left-1/2 top-[28%] -translate-x-1/2 rounded-xl bg-white px-5 py-4 shadow-card"><p className="font-semibold">Your stay in Candolim</p><p className="text-base text-muted">Exact location provided after booking</p></div>}
    </div>
    <p className="mt-5 text-base">Exact location will be provided after booking.</p>
    <h3 className="mt-12 text-xl font-medium">{neighbourhood.heading}</h3>
    <p className="mt-3 text-body">{neighbourhood.body}</p>
    <button className="mt-5 flex items-center gap-1 text-body font-medium underline" onClick={e=>openDetail(neighbourhood.heading,`${neighbourhood.body}\n\nClose to Candolim Beach, restaurants and beach shacks. Fort Aguada and the neighbouring beaches of Calangute and Baga are a short drive away. Supermarkets, pharmacies and other essentials are nearby.`,e.currentTarget)}>Show more <Icon name="chevronRight" size={20}/></button>
  </section>;
}
