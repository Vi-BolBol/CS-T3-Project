import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/*
  What a suspended or deleted user sees instead of the app.

  This is a hard gate, not a toast — the point of a suspension is that the person
  cannot keep using the platform, and they are entitled to know why and for how
  long. A silent 403 on every click would have been useless to them.
*/

function formatRemaining(until) {
  if (!until) return null;
  const ms = new Date(until).getTime() - Date.now();
  if (ms <= 0) return 'any moment now';

  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms % 86400000) / 3600000);
  if (days >= 1) return `${days} day${days === 1 ? '' : 's'}${hours ? ` and ${hours} hour${hours === 1 ? '' : 's'}` : ''}`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? '' : 's'}`;
  const minutes = Math.max(1, Math.floor(ms / 60000));
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

export default function AccountBlockedNotice({ reason, suspension, onRecheck, onDismiss }) {
  const navigate = useNavigate();
  const [, tick] = useState(0);

  // Keep the countdown honest without a page refresh.
  useEffect(() => {
    if (reason !== 'suspended' || !suspension?.until) return undefined;
    const t = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, [reason, suspension?.until]);

  const remaining = useMemo(
    () => formatRemaining(suspension?.until),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suspension?.until, tick]
  );

  const goHome = () => {
    onDismiss?.();
    navigate('/', { replace: true });
  };

  if (reason === 'deleted') {
    return (
      <Shell tone="danger" icon="bi-person-x" title="This account no longer exists">
        <p className="text-sm text-subtle leading-relaxed">
          An administrator has removed this account. All of its data — your profile,
          CV, saved listings and applications — has been deleted from the platform.
        </p>
        <p className="mt-3 text-sm text-subtle leading-relaxed">
          You are welcome to create a new account with this email address at any time.
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            onClick={goHome}
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:opacity-90"
          >
            Go to homepage
          </button>
          <button
            onClick={() => { onDismiss?.(); navigate('/signup', { replace: true }); }}
            className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-content transition hover:bg-muted"
          >
            Create a new account
          </button>
        </div>
      </Shell>
    );
  }

  if (reason === 'inactive') {
    return (
      <Shell tone="warn" icon="bi-pause-circle" title="This account is inactive">
        <p className="text-sm text-subtle leading-relaxed">
          Your account has been deactivated and cannot be used right now. Please
          contact an administrator if you believe this is a mistake.
        </p>
        <div className="mt-6">
          <button
            onClick={goHome}
            className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-content transition hover:bg-muted"
          >
            Back to homepage
          </button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell tone="warn" icon="bi-shield-exclamation" title="Your account is suspended">
      <p className="text-sm text-subtle leading-relaxed">
        An administrator has suspended this account. You cannot browse, apply, or
        post while the suspension is active.
      </p>

      {suspension?.reason && (
        <div className="mt-5 rounded-xl border border-line bg-muted/50 p-4">
          <p className="text-[11px] font-bold uppercase tracking-wide text-faint">Reason given</p>
          <p className="mt-1.5 text-sm text-content leading-relaxed">{suspension.reason}</p>
        </div>
      )}

      <div className="mt-4 rounded-xl border border-line bg-muted/50 p-4">
        <p className="text-[11px] font-bold uppercase tracking-wide text-faint">Duration</p>
        {suspension?.until ? (
          <p className="mt-1.5 text-sm text-content leading-relaxed">
            Your account will be reactivated automatically in{' '}
            <span className="font-bold">{remaining}</span>
            <span className="text-subtle">
              {' '}({new Date(suspension.until).toLocaleDateString(undefined, {
                year: 'numeric', month: 'long', day: 'numeric',
              })})
            </span>.
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-content leading-relaxed">
            This suspension has no end date. Contact an administrator to appeal it.
          </p>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <button
          onClick={onRecheck}
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-ink transition hover:opacity-90"
        >
          Check again
        </button>
        <button
          onClick={goHome}
          className="rounded-lg border border-line px-5 py-2.5 text-sm font-semibold text-content transition hover:bg-muted"
        >
          Log out
        </button>
      </div>
    </Shell>
  );
}

function Shell({ tone, icon, title, children }) {
  const ring = tone === 'danger' ? 'text-danger' : 'text-accent';
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-surface px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-raised p-7 shadow-xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">
            IF
          </span>
          <span className="text-sm font-black text-content">Internship Finder</span>
        </div>

        <div className={`mb-4 flex items-center gap-2.5 ${ring}`}>
          <i className={`bi ${icon} text-2xl`} />
          <h1 className="text-xl font-black tracking-tight text-content">{title}</h1>
        </div>

        {children}
      </div>
    </div>
  );
}
