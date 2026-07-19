import { useId } from 'react';

/**
 * `label` is rendered, not spread onto <input> — the old version passed it
 * straight through, which React warns about and drops silently.
 */
export default function Input({ label, error, className = '', id, ...props }) {
  const autoId = useId();
  const inputId = id || autoId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-subtle"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-xl border bg-muted px-4 py-2.5 text-sm text-content outline-none transition
          placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent
          ${error ? 'border-danger' : 'border-line'} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-[11px] font-medium text-danger">{error}</p>}
    </div>
  );
}
