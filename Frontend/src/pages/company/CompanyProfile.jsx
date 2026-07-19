import { useState, useEffect } from 'react';
import Toast from '../../components/shared/Toast';
import useToast from '../../hooks/useToast';
import { getMyCompany, updateMyCompany } from '../../api/companyApi';

const COVERS = [
  'linear-gradient(135deg, #10b981 0%, #0ea5e9 100%)',
  'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
  'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
];

const inputCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:border-accent focus:outline-none';

export default function CompanyProfile() {
  const { message: toastMessage, showToast, clearToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [draft, setDraft] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coverIdx, setCoverIdx] = useState(0);

  useEffect(() => {
    (async () => {
      const res = await getMyCompany();
      if (res.success) { setProfile(res.profile); setDraft(res.profile); }
      else showToast(res.message);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const res = await updateMyCompany({
      companyName: draft.companyName,
      industry: draft.industry,
      location: draft.location,
      employeeCount: draft.employeeCount,
      description: draft.description,
      website: draft.website,
      contact: draft.contact,
      telegramLink: draft.telegramLink,
    });
    showToast(res.success ? 'Profile updated.' : res.message);
    if (res.success) { setProfile(res.profile); setDraft(res.profile); setEditing(false); }
  };

  if (loading) {
    return (
      <div className="flex flex-1 flex-col bg-surface">
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
          <div className="h-64 animate-pulse rounded-2xl border border-line bg-muted" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-surface">

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-2xl border border-line bg-raised">
          <div className="relative h-40 sm:h-52" style={{ background: COVERS[coverIdx] }}>
            {!editing && (
              <button
                onClick={() => setCoverIdx((i) => (i + 1) % COVERS.length)}
                title="Change cover"
                aria-label="Change cover"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-black/30 text-content backdrop-blur hover:bg-black/50"
              >
                <i className="bi bi-image text-sm" />
              </button>
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative -mt-12 flex-shrink-0">
                  <span className="absolute inset-0 animate-pulse rounded-2xl bg-accent/30 blur-md" aria-hidden="true" />
                  {profile?.logoUrl ? (
                    <img src={profile.logoUrl} alt="" className="relative h-24 w-24 rounded-2xl border-4 border-raised object-cover shadow-lg ring-2 ring-accent" />
                  ) : (
                    <span className="relative grid h-24 w-24 place-items-center rounded-2xl border-4 border-raised bg-accent-soft text-3xl font-black text-accent shadow-lg ring-2 ring-accent">
                      {(profile?.companyName || 'C').charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="min-w-0 pb-1.5">
                  <h1 className="truncate text-xl font-black text-content">
                    {profile?.companyName || 'Your company'}
                  </h1>
                  <p className="truncate text-sm text-accent">{profile?.industry || 'Add an industry'}</p>
                  <p className="mt-0.5 text-xs text-faint">
                    <i className="bi bi-geo-alt mr-1" />{profile?.location || 'Add a location'}
                    {profile?.employeeCount ? ` · ${profile.employeeCount} employees` : ''}
                  </p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => { setDraft(profile); setEditing(true); }}
                  className="flex-shrink-0 rounded-lg bg-accent px-4 py-2 pb-2 text-xs font-bold text-accent-ink transition hover:opacity-90"
                >
                  <i className="bi bi-pencil mr-1" /> Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="mt-8 space-y-3 border-t border-line pt-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Company name</label>
                    <input value={draft.companyName || ''} onChange={(e) => setDraft({ ...draft, companyName: e.target.value })} className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Industry</label>
                    <input value={draft.industry || ''} onChange={(e) => setDraft({ ...draft, industry: e.target.value })} className={inputCls} placeholder="e.g. Technology" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Location</label>
                    <input value={draft.location || ''} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputCls} placeholder="Phnom Penh, Cambodia" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Number of employees</label>
                    <input type="number" min="1" value={draft.employeeCount || ''} onChange={(e) => setDraft({ ...draft, employeeCount: e.target.value })} className={inputCls} placeholder="50" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Website</label>
                    <input value={draft.website || ''} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className={inputCls} placeholder="https://" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Contact</label>
                    <input value={draft.contact || ''} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} className={inputCls} placeholder="Email or phone" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Telegram link</label>
                  <input value={draft.telegramLink || ''} onChange={(e) => setDraft({ ...draft, telegramLink: e.target.value })} className={inputCls} placeholder="https://t.me/..." />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">About the company</label>
                  <textarea rows={4} value={draft.description || ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className={inputCls} />
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={save} className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90">
                    Save changes
                  </button>
                  <button onClick={() => setEditing(false)} className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-subtle hover:text-content">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 space-y-5 border-t border-line pt-6">
                <div>
                  <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">About</h2>
                  <p className="text-sm text-subtle">{profile?.description || 'No description added yet.'}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">Website</h2>
                    {profile?.website ? (
                      <a href={profile.website} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline">
                        {profile.website}
                      </a>
                    ) : <p className="text-sm text-subtle">—</p>}
                  </div>
                  <div>
                    <h2 className="mb-1 text-xs font-bold uppercase tracking-wide text-faint">Contact</h2>
                    <p className="truncate text-sm text-subtle">{profile?.contact || '—'}</p>
                  </div>
                </div>

                {profile?.telegramLink && (
                  <a href={profile.telegramLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline">
                    <i className="bi bi-telegram" /> Telegram
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  );
}
