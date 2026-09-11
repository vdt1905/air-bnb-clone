import { cn } from '../../utils/cn.js';

// 1120px content column, centred. At a 1440px viewport this puts content at
// x = 152.3 (REFERENCE_ANALYSIS.md §1).
export default function PageContainer({ children, className }) {
  return (
    <div
      className={cn('mx-auto w-full', className)}
      style={{ maxWidth: 'var(--content-width)' }}
    >
      {children}
    </div>
  );
}
