import SectionHeading from '../common/SectionHeading.jsx';
import Divider from '../common/Divider.jsx';
import Icon from '../common/Icon.jsx';
import { formatDateLong } from '../../utils/formatDate.js';
import {useUiActions} from '../../store/uiStore.js';

/**
 * "Things to know" — three columns, each with an outline icon above its
 * heading and a "Learn more" link beneath, per the reference screenshots.
 * Column order matches the reference: Cancellation policy · House rules ·
 * Safety & property.
 */
function Column({ icon, heading, items, children }) {
  const {openDetail}=useUiActions();
  return (
    <div>
      <span className="block text-ink">
        <Icon name={icon} size={28} strokeWidth={1.25} />
      </span>
      <h3 className="mt-4 text-ink" style={{ fontSize: '18px', lineHeight: '22px', fontWeight: 500 }}>
        {heading}
      </h3>
      <div className="mt-3 space-y-2 text-body text-ink">
        {items?.map((item) => <p key={item}>{item}</p>)}
        {children}
      </div>
      <button type="button" className="mt-4 text-base font-medium text-ink underline" onClick={e=>openDetail(heading,items.join('\n\n'),e.currentTarget)}>
        Learn more
      </button>
    </div>
  );
}

export default function ThingsToKnow({ policies }) {
  if (!policies) return null;

  const deadline = policies.cancellationDeadline;
  const cancellation = deadline
    ? [
        `Free cancellation before ${formatDateLong(deadline).replace(/^\w+, /, '')}. Cancel before check-in for a partial refund.`,
        'Review this host’s full policy for details.',
      ]
    : [policies.cancellation];

  return (
    <>
      <Divider />
      <section className="py-12" aria-labelledby="things-heading">
        <SectionHeading id="things-heading">Things to know</SectionHeading>

        <div className="mt-8 grid grid-cols-3" style={{ gap: '48px' }}>
          <Column icon="calendarX" heading="Cancellation policy" items={cancellation} />
          <Column
            icon="key"
            heading="House rules"
            items={[
              `Check-in ${policies.checkIn}`,
              `Checkout ${policies.checkOut}`,
              `${policies.maxGuests} guests maximum`,
            ]}
          />
          <Column icon="shield" heading="Safety & property" items={policies.safety ?? []} />
        </div>
      </section>
    </>
  );
}
