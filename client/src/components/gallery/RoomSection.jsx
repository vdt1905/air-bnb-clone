export default function RoomSection({ section, registerRef, onOpenPhoto }) {
  const headingId = `tour-${section.name.replace(/\s+/g, '-')}`;
  return <section ref={node => registerRef(section.name, node)} aria-labelledby={headingId} className="tour-room">
    <div className="tour-room-label"><h3 id={headingId}>{section.name}</h3>
      {!!section.details.length && <p>{section.details.join(' · ')}</p>}
    </div>
    <div className="tour-room-photos">{section.photos.map(photo =>
      <button key={photo.id} className="tour-photo" aria-label={`View photo: ${photo.alt}`} onClick={e => onOpenPhoto(photo.index, e.currentTarget)}>
        <img src={photo.url} alt="" width={photo.width} height={photo.height} loading="lazy" decoding="async" />
      </button>
    )}</div>
  </section>;
}
