import { useEffect } from 'react';
import { useCVBuilder } from '../../context/CVBuilderContext.jsx';

// Shows the AI suggestion that sent the user to this step (via the
// Scoring tab's "Improve" button). Reads from CVBuilderContext so it
// works the same way on any step page without prop drilling.
function SuggestionBanner() {
  const { activeSuggestion, clearActiveSuggestion } = useCVBuilder();

  // Clear the suggestion when this step page unmounts (i.e. the user
  // navigates away via Back/Next or otherwise) so a stale banner never
  // shows up on a step it doesn't apply to. Dismissing via the × button
  // or leaving via the Edit Content tab both still work the same way —
  // this just covers in-builder Back/Next navigation too.
  useEffect(() => {
    return () => clearActiveSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!activeSuggestion) return null;

  return (
    <div className="bg-accent/10 border border-accent/30 rounded-xl px-5 py-4 mb-6 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-accent uppercase tracking-wide">
            AI Suggestion — {activeSuggestion.section}
          </p>
          <p className="text-sm text-content mt-1">{activeSuggestion.note}</p>
        </div>
      </div>
      <button
        onClick={clearActiveSuggestion}
        className="shrink-0 text-subtle hover:text-content transition text-lg leading-none"
        aria-label="Dismiss suggestion"
      >
        ×
      </button>
    </div>
  );
}

export default SuggestionBanner;