/**
 * Numbered pager. Windows around the current page so the control never grows
 * past ~7 buttons no matter how many listings exist.
 * "1 … 4 5 6 … 12" rather than 12 buttons in a row.
 */
function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p += 1) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);

  return pages;
}

export default function Pagination({ page, totalPages, onChange, className = '' }) {
  if (totalPages <= 1) return null;

  const btn =
    'grid h-8 min-w-8 place-items-center rounded-lg border px-2 text-xs font-bold transition-colors';

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btn} border-line text-subtle hover:bg-muted hover:text-content disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <i className="bi bi-chevron-left" />
      </button>

      {pageWindow(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`gap-${i}`} className="px-1 text-xs text-faint">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${
              p === page
                ? 'border-accent bg-accent text-accent-ink'
                : 'border-line text-subtle hover:bg-muted hover:text-content'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className={`${btn} border-line text-subtle hover:bg-muted hover:text-content disabled:cursor-not-allowed disabled:opacity-40`}
      >
        <i className="bi bi-chevron-right" />
      </button>
    </nav>
  );
}
