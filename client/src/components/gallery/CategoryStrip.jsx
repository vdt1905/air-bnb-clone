/**
 * Thumbnail strip at the top of the Photo Tour — one tile per room group.
 * Clicking scrolls the tour to that room. The image sits in a clipping frame
 * so the hover zoom (index.css `.tour-category`) stays inside the 9px corners.
 */
export default function CategoryStrip({ sections, onSelect }) {
  return <nav aria-label="Photo tour rooms"><ul className="tour-categories">
    {sections.map(section => <li key={section.name}>
      <button className="tour-category" onClick={() => onSelect(section.name)} aria-label={`Scroll to ${section.name}`}>
        <span className="tour-category-frame">
          <img src={section.photos[0].url} alt="" width="246" height="232" />
        </span>
        <span className="tour-category-label">{section.name}</span>
      </button>
    </li>)}
  </ul></nav>;
}
