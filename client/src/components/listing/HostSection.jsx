import SectionHeading from '../common/SectionHeading.jsx';
import Divider from '../common/Divider.jsx';
import Avatar from '../common/Avatar.jsx';
import Icon from '../common/Icon.jsx';
import {useUiActions} from '../../store/uiStore.js';

/**
 * "Meet your host", rebuilt to match the reference screenshots.
 *
 * Left column:
 *   - a raised card: circular avatar with a verified badge, the host name in
 *     large bold type and "Host" beneath, then a stats column to the RIGHT of
 *     the avatar (Reviews / Rating / Years hosting) separated by hairlines
 *   - host facts beneath the card, each with an icon ("Born in the 80s", …)
 * Right column:
 *   - "Co-Hosts" in a three-column grid of small avatars
 *   - "Host details" (response rate/time), a grey "Message host" button, and
 *     the shield-icon payment-protection note
 *
 * "Message host" still wires no action — never observed on the reference.
 */
function InitialAvatar({ name, size = 40 }) {
  const hue = (name.charCodeAt(0) * 37) % 360;
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full text-base font-medium"
      style={{ width: size, height: size, backgroundColor: `hsl(${hue} 60% 92%)`, color: `hsl(${hue} 45% 40%)` }}
    >
      {name.charAt(0)}
    </span>
  );
}

function Stat({ value, label, last }) {
  return (
    <div className={last ? '' : 'border-b border-line pb-3'}>
      <p className="flex items-center gap-1 text-ink" style={{ fontSize: '22px', lineHeight: '26px', fontWeight: 600 }}>
        {value}
      </p>
      <p className="text-micro text-ink">{label}</p>
    </div>
  );
}

export default function HostSection({ host }) {
  const {openModal}=useUiActions();
  if (!host) return null;
  const years = Math.max(1, Math.round((host.monthsHosting ?? 0) / 12));
  const yearsLabel = host.monthsHosting >= 12 ? `${years}` : `${host.monthsHosting}`;
  const yearsUnit = host.monthsHosting >= 12 ? (years === 1 ? 'Year hosting' : 'Years hosting') : 'Months hosting';

  return (
    <>
      <Divider />
      <section className="py-12" aria-labelledby="host-heading">
        <SectionHeading id="host-heading">Meet your host</SectionHeading>

        <div className="mt-7 flex" style={{ gap: '52px' }}>
          {/* left */}
          <div className="shrink-0" style={{ width: '375px' }}>
            <div
              className="flex items-center rounded-modal bg-white"
              style={{ padding: '32px 28px', boxShadow: 'var(--shadow-card)', border: '1px solid rgba(0,0,0,0.04)' }}
            >
              <div className="flex flex-1 flex-col items-center">
                <span className="relative">
                  <Avatar src={host.avatarUrl} size={96} />
                  {host.verified && (
                    <span
                      className="absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full text-white"
                      style={{ width: 28, height: 28, background: 'var(--gradient-cta)', border: '2px solid #fff' }}
                      role="img"
                      aria-label="Verified host"
                    >
                      <Icon name="check-circle" size={14} strokeWidth={2.5} />
                    </span>
                  )}
                </span>
                <p
                  className="mt-4 text-center text-ink"
                  style={{ fontSize: '28px', lineHeight: '40px', fontWeight: 600, letterSpacing: '-0.6px', maxWidth: '170px' }}
                >
                  {host.name}
                </p>
                <p className="mt-1 text-base text-ink">Host</p>
              </div>

              <div className="ml-6 flex w-28 flex-col gap-3 border-l border-line pl-6">
                <Stat value={host.reviewCount?.toLocaleString?.() ?? host.reviewCount} label="Reviews" />
                {host.rating != null && (
                  <Stat
                    value={
                      <>
                        {host.rating}
                        <Icon name="star" size={14} filled strokeWidth={0} />
                      </>
                    }
                    label="Rating"
                  />
                )}
                <Stat value={yearsLabel} label={yearsUnit} last />
              </div>
            </div>

            {host.facts?.length > 0 && (
              <ul className="mt-6 space-y-4">
                {host.facts.map((fact) => (
                  <li key={fact.text} className="flex items-center gap-4 text-body text-ink">
                    <Icon name={fact.icon} size={24} />
                    {fact.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* right */}
          <div className="flex-1">
            {host.coHosts?.length > 0 && (
              <>
                <h3 className="text-ink" style={{ fontSize: '22px', lineHeight: '26px', fontWeight: 500 }}>
                  Co-Hosts
                </h3>
                <ul className="mt-4 grid grid-cols-3" style={{ rowGap: '20px', columnGap: '24px' }}>
                  {host.coHosts.map((co) => (
                    <li key={co.name} className="flex items-center gap-3 text-[15px] text-ink">
                      {co.avatarUrl ? <Avatar src={co.avatarUrl} size={40} /> : <InitialAvatar name={co.name} />}
                      {co.name}
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h3 className="mt-10 text-ink" style={{ fontSize: '22px', lineHeight: '26px', fontWeight: 500 }}>
              Host details
            </h3>
            <p className="mt-3 text-body text-ink">Response rate: {host.responseRate}%</p>
            <p className="mt-1 text-body text-ink">Responds {host.responseTime}</p>

            <button
              type="button"
              onClick={e=>openModal('login',e.currentTarget)}
              className="mt-6 rounded-lg bg-control px-6 text-body font-medium text-ink motion-control hover:bg-control-hover"
              style={{ height: '48px' }}
            >
              Message host
            </button>

            <p className="mt-8 flex items-start gap-3 text-micro text-muted">
              <Icon name="shield" size={20} strokeWidth={1.5} className="shrink-0" />
              To help protect your payment, always use Airbnb to send money and communicate with hosts.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
