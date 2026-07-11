import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/StudentNavbar';
import Footer from '../../components/layout/StudentFooter';
import InternshipCard from '../../components/ui/InternshipCard';
import Toast from '../../components/shared/Toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import useMyApplications from '../../hooks/useMyApplications';
import useSavedInternships from '../../hooks/useSavedInternships';
import useApplicationAlerts from '../../hooks/useApplicationAlerts';
import useToast from '../../hooks/useToast';

const STATUS = {
  pending:  { label: 'Pending',       icon: 'bi-hourglass-split', cls: 'bg-muted text-subtle' },
  reviewed: { label: 'Under review',  icon: 'bi-eye',             cls: 'bg-muted text-subtle' },
  accepted: { label: 'Accepted',      icon: 'bi-check-circle-fill', cls: 'bg-accent-soft text-accent' },
  rejected: { label: 'Not selected',  icon: 'bi-x-circle-fill',   cls: 'bg-danger/10 text-danger' },
};

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${s.cls}`}>
      <i className={`bi ${s.icon}`} /> {s.label}
    </span>
  );
}

export default function UserApplication() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab') === 'saved' ? 'saved' : 'applied';

  const { applications, withdraw, loading, error } = useMyApplications();
  const { savedInternships, fetchSaved, unsaveInternship } = useSavedInternships();
  const { clear: clearAlerts } = useApplicationAlerts();
  const { message: toastMessage, showToast, clearToast } = useToast();
  const [confirm, setConfirm] = useState(null);

  const apps = Array.isArray(applications) ? applications : [];
  const savedList = Array.isArray(savedInternships) ? savedInternships : [];

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  // Opening this page marks accept/reject news as seen -> clears the nav badge.
  useEffect(() => { clearAlerts(); }, [clearAlerts]);

  const setTab = (t) => setSearchParams(t === 'saved' ? { tab: 'saved' } : {});

  const doWithdraw = async () => {
    if (!confirm) return;
    await withdraw(confirm.id);
    showToast('Application withdrawn.');
    setConfirm(null);
  };

  const tabCls = (active) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
      active ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Applications</h1>
          <p className="mt-1 text-sm text-subtle">Track what you've applied to and revisit what you saved.</p>
        </header>

        <div className="mb-6 flex gap-1 rounded-xl border border-line bg-raised p-1">
          <button onClick={() => setTab('applied')} className={tabCls(tab === 'applied')}>
            Applied ({apps.length})
          </button>
          <button onClick={() => setTab('saved')} className={tabCls(tab === 'saved')}>
            Saved ({savedList.length})
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        {/* Applied */}
        {tab === 'applied' && (
          apps.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
              <i className="bi bi-send text-3xl text-faint" />
              <p className="mt-3 text-sm font-semibold text-content">You haven't applied to anything yet</p>
              <p className="mt-1 text-xs text-subtle">When you apply, you'll be able to track the outcome here.</p>
              <Link to="/user/internships" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
                Browse internships
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {apps.map((a) => (
                <li key={a.id} className="rounded-xl border border-line bg-raised p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-content">{a.title}</h3>
                      <p className="truncate text-xs text-subtle">
                        {a.companyName} · {a.location}
                      </p>
                      <p className="mt-1 text-[11px] text-faint">
                        Applied {new Date(a.appliedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 items-center gap-2">
                      <StatusPill status={a.status} />
                      <button
                        onClick={() => setConfirm(a)}
                        className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-danger"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>

                  {(a.status === 'accepted' || a.status === 'rejected') && (
                    <div className={`mt-3 rounded-lg px-3 py-2 text-xs ${
                      a.status === 'accepted' ? 'bg-accent-soft text-accent' : 'bg-danger/10 text-danger'
                    }`}>
                      {a.status === 'accepted'
                        ? 'Congratulations! The company accepted your application — expect them to reach out by email or Telegram.'
                        : 'The company decided not to move forward this time. Keep applying — more listings are added often.'}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}

        {/* Saved */}
        {tab === 'saved' && (
          savedList.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
              <i className="bi bi-bookmark text-3xl text-faint" />
              <p className="mt-3 text-sm font-semibold text-content">Nothing saved yet</p>
              <p className="mt-1 text-xs text-subtle">Tap the bookmark icon on any internship to keep it here.</p>
              <Link to="/user/internships" className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
                Browse internships
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedList.map((job) => (
                <InternshipCard
                  key={job.id}
                  job={job}
                  saved
                  onToggleSave={async (id) => {
                    await unsaveInternship(id);
                    await fetchSaved();
                    showToast('Removed from saved.');
                  }}
                  onApply={() => showToast('Open the internship to apply.')}
                  compact
                />
              ))}
            </div>
          )
        )}
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />

      <ConfirmDialog
        open={Boolean(confirm)}
        title="Withdraw application?"
        message={confirm ? `This will withdraw your application to "${confirm.title}". You can apply again later.` : ''}
        confirmLabel="Withdraw"
        onConfirm={doWithdraw}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
