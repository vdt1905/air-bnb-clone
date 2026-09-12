import { useState } from 'react';
import Divider from '../common/Divider.jsx';
import TranslationNotice from './TranslationNotice.jsx';

/**
 * Description, clamped to four lines with an inline "Show more" toggle.
 *
 * Expanding happens IN PLACE — no modal. The `.description-preview` class
 * (index.css) owns the clamp and the fade mask, so it is applied only while
 * collapsed; expanding drops the class, reveals the full summary and renders
 * the structured sections ("The space", …) beneath it, and the control flips
 * to "Show less". Local useState: single-subtree concern, not deep-linkable.
 *
 * The button only renders when the text is long enough to have been clamped.
 */
export default function Description({ description, translated = false }) {
  const [expanded, setExpanded] = useState(false);
  if (!description?.summary) return null;

  const isClampable = description.summary.length > 200;
  const clamped = isClampable && !expanded;
  const sections = description.sections ?? [];

  return (
    <>
      <Divider />
      <section className="py-8" aria-label="About this space">
        {translated && (
          <div className="mb-2">
            <TranslationNotice />
          </div>
        )}

        <div
          id="description-body"
          data-testid="description-body"
          className={`${clamped ? 'description-preview ' : ''}text-body text-ink`}
        >
          {description.summary}
        </div>

        {expanded &&
          sections.map((s) => (
            <div key={s.heading} className="mt-6 motion-safe:animate-[fade-in_200ms_cubic-bezier(0.2,0,0,1)]">
              <h3 className="text-body font-medium text-ink">{s.heading}</h3>
              <p className="mt-2 text-body text-ink">{s.body}</p>
            </div>
          ))}

        {isClampable && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls="description-body"
            aria-label={expanded ? 'Show less about this place' : 'Show more about this place'}
            data-testid="description-show-more"
            className="inline-flex items-center gap-1 rounded text-ink underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            style={{ fontSize: '18px', fontWeight: 500, textDecoration: 'underline', marginTop: '20px' }}
          >
            {expanded ? 'Show less' : 'Show more'}
            <span
              aria-hidden="true"
              className="inline-block transition-transform duration-200 ease-airbnb"
              style={{ transform: expanded ? 'rotate(90deg)' : 'none' }}
            >
              &rsaquo;
            </span>
          </button>
        )}
      </section>
    </>
  );
}
