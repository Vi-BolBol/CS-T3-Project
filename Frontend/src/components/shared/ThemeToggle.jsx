import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ variant = 'switch' }) {
  const { isDark, toggleTheme } = useTheme();

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        title={isDark ? 'Light mode' : 'Dark mode'}
        className="grid h-9 w-9 place-items-center rounded-lg border border-line text-subtle transition-colors hover:bg-muted hover:text-content"
      >
        <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon-stars'} text-[15px]`} />
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-raised px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-content">Appearance</p>
        <p className="text-xs text-subtle">
          {isDark ? 'Dark mode is on' : 'Light mode is on'} — saved on this device.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center rounded-full border transition-colors ${
          isDark ? 'border-accent bg-accent' : 'border-line bg-muted'
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-raised text-[10px] shadow transition-transform ${
            isDark ? 'translate-x-6 text-accent' : 'translate-x-1 text-faint'
          }`}
        >
          <i className={`bi ${isDark ? 'bi-moon-stars-fill' : 'bi-sun-fill'}`} />
        </span>
      </button>
    </div>
  );
}
