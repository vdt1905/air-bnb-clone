/**
 * Grey notice above the description, from the reference screenshots:
 * "Some info has been automatically translated. Show original".
 */
import {useUiActions} from '../../store/uiStore.js';
export default function TranslationNotice() {
  const {showToast}=useUiActions();
  return (
    <p
      className="rounded-card bg-surface text-base text-ink"
      style={{ padding: '16px 20px' }}
    >
      Some info has been automatically translated.{' '}
      <button type="button" className="font-medium underline" onClick={()=>showToast('The original description is in English.')}>
        Show original
      </button>
    </p>
  );
}
