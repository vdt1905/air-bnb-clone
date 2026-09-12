import SectionHeading from '../common/SectionHeading.jsx';
import Divider from '../common/Divider.jsx';
import Icon from '../common/Icon.jsx';

/** Measured: card images 319 x 212 with an 8px radius on the image itself. */
export default function SleepingArrangement({ arrangements }) {
  if (!arrangements?.length) return null;

  return (
    <>
      <Divider />
      <section className="py-8" aria-labelledby="sleeping-heading">
        <SectionHeading id="sleeping-heading">Where you&rsquo;ll sleep</SectionHeading>
        <ul className="mt-6 flex gap-4">
          {arrangements.map((room) => (
            <li key={room.name} className="min-w-0 flex-1">
              <img
                src={room.imageUrl}
                alt={`${room.name}: ${room.beds.join(', ')}`}
                width={480}
                height={320}
                loading="lazy"
                decoding="async"
                className="object-cover"
                style={{ width: '100%', aspectRatio: '3/2', borderRadius: '8px' }}
              />
              <p className="mt-3 flex items-center gap-2 text-body font-medium text-ink">
                {room.name}
              </p>
              <p className="text-base text-muted">{room.beds.join(', ')}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
