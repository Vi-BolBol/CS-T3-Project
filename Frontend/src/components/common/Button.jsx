/**
 * Public-site button. Token-based only — no hardcoded colour, so it flips
 * correctly with `.dark` on <html> like the rest of the app.
 */
const VARIANTS = {
  primary:
    'bg-accent text-accent-ink hover:brightness-95 shadow-sm shadow-accent/20',
  secondary:
    'border border-line bg-raised text-content hover:bg-muted',
  ghost:
    'text-subtle hover:bg-muted hover:text-content',
  danger:
    'bg-danger text-white hover:brightness-95',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition
        disabled:cursor-not-allowed disabled:opacity-60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface
        ${VARIANTS[variant] || VARIANTS.primary} ${SIZES[size] || SIZES.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
