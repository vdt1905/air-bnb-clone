import { cn } from '../../utils/cn.js';

export default function Skeleton({ className, style }) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-md bg-control', className)}
      style={style}
    />
  );
}
