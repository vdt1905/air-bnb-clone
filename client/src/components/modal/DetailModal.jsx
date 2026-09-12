import CenteredModal from './CenteredModal.jsx';
import { useUiStore, useIsModalOpen } from '../../store/uiStore.js';
export default function DetailModal() {
  const open = useIsModalOpen('detail');
  const detail = useUiStore(s => s.detail);
  if (!open || !detail) return null;
  return <CenteredModal id="detail" label={detail.title} width={620}>
    <h2 className="text-section font-semibold">{detail.title}</h2>
    <div className="mt-6 whitespace-pre-line text-body leading-relaxed">{detail.body}</div>
  </CenteredModal>;
}
