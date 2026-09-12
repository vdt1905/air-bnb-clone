import Divider from './Divider.jsx';
import { cn } from '../../utils/cn.js';

/** Content section: 32px vertical padding with a 1px rule above (measured). */
export default function Section({ id, divider = true, className, children }) {
  return (
    <>
      {divider && <Divider />}
      <section id={id} className={cn('py-8', className)}>
        {children}
      </section>
    </>
  );
}
