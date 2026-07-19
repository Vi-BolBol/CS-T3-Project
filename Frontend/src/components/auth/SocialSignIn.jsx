import { useState } from 'react';

/**
 * Social sign-in — circular icon buttons at the FOOT of the form, so the choice
 * reads as "fill in the form, or use a work account instead".
 *
 * IMPORTANT — these are placeholders. There is no OAuth backend: no provider
 * apps registered, no client IDs, no /api/auth/oauth/* route. So they do NOT
 * pretend to work. Clicking one says plainly that it isn't connected yet.
 *
 * The version deleted in Session E called alert("OAuth handshake initializing
 * via Google server nodes...") — a lie, and PROJECT_SPEC.md §9 forbids native
 * alert()/confirm() anyway. An honest "not connected yet" survives a lecturer
 * clicking it; a fake handshake does not.
 *
 * To make these real: register an app per provider, add
 * /api/auth/oauth/:provider + /callback on the backend, and swap `onClick` for
 * a redirect to the provider's authorize URL.
 */

/** Yahoo isn't in bootstrap-icons, so it's drawn here. Inherits currentColor. */
function YahooMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] fill-current" aria-hidden="true">
      <path d="M3.4 6.4h3.4l2.8 5.4 2.8-5.4h3.3l-4.8 8.7v4.5H8.2v-4.5L3.4 6.4Z" />
      <circle cx="18.5" cy="17.6" r="1.5" />
      <path d="M17.4 6.4h2.9l-1 7.7h-1.5l-.4-7.7Z" />
    </svg>
  );
}

const PROVIDERS = [
  { key: 'github', label: 'GitHub', icon: <i className="bi bi-github text-[15px]" /> },
  { key: 'google', label: 'Google', icon: <i className="bi bi-google text-[15px]" /> },
  { key: 'yahoo', label: 'Yahoo', icon: <YahooMark /> },
  { key: 'microsoft', label: 'Microsoft', icon: <i className="bi bi-microsoft text-[15px]" /> },
];

export default function SocialSignIn({ action = 'Sign up' }) {
  const [notice, setNotice] = useState('');

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
          or use a work account
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="mt-2.5 flex justify-center gap-3">
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-label={`${action} with ${p.label}`}
            title={`${p.label} — not connected yet`}
            onClick={() => setNotice(`${p.label} isn't connected yet — use the form above.`)}
            className="grid h-9 w-9 place-items-center rounded-full border border-line bg-muted text-subtle transition-all hover:-translate-y-0.5 hover:border-accent/60 hover:text-content focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {p.icon}
          </button>
        ))}
      </div>

      {notice && (
        <p role="status" className="mt-2.5 text-center text-[11px] font-medium text-subtle">
          <i className="bi bi-info-circle mr-1" />
          {notice}
        </p>
      )}
    </div>
  );
}
