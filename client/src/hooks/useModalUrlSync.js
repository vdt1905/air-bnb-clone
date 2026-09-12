import {useEffect,useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import {useUiStore} from '../store/uiStore.js';
import {useGalleryStore} from '../store/galleryStore.js';
import {useListingStore} from '../store/listingStore.js';

// URL changes from our controls and browser history share one serialization.
// Only the tour, description, and photo cursor belong in shareable URLs.
export function useModalUrlSync(){
  const navigate=useNavigate();
  const navigateRef=useRef(navigate);
  navigateRef.current=navigate;
  useEffect(()=>{
    let applying=false,queued=false,lastSignature='';
    const read=()=>{
      applying=true;
      const params=new URLSearchParams(window.location.search);
      const modal=params.get('modal');
      const wantsTour=modal==='photos'||modal==='PHOTO_TOUR_SCROLLABLE';
      const wantsDescription=modal==='description'||modal==='DESCRIPTION';
      const ui=useUiStore.getState();
      const photos=useListingStore.getState().listing?.photos??[];
      if(wantsTour){
        ui.actions.openModal('photos');
        const requested=params.get('photo')??params.get('modalItem');
        if(requested&&photos.length){
          const index=photos.findIndex(p=>p.id===requested);
          if(index>=0){useGalleryStore.getState().actions.setPhotoCount(photos.length);useGalleryStore.getState().actions.setCurrentIndex(index);ui.actions.openModal('lightbox');}
        }else if(ui.modalStack.includes('lightbox'))ui.actions.closeModal('lightbox');
      }else if(ui.modalStack.includes('photos'))ui.actions.closeModal('photos');
      if(wantsDescription)ui.actions.openModal('description');
      else if(ui.modalStack.includes('description'))ui.actions.closeModal('description');
      lastSignature=signature();
      applying=false;
    };
    const signature=()=>{
      const stack=useUiStore.getState().modalStack;
      const modal=stack.includes('photos')?'photos':stack.includes('description')?'description':'';
      const photo=stack.includes('lightbox')?useListingStore.getState().listing?.photos[useGalleryStore.getState().currentIndex]?.id??'':'';
      return `${modal}|${photo}`;
    };
    const sync=()=>{
      if(applying||queued)return;
      queued=true;
      queueMicrotask(()=>{
        queued=false;
        const next=signature();
        if(next===lastSignature)return;
        const [modal,photo]=next.split('|'),[oldModal,oldPhoto]=lastSignature.split('|');
        const params=new URLSearchParams(window.location.search);
        if(modal)params.set('modal',modal);else params.delete('modal');
        if(photo)params.set('photo',photo);else params.delete('photo');
        params.delete('modalItem');
        lastSignature=next;
        navigateRef.current({pathname:window.location.pathname,search:params.toString()},{replace:modal===oldModal&&Boolean(photo)===Boolean(oldPhoto),preventScrollReset:true});
      });
    };
    read();
    const unsubUi=useUiStore.subscribe(sync),unsubGallery=useGalleryStore.subscribe(sync);
    const unsubListing=useListingStore.subscribe((next,previous)=>{if(next.listing!==previous.listing)read();});
    window.addEventListener('popstate',read);
    return()=>{unsubUi();unsubGallery();unsubListing();window.removeEventListener('popstate',read);};
  },[]);
}
