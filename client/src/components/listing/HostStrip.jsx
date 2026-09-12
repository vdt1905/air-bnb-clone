import Avatar from '../common/Avatar.jsx';
import Divider from '../common/Divider.jsx';

/** Measured: 40px avatar, height 90, separated by a 1px #DDDDDD rule. */
export default function HostStrip({ host }) {
  return (
    <>
      <Divider />
      <div className="flex items-center gap-4 py-6">
        <Avatar src={host.avatarUrl} size={50} />
        <div>
          <p className="text-body font-medium text-ink">Hosted by {host.name}</p>
          <p className="text-base text-muted">
            {host.monthsHosting >= 12 ? `${Math.floor(host.monthsHosting / 12)} ${host.monthsHosting < 24 ? 'year' : 'years'}` : `${host.monthsHosting} ${host.monthsHosting === 1 ? 'month' : 'months'}`} hosting
          </p>
        </div>
      </div>
    </>
  );
}
