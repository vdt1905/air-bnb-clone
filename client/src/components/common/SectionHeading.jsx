import { cn } from '../../utils/cn.js';

/**
 * Measured: 22px/26px, weight 500, letter-spacing -0.44px.
 *
 * `...rest` matters for accessibility: sections label themselves with
 * aria-labelledby pointing at this heading's id. Swallowing props here left
 * seven sections pointing at ids that did not exist.
 */
export default function SectionHeading({ as: Tag = 'h2', className, children, ...rest }) {
  return (
    <Tag
      className={cn('text-ink', className)}
      style={{
        fontSize: '24px',
        lineHeight: '30px',
        fontWeight: 500,
        letterSpacing: '-0.44px',
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
