import Icon from '../common/Icon.jsx';
import Avatar from '../common/Avatar.jsx';
import Laurel from '../common/Laurel.jsx';
import { useUiActions } from '../../store/uiStore.js';

export function ReviewCard({review,full=false}) {
  const {openDetail} = useUiActions();
  return <article className="review-card">
    <div className="flex items-center gap-3">
      {review.avatarUrl ? <Avatar src={review.avatarUrl} size={46}/> : <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full text-xl" style={{background:review.author==='Amit'?'#f7ecdf':'#eee9f8',color:review.author==='Amit'?'#b47b2e':'#8a66ce'}}>{review.author[0]}</span>}
      <div><p className="text-body font-medium">{review.author}</p><p className="text-base text-muted">{review.tenure}</p></div>
    </div>
    <p className="mt-3 flex items-center gap-2 text-[14px]"><span aria-label="5 out of 5 stars">★★★★★</span> · {review.dateLabel}</p>
    <p className="review-body" style={!full?{display:'-webkit-box',WebkitBoxOrient:'vertical',WebkitLineClamp:4,overflow:'hidden'}:undefined}>{review.body}</p>
    {!full && review.body.length>180 && <button className="mt-2 text-body font-medium underline" onClick={e=>openDetail(`${review.author}’s review`,review.body,e.currentTarget)}>Show more</button>}
  </article>;
}

export default function Reviews({rating,reviews,breakdown,tags,guestFavourite}) {
  const {openModal,openDetail}=useUiActions();
  if (!reviews?.length) return null;
  return <section id="reviews" className="border-t border-line py-14 scroll-mt-20" aria-labelledby="reviews-heading">
    <div className="flex flex-col items-center text-center">
      <div className="flex items-center gap-4"><Laurel/><h2 id="reviews-heading" style={{fontSize:108,lineHeight:'126px',fontWeight:650,letterSpacing:'-5px'}}>{rating.value ?? 'New'}</h2><Laurel side="right"/></div>
      {guestFavourite && <p className="mt-7 text-[26px] font-medium leading-8">Guest favourite</p>}
      <p className="mt-3 max-w-[470px] text-body leading-6">This home is a guest favourite based on ratings, reviews and reliability</p>
      <button className="mt-4 underline" onClick={e=>openDetail('How reviews work','Reviews come from guests who have stayed at this home. Guests can rate their stay and share what they loved. Overall ratings reflect the experience of previous guests.',e.currentTarget)}>How reviews work</button>
    </div>
    {breakdown && <div className="mt-14 flex min-h-36">
      <div className="w-[19%] shrink-0 px-6"><p>Overall rating</p><div className="mt-3 space-y-1.5">{[5,4,3,2,1].map(n=><div key={n} className="flex items-center gap-3 text-xs"><span>{n}</span><div className="h-1 flex-1 rounded-full bg-[#ebebeb]"><div className="h-full rounded-full bg-ink" style={{width:`${(breakdown.distribution[n]/19)*100}%`}}/></div></div>)}</div></div>
      {breakdown.categories.map(cat=><div key={cat.key} className="flex-1 border-l border-line px-6"><p>{cat.label}</p><p className="mt-4 text-xl font-medium">{cat.value.toFixed(1)}</p><div className="mt-3"><Icon name={cat.icon} size={34}/></div></div>)}
    </div>}
    <ul className="review-topics mt-12 flex gap-3 overflow-x-auto" aria-label="Review topics">{tags?.map(tag=><li key={tag.label} className="shrink-0"><button className="flex items-center gap-2 rounded-[18px] border border-line px-4 py-4 motion-control hover:border-ink hover:bg-surface" onClick={()=>openModal('reviews',document.activeElement)}><span aria-hidden="true">{tag.emoji}</span>{tag.label}<span className="text-muted">{tag.count}</span></button></li>)}</ul>
    <div className="review-cards">{reviews.map(review=><ReviewCard key={review.id} review={review}/>)}</div>
    <button className="mt-6 rounded-xl border border-ink px-6 py-4 text-body font-medium motion-control hover:bg-surface" onClick={e=>openModal('reviews',e.currentTarget)}>Show all {rating.count} reviews</button>
  </section>;
}
