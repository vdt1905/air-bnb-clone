import { cn } from '../../utils/cn.js';

/** 1px solid #DDDDDD — the only rule colour on the page. */
export default function Divider({ className }) {
  return <hr className={cn('border-0 border-t border-line', className)} />;
}
