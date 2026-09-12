import {useState} from 'react';
import CenteredModal from '../modal/CenteredModal.jsx';
import {useIsModalOpen} from '../../store/uiStore.js';
import {useListingData} from '../../store/listingStore.js';
import {ReviewCard} from './Reviews.jsx';
export default function ReviewsModal(){
  const open=useIsModalOpen('reviews');
  const listing=useListingData();
  const [query,setQuery]=useState('');
  if(!open||!listing)return null;
  const filtered=listing.reviews.filter(r=>`${r.author} ${r.body}`.toLowerCase().includes(query.toLowerCase()));
  return <CenteredModal id="reviews" label="Guest reviews" width={780} height={800}>
    <h2 className="text-section font-semibold">★ {listing.rating.value} · {listing.rating.count} reviews</h2>
    <input className="my-6 w-full rounded-full border border-line px-5 py-3 text-body" aria-label="Search reviews" placeholder="Search reviews" value={query} onChange={e=>setQuery(e.target.value)}/>
    <div className="space-y-8">{filtered.map(r=><ReviewCard key={r.id} review={r} full/>)}{!filtered.length&&<p>No reviews match your search.</p>}</div>
  </CenteredModal>;
}
