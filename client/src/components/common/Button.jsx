import { cn } from '../../utils/cn.js';

/**
 * Measured button vocabulary (REFERENCE_ANALYSIS.md §4, §6, §8):
 *   secondary -> #F2F2F2, hover #EBEBEB, 0.3s background-color
 *   primary   -> 48px pill, brand gradient, 16px/500 white
 * One easing curve sitewide: cubic-bezier(0.2, 0, 0, 1).
 */
const BASE =
  'inline-flex items-center justify-center gap-2 font-medium ' +
  'motion-control ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-ink disabled:cursor-not-allowed';

const VARIANTS = {
  // radius 12px, padding 14px 24px, 16px/500 — the "Show all N amenities" button
  secondary: 'bg-control text-ink hover:bg-control-hover rounded-card',
  // radius 8px, padding 8px 16px, 12px/500 — the "Show all photos" button
  compact: 'bg-control text-ink hover:bg-control-hover rounded-lg',
  // underline-on-hover text control — Share / Save
  ghost: 'text-ink hover:bg-control rounded-lg bg-transparent',
  outline: 'bg-white text-ink border border-ink hover:bg-control rounded-lg',
};

export default function Button({
  variant = 'secondary',
  className,
  style,
  type = 'button',
  children,
  ...rest
}) {
  return (
    <button type={type} className={cn(BASE, VARIANTS[variant], className)} style={style} {...rest}>
      {children}
    </button>
  );
}
