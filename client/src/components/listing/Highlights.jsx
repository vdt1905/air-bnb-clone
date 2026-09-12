import Icon from '../common/Icon.jsx';
import Divider from '../common/Divider.jsx';

export default function Highlights({ highlights }) {
  if (!highlights?.length) return null;

  return (
    <>
      <Divider />
      <section className="py-4" aria-label="Listing highlights">
        <ul className="space-y-3">
          {highlights.map((item) => (
            <li key={item.title} className="flex gap-4">
              <span className="mt-0.5 shrink-0 text-ink">
                <Icon name={item.icon} size={24} />
              </span>
              <span>
                <span className="block text-body font-medium text-ink">{item.title}</span>
                <span className="block text-base text-muted">{item.subtitle}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
