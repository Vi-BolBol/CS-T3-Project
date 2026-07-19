import { useEffect, useState } from 'react';

/*
  Deleting an account is irreversible and cascades. The confirmation asks the
  admin to type the email, because "are you sure?" on a table row is exactly the
  kind of dialog people dismiss by reflex.

  The reason is optional here but useful: for a company account it is written
  onto every affected student's application tombstone, so those students get told
  *why* the listing they applied to disappeared rather than just that it did.
*/
export default function DeleteUserDialog({ open, user, onConfirm, onCancel, busy }) {
  const [typed, setTyped] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) { setTyped(''); setReason(''); }
  }, [open, user?.id]);

  if (!open || !user) return null;

  const matches = typed.trim().toLowerCase() === String(user.email).toLowerCase();
  const isCompany = user.role === 'company';
  const name = user.studentProfile?.fullName || user.companyProfile?.companyName || user.email;

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-black/50 px-4 py-10 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-danger/30 bg-raised p-6 shadow-xl">
        <div className="mb-1 flex items-center gap-2 text-danger">
          <i className="bi bi-trash3 text-xl" />
          <h2 className="text-lg font-black tracking-tight text-content">Delete this account?</h2>
        </div>
        <p className="mb-4 text-sm text-subtle">
          <span className="font-semibold text-content">{name}</span>
          {name !== user.email && <span className="text-faint"> · {user.email}</span>}
        </p>

        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger">
          <p className="font-bold">This cannot be undone.</p>
          <ul className="mt-1.5 list-disc space-y-0.5 pl-4 leading-relaxed">
            <li>The account and all of its data are permanently removed.</li>
            {isCompany ? (
              <>
                <li>Every listing this company posted is deleted.</li>
                <li>
                  Students who applied keep a record of their application, marked as
                  removed, with the reason below.
                </li>
              </>
            ) : (
              <li>Their CV, saved listings, and applications are deleted.</li>
            )}
            <li>
              If they are signed in right now, they are returned to the homepage on
              their next action.
            </li>
            <li>The email address becomes free to register again.</li>
          </ul>
        </div>

        <label className="mb-1.5 mt-5 block text-xs font-bold uppercase tracking-wide text-faint">
          Reason {isCompany && <span className="normal-case text-subtle">(shown to affected students)</span>}
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={2}
          placeholder={
            isCompany
              ? 'e.g. Fraudulent listings — company removed from the platform.'
              : 'Optional note for the audit log.'
          }
          className="w-full resize-none rounded-lg border border-line bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:border-accent focus:outline-none"
        />

        <label className="mb-1.5 mt-4 block text-xs font-bold uppercase tracking-wide text-faint">
          Type <span className="text-content">{user.email}</span> to confirm
        </label>
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          placeholder={user.email}
          autoComplete="off"
          className={`w-full rounded-lg border bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:outline-none ${
            typed && !matches ? 'border-danger' : 'border-line focus:border-accent'
          }`}
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-subtle transition hover:text-content disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => matches && onConfirm({ reason: reason.trim() })}
            disabled={!matches || busy}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? 'Deleting…' : 'Delete permanently'}
          </button>
        </div>
      </div>
    </div>
  );
}
