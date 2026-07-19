import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import Toast from '../../components/shared/Toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import SuspendUserDialog from '../../components/admin/SuspendUserDialog';
import DeleteUserDialog from '../../components/admin/DeleteUserDialog';
import ClassicTemplate from '../../components/cv/templates/ClassicTemplate';
import useToast from '../../hooks/useToast';
import {
  getUserDetail, getUserActivity, getUserInternships, getUserCv,
  setUserStatus, deleteUser, setInternshipStatus, deleteInternship,
} from '../../api/adminApi';

/*
  One account, inspected.

  The users table could only ever answer "who exists" — an admin deciding whether
  to suspend someone had no way to see what that person had actually been doing.
  This page is the evidence: their activity trail (date-filterable), and,
  depending on the role, either the listings they have posted or the CV they have
  published.
*/

const STATUS_STYLE = {
  active: 'bg-accent-soft text-accent',
  suspended: 'bg-danger/10 text-danger',
  inactive: 'bg-muted text-subtle',
};

// Audit actions grouped so the filter isn't a wall of raw enum strings.
const ACTION_GROUPS = [
  { label: 'All activity', value: '' },
  { label: 'Sign-ins', value: 'USER_LOGIN' },
  { label: 'Failed sign-ins', value: 'LOGIN_FAILED' },
  { label: 'Blocked (suspended)', value: 'LOGIN_BLOCKED_SUSPENDED' },
  { label: 'Applications sent', value: 'APPLICATION_SUBMITTED' },
  { label: 'Accepted applicants', value: 'APPLICATION_ACCEPTED' },
  { label: 'Rejected applicants', value: 'APPLICATION_REJECTED' },
];

