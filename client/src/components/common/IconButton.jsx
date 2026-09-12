import { cn } from '../../utils/cn.js';
import Icon from './Icon.jsx';

/** Icon-only control. `label` is required — it becomes the accessible name. */
export default function IconButton({ name, label, size = 16, className, iconClassName, ...rest }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center rounded-full motion-control',
        'hover:bg-control focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink',
        className
      )}
      {...rest}
    >
      <Icon name={name} size={size} className={iconClassName} />
    </button>
  );
}
