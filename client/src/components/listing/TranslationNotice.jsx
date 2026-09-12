/**
 * Grey notice above the description, from the reference screenshots:
 * "Some info has been automatically translated. Show original".
 */
export default function TranslationNotice() {
  return (
    <p
      className="rounded-card bg-surface text-base text-ink"
      style={{ padding: '16px 20px' }}
    >
      Some info has been automatically translated.{' '}
      <button type="button" className="font-medium underline">
        Show original
      </button>
    </p>
  );
}