const ACTION_META = {
  USER_REGISTERED:         { icon: 'bi-person-plus',     tone: 'text-accent',  label: 'Registered an account' },
  USER_LOGIN:              { icon: 'bi-box-arrow-in-right', tone: 'text-subtle', label: 'Signed in' },
  LOGIN_FAILED:            { icon: 'bi-exclamation-triangle', tone: 'text-warn', label: 'Failed sign-in attempt' },
  LOGIN_BLOCKED_SUSPENDED: { icon: 'bi-shield-lock',     tone: 'text-danger',  label: 'Blocked — account suspended' },
  APPLICATION_SUBMITTED:   { icon: 'bi-send',            tone: 'text-accent',  label: 'Submitted an application' },
  APPLICATION_ACCEPTED:    { icon: 'bi-check-circle',    tone: 'text-accent',  label: 'Accepted an applicant' },
  APPLICATION_REJECTED:    { icon: 'bi-x-circle',        tone: 'text-danger',  label: 'Rejected an applicant' },
  USER_SUSPENDED:          { icon: 'bi-shield-exclamation', tone: 'text-danger', label: 'Suspended an account' },
  USER_ACTIVE:             { icon: 'bi-arrow-counterclockwise', tone: 'text-accent', label: 'Reactivated an account' },
  USER_DELETED:            { icon: 'bi-trash3',          tone: 'text-danger',  label: 'Deleted an account' },
  USER_SUSPENSION_EXPIRED: { icon: 'bi-clock-history',   tone: 'text-accent',  label: 'Suspension expired automatically' },
  INTERNSHIP_SUSPENDED:    { icon: 'bi-slash-circle',    tone: 'text-danger',  label: 'Listing suspended' },
  INTERNSHIP_DELETED:      { icon: 'bi-trash3',          tone: 'text-danger',  label: 'Listing deleted' },
  INTERNSHIP_OPEN:         { icon: 'bi-arrow-counterclockwise', tone: 'text-accent', label: 'Listing restored' },
  ADMIN_GRANTED:           { icon: 'bi-star',            tone: 'text-warn',    label: 'Granted admin rights' },
  ADMIN_REVOKED:           { icon: 'bi-star-half',       tone: 'text-warn',    label: 'Admin rights revoked' },
};

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysAgoISO = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { message: toastMessage, showToast, clearToast } = useToast();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('activity');

  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [range, setRange] = useState({ from: '', to: '', action: '' });

  const [internships, setInternships] = useState([]);
  const [cv, setCv] = useState(null);
  const [subLoading, setSubLoading] = useState(false);

  const [suspendOpen, setSuspendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [listingAction, setListingAction] = useState(null); // { internship, mode }

  /* ---------- load the account ---------- */
  const loadUser = useCallback(async () => {
    setLoading(true);
    const res = await getUserDetail(id);
    if (res.success) { setUser(res.user); setError(null); }
    else setError(res.message);
    setLoading(false);
  }, [id]);

  useEffect(() => { loadUser(); }, [loadUser]);

  /* ---------- activity ---------- */
  const loadLogs = useCallback(async () => {
    setLogsLoading(true);
    const res = await getUserActivity(id, range);
    if (res.success) setLogs(res.logs || []);
    setLogsLoading(false);
  }, [id, range]);

  useEffect(() => { if (tab === 'activity') loadLogs(); }, [tab, loadLogs]);

  /* ---------- role-specific tab ---------- */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (tab === 'listings') {
        setSubLoading(true);
        const res = await getUserInternships(id);
        if (!cancelled && res.success) setInternships(res.internships || []);
        if (!cancelled) setSubLoading(false);
      } else if (tab === 'cv') {
        setSubLoading(true);
        const res = await getUserCv(id);
        if (!cancelled && res.success) setCv(res.cv);
        if (!cancelled) setSubLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [tab, id]);

  /* ---------- actions ---------- */
  const doSuspend = async ({ reason, days }) => {
    setBusy(true);
    const res = await setUserStatus(id, 'suspended', { reason, days });
    setBusy(false);
    showToast(res.success ? res.message : res.message);
    if (res.success) { setSuspendOpen(false); loadUser(); }
  };

  const doReactivate = async () => {
    const res = await setUserStatus(id, 'active');
    showToast(res.success ? 'Account reactivated.' : res.message);
    if (res.success) loadUser();
  };

  const doDelete = async ({ reason }) => {
    setBusy(true);
    const res = await deleteUser(id, { reason });
    setBusy(false);
    if (res.success) {
      showToast(
        res.tombstoned
          ? `Account deleted. ${res.tombstoned} application(s) marked as removed for the students involved.`
          : 'Account deleted.'
      );
      navigate('/admin/users', { replace: true });
    } else {
      showToast(res.message);
    }
  };

  const doListingAction = async () => {
    if (!listingAction) return;
    const { internship, mode } = listingAction;
    setBusy(true);
    const res =
      mode === 'delete'
        ? await deleteInternship(internship.id, 'Removed by an administrator.')
        : await setInternshipStatus(
            internship.id,
            mode === 'suspend' ? 'suspended' : 'open',
            mode === 'suspend' ? 'Suspended by an administrator.' : null
          );
    setBusy(false);
    showToast(res.success ? res.message : res.message);
    setListingAction(null);
    if (res.success) {
      const refreshed = await getUserInternships(id);
      if (refreshed.success) setInternships(refreshed.internships || []);
    }
  };

  const name = user?.studentProfile?.fullName || user?.companyProfile?.companyName || user?.email;
  const isAdmin = user?.role === 'admin';

  const tabs = useMemo(() => {
    const base = [{ id: 'activity', label: 'Activity', icon: 'bi-clock-history' }];
    if (user?.role === 'company') base.push({ id: 'listings', label: 'Listings', icon: 'bi-briefcase' });
    if (user?.role === 'student') base.push({ id: 'cv', label: 'CV', icon: 'bi-file-earmark-person' });
    return base;
  }, [user?.role]);

  return (
    <AdminLayout title="Account detail" subtitle="Review what this account has been doing before acting on it.">
      <button
        onClick={() => navigate('/admin/users')}
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-subtle transition hover:text-content"
      >
        <i className="bi bi-arrow-left" /> Back to users
      </button>

      {error && (
        <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <div className="h-48 animate-pulse rounded-2xl border border-line bg-muted" />
      ) : !user ? null : (
        <>
          {/* ---------- header card ---------- */}
          <section className="mb-6 rounded-2xl border border-line bg-raised p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-lg font-black text-content">{name}</h2>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-subtle">
                    {user.role}
                  </span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[user.status]}`}>
                    {user.status}
                  </span>
                </div>
                <p className="mt-1 text-sm text-subtle">{user.email}</p>
                <p className="mt-0.5 text-xs text-faint">
                  Joined {new Date(user.createdAt).toLocaleDateString()} ·{' '}
                  {user._count?.applications ?? 0} application(s) ·{' '}
                  {user._count?.auditLogs ?? 0} logged event(s)
                </p>

                {user.role === 'student' && (
                  <Link
                    to={`/user/profile/${user.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    View public profile <i className="bi bi-box-arrow-up-right text-[10px]" />
                  </Link>
                )}
              </div>

              {!isAdmin && (
                <div className="flex flex-shrink-0 gap-2">
                  {user.status === 'suspended' ? (
                    <button
                      onClick={doReactivate}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-accent"
                    >
                      Reactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => setSuspendOpen(true)}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-warn"
                    >
                      Suspend
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteOpen(true)}
                    className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-danger"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>

            {user.status === 'suspended' && (
              <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2.5 text-xs text-danger">
                <p className="font-bold">
                  Suspended{user.suspendedAt ? ` on ${new Date(user.suspendedAt).toLocaleDateString()}` : ''}
                </p>
                {user.suspensionReason && <p className="mt-1 leading-relaxed">{user.suspensionReason}</p>}
                <p className="mt-1 opacity-90">
                  {user.suspendedUntil
                    ? `Reactivates automatically on ${new Date(user.suspendedUntil).toLocaleDateString()}.`
                    : 'Indefinite — needs manual reactivation.'}
                </p>
              </div>
            )}
          </section>

          {/* ---------- tabs ---------- */}
          <div className="mb-4 flex gap-1.5 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                  tab === t.id ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
                }`}
              >
                <i className={`bi ${t.icon}`} /> {t.label}
              </button>
            ))}
          </div>

          {/* ---------- activity ---------- */}
          {tab === 'activity' && (
            <>
              <div className="mb-4 flex flex-wrap items-end gap-2 rounded-xl border border-line bg-raised p-3">
                <Field label="From">
                  <input
                    type="date"
                    value={range.from}
                    max={range.to || todayISO()}
                    onChange={(e) => setRange({ ...range, from: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="To">
                  <input
                    type="date"
                    value={range.to}
                    min={range.from || undefined}
                    max={todayISO()}
                    onChange={(e) => setRange({ ...range, to: e.target.value })}
                    className={inputCls}
                  />
                </Field>
                <Field label="Type">
                  <select
                    value={range.action}
                    onChange={(e) => setRange({ ...range, action: e.target.value })}
                    className={inputCls}
                  >
                    {ACTION_GROUPS.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </Field>

                <div className="ml-auto flex gap-1.5">
                  {[
                    { label: '7 days', days: 7 },
                    { label: '30 days', days: 30 },
                    { label: '90 days', days: 90 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      onClick={() => setRange({ ...range, from: daysAgoISO(p.days), to: todayISO() })}
                      className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-subtle transition hover:text-content"
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setRange({ from: '', to: '', action: '' })}
                    className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-semibold text-subtle transition hover:text-content"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {logsLoading ? (
                <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
              ) : logs.length === 0 ? (
                <Empty icon="bi-clock-history" title="No activity in this range" />
              ) : (
                <ol className="overflow-hidden rounded-xl border border-line bg-raised">
                  {logs.map((log) => {
                    const meta = ACTION_META[log.action] || {
                      icon: 'bi-dot', tone: 'text-subtle', label: log.action,
                    };
                    return (
                      <li key={log.id} className="flex items-start gap-3 border-b border-line px-4 py-3 last:border-0">
                        <i className={`bi ${meta.icon} mt-0.5 ${meta.tone}`} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-content">{meta.label}</p>
                          <p className="text-[11px] text-faint">
                            {log.entityType && `${log.entityType}${log.entityId ? ` #${log.entityId}` : ''} · `}
                            <span className="font-mono">{log.action}</span>
                          </p>
                        </div>
                        <time className="flex-shrink-0 text-[11px] text-subtle">
                          {new Date(log.createdAt).toLocaleString()}
                        </time>
                      </li>
                    );
                  })}
                </ol>
              )}
            </>
          )}

          {/* ---------- company listings ---------- */}
          {tab === 'listings' && (
            subLoading ? (
              <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
            ) : internships.length === 0 ? (
              <Empty icon="bi-briefcase" title="This company has not posted any listings" />
            ) : (
              <ul className="space-y-2.5">
                {internships.map((it) => (
                  <li key={it.id} className="rounded-xl border border-line bg-raised p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-content">{it.title}</p>
                        <p className="mt-0.5 text-xs text-subtle">
                          {[it.location, it.internshipCategory].filter(Boolean).join(' · ') || 'No details'}
                        </p>
                        <p className="mt-1 text-[11px] text-faint">
                          {it._count?.applications ?? 0} applicant(s) · posted{' '}
                          {new Date(it.createdAt).toLocaleDateString()}
                        </p>
                        {it.status === 'suspended' && it.suspensionReason && (
                          <p className="mt-1.5 text-[11px] text-danger">{it.suspensionReason}</p>
                        )}
                      </div>

                      <div className="flex flex-shrink-0 items-center gap-1.5">
                        <span className={`rounded-md px-2 py-1 text-[11px] font-semibold ${
                          it.status === 'suspended'
                            ? 'bg-danger/10 text-danger'
                            : it.status === 'open'
                            ? 'bg-accent-soft text-accent'
                            : 'bg-muted text-subtle'
                        }`}>
                          {it.status}
                        </span>
                        {it.status === 'suspended' ? (
                          <button
                            onClick={() => setListingAction({ internship: it, mode: 'restore' })}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle transition hover:text-accent"
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => setListingAction({ internship: it, mode: 'suspend' })}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle transition hover:text-warn"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => setListingAction({ internship: it, mode: 'delete' })}
                          className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle transition hover:text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}

          {/* ---------- student CV ---------- */}
          {tab === 'cv' && (
            subLoading ? (
              <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
            ) : !cv ? (
              <Empty icon="bi-file-earmark-person" title="This student has not saved a CV" />
            ) : (
              <div className="rounded-xl border border-line bg-raised p-4">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-subtle">
                  <span>Last updated {new Date(cv.updatedAt).toLocaleString()}</span>
                  {cv.score != null && (
                    <span className="rounded-md bg-muted px-2 py-1 font-semibold text-content">
                      Score {cv.score}
                    </span>
                  )}
                </div>
                {/* Rendered with the same template the student sees, so an admin is
                    reviewing the real artefact rather than a JSON dump. */}
                <div className="overflow-auto rounded-lg border border-line bg-white p-2">
                  <ClassicTemplate
                    cvData={cv.userCvData || {}}
                    palette={{ name: 'Slate', primary: '#94A3B8', dark: '#0F172A' }}
                  />
                </div>
              </div>
            )
          )}
        </>
      )}

      <SuspendUserDialog
        open={suspendOpen}
        user={user}
        busy={busy}
        onConfirm={doSuspend}
        onCancel={() => setSuspendOpen(false)}
      />
      <DeleteUserDialog
        open={deleteOpen}
        user={user}
        busy={busy}
        onConfirm={doDelete}
        onCancel={() => setDeleteOpen(false)}
      />
      <ConfirmDialog
        open={Boolean(listingAction)}
        title={
          listingAction?.mode === 'delete'
            ? 'Delete this listing?'
            : listingAction?.mode === 'suspend'
            ? 'Suspend this listing?'
            : 'Restore this listing?'
        }
        message={
          listingAction?.mode === 'delete'
            ? `"${listingAction?.internship?.title}" will be permanently removed. Students who applied keep a record of their application, marked as removed.`
            : listingAction?.mode === 'suspend'
            ? `"${listingAction?.internship?.title}" will be hidden from students and stop accepting applications. Existing applicants are told it is on hold.`
            : `"${listingAction?.internship?.title}" will become visible and start accepting applications again.`
        }
        confirmLabel={listingAction?.mode === 'delete' ? 'Delete' : listingAction?.mode === 'suspend' ? 'Suspend' : 'Restore'}
        onConfirm={doListingAction}
        onCancel={() => setListingAction(null)}
      />
      <Toast message={toastMessage} onClose={clearToast} />
    </AdminLayout>
  );
}

const inputCls =
  'rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold uppercase tracking-wide text-faint">{label}</span>
      {children}
    </label>
  );
}

function Empty({ icon, title }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
      <i className={`bi ${icon} text-3xl text-faint`} />
      <p className="mt-3 text-sm font-semibold text-content">{title}</p>
    </div>
  );
}
