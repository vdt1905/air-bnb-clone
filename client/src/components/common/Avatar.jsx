import { cn } from '../../utils/cn.js';

/**
 * Measured: 40px in the host strip, 88px in "Meet your host".
 * The reference's small avatar has border-radius 0 on the <img> and is clipped
 * by a wrapper (ASSET_INVENTORY.md §3) — reproduced here with overflow-hidden.
 *
 * Decorative by default. In every usage the person's name sits next to the
 * avatar as real text, so a non-empty alt would make screen readers announce
 * the name twice.
 */
export default function Avatar({ src, alt = '', size = 40, className }) {
  return (
    <span
      className={cn('inline-block shrink-0 overflow-hidden rounded-full bg-control', className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        {...(alt ? {} : { 'aria-hidden': 'true' })}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    </span>
  );
}
