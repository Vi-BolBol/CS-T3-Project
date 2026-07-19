import { useEffect, useState } from 'react';

/*
  Suspending someone is a moderation decision, not a toggle.

  It used to be a single button that flipped a status flag with no record of why
  and no end date — which left the suspended person with no explanation and left
  the next admin with no way to review the call. Both a reason and a duration are
  captured here; the reason is required by the API, not just by this form.
*/

const PRESETS = [
  { label: '1 day',    days: 1 },
  { label: '3 days',   days: 3 },
  { label: '7 days',   days: 7 },
  { label: '30 days',  days: 30 },
  { label: '90 days',  days: 90 },
  { label: 'Permanent', days: 'permanent' },
];

const COMMON_REASONS = [
  'Spam or repeated irrelevant postings',
  'Misleading or fraudulent listing details',
  'Harassment or inappropriate conduct',
  'Fake or impersonated account',
  'Misuse of applicant data',
];

export default function SuspendUserDialog({ open, user, onConfirm, onCancel, busy }) {
  const [reason, setReason] = useState('');
  const [days, setDays] = useState(7);
  const [custom, setCustom] = useState('');
  const [touched, setTouched] = useState(false);

  // Reset every time the dialog is opened for a different account.
  useEffect(() => {
    if (open) { setReason(''); setDays(7); setCustom(''); setTouched(false); }
  }, [open, user?.id]);

  if (!open || !user) return null;

  const effectiveDays = days === 'custom' ? Number(custom) : days;
  const customInvalid =
    days === 'custom' && (!custom || Number(custom) < 1 || Number(custom) > 3650);
  const reasonInvalid = !reason.trim();
  const canSubmit = !reasonInvalid && !customInvalid && !busy;

  const endsOn =
    effectiveDays && effectiveDays !== 'permanent' && Number.isFinite(Number(effectiveDays))
      ? new Date(Date.now() + Number(effectiveDays) * 86400000)
      : null;

  const name = user.studentProfile?.fullName || user.companyProfile?.companyName || user.email;

  const submit = () => {
    setTouched(true);
    if (!canSubmit) return;
    onConfirm({ reason: reason.trim(), days: days === 'custom' ? Number(custom) : days });
  };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/50 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-raised p-6 shadow-xl">
        <div className="mb-1 flex items-center gap-2 text-warn">
          <i className="bi bi-shield-exclamation text-xl" />
          <h2 className="text-lg font-black tracking-tight text-content">Suspend account</h2>
        </div>
        <p className="mb-5 text-sm text-subtle">
          <span className="font-semibold text-content">{name}</span>
          {name !== user.email && <span className="text-faint"> · {user.email}</span>}
        </p>

        {/* Reason */}
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-faint">
          Reason for suspension <span className="text-danger">*</span>
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          placeholder="Explain what this account did. The user will see this."
          className={`w-full resize-none rounded-lg border bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:outline-none ${
            touched && reasonInvalid ? 'border-danger' : 'border-line focus:border-accent'
          }`}
        />
        {touched && reasonInvalid && (
          <p className="mt-1 text-xs text-danger">A reason is required.</p>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {COMMON_REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReason(r)}
              className="rounded-md border border-line px-2 py-1 text-[11px] text-subtle transition hover:border-accent/50 hover:text-content"
            >
              {r}
            </button>
          ))}
        </div>

        {/* Duration */}
        <label className="mb-1.5 mt-5 block text-xs font-bold uppercase tracking-wide text-faint">
          Duration
        </label>
        <div className="flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setDays(p.days)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                days === p.days
                  ? 'bg-accent-soft text-accent'
                  : 'border border-line text-subtle hover:text-content'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setDays('custom')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              days === 'custom'
                ? 'bg-accent-soft text-accent'
                : 'border border-line text-subtle hover:text-content'
            }`}
          >
            Custom
          </button>
        </div>

        {days === 'custom' && (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={3650}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Days"
              className={`w-28 rounded-lg border bg-muted px-3 py-2 text-sm text-content focus:outline-none ${
                touched && customInvalid ? 'border-danger' : 'border-line focus:border-accent'
              }`}
            />
            <span className="text-xs text-subtle">days (1–3650)</span>
          </div>
        )}

        <div className="mt-4 rounded-lg border border-line bg-muted/50 px-3 py-2.5 text-xs text-subtle">
          {days === 'permanent' ? (
            <>This account will stay suspended until an admin reactivates it manually.</>
          ) : endsOn ? (
            <>
              The account reactivates itself on{' '}
              <span className="font-bold text-content">
                {endsOn.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>. No follow-up action needed.
            </>
          ) : (
            <>Enter a number of days.</>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-subtle transition hover:text-content disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={busy}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {busy ? 'Suspending…' : 'Suspend account'}
          </button>
        </div>
      </div>
    </div>
  );
}
