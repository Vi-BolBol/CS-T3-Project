import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { getAuditLogs } from '../../api/adminApi';
import { logsToCsv, logsToTxt, downloadFile, exportFilename } from '../../utils/exportLogs';

// Colour-code by what the action means, so a long log is scannable.
const toneFor = (action = '') => {
  if (action.includes('DELETED') || action.includes('REJECTED') || action.includes('BLOCKED') || action.includes('FAILED')) return 'text-danger';
  if (action.includes('SUSPENDED')) return 'text-warn';
  if (action.includes('ACCEPTED') || action.includes('GRANTED') || action.includes('REGISTERED')) return 'text-accent';
  return 'text-subtle';
};

const iconFor = (action = '') => {
  if (action.includes('LOGIN')) return 'bi-box-arrow-in-right';
  if (action.includes('REGISTERED')) return 'bi-person-plus';
  if (action.includes('APPLICATION')) return 'bi-send';
  if (action.includes('INTERNSHIP')) return 'bi-briefcase';
  if (action.includes('USER_')) return 'bi-person-gear';
  if (action.includes('ADMIN_')) return 'bi-shield-lock';
  return 'bi-dot';
};

/* Grouping so a long dropdown stays navigable. Anything the backend reports
   that isn't listed here still appears, under "Other" — the list comes from the
   database, so a new action type can never go missing from the filter. */
const GROUPS = [
  { label: 'Authentication', match: (a) => a.includes('LOGIN') || a.includes('REGISTERED') },
  { label: 'Applications',   match: (a) => a.startsWith('APPLICATION') },
  { label: 'Listings',       match: (a) => a.startsWith('INTERNSHIP') },
  { label: 'Account admin',  match: (a) => a.startsWith('USER_') || a.startsWith('ADMIN_') },
];

const PRESETS = [
  { label: 'Today',    days: 0 },
  { label: '7 days',   days: 7 },
  { label: '30 days',  days: 30 },
  { label: '90 days',  days: 90 },
];

const isoDay = (d) => d.toISOString().slice(0, 10);
const todayISO = () => isoDay(new Date());
const daysAgoISO = (n) => isoDay(new Date(Date.now() - n * 86400000));

const INITIAL = { search: '', action: '', role: '', from: '', to: '', limit: 150 };

const fieldCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content placeholder:text-faint focus:border-accent focus:outline-none';

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [actions, setActions] = useState([]);
  const [filters, setFilters] = useState(INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  const set = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  /*
    Everything except the free-text box is applied SERVER-side.

    That matters because of the row limit: filtering 150 already-fetched rows in
    the browser would silently hide anything older than those 150, so a search
    for a rare action could come back empty while the entry sat in the database.
    Sending the filter to the query means the limit applies to matches.
  */
  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAuditLogs({
      action: filters.action || undefined,
      role: filters.role || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      limit: filters.limit,
    });
    if (res.success) {
      setLogs(res.logs || []);
      if (res.actions?.length) setActions(res.actions);
      setError(null);
    } else {
      setError(res.message);
    }
    setLoading(false);
  }, [filters.action, filters.role, filters.from, filters.to, filters.limit]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onClick = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) setExportOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Free text stays client-side: it's a quick narrowing of what's on screen,
  // and round-tripping on every keystroke would be worse than useless.
  const q = filters.search.trim().toLowerCase();
  const visible = useMemo(() => (
    q
      ? logs.filter((l) =>
          (l.action || '').toLowerCase().includes(q) ||
          (l.user?.email || '').toLowerCase().includes(q) ||
          (l.entityType || '').toLowerCase().includes(q) ||
          String(l.entityId ?? '').includes(q))
      : logs
  ), [logs, q]);

  const grouped = useMemo(() => {
    const seen = new Set();
    const out = GROUPS.map((g) => {
      const items = actions.filter((a) => g.match(a));
      items.forEach((a) => seen.add(a));
      return { label: g.label, items };
    }).filter((g) => g.items.length);

    const rest = actions.filter((a) => !seen.has(a));
    if (rest.length) out.push({ label: 'Other', items: rest });
    return out;
  }, [actions]);

  const activeCount = Object.entries(filters)
    .filter(([k, v]) => k !== 'limit' && v && v !== INITIAL[k]).length;

  const clearAll = () => setFilters(INITIAL);

  const filterSummary = useMemo(() => {
    const parts = [];
    if (filters.action) parts.push(`action=${filters.action}`);
    if (filters.role) parts.push(`role=${filters.role}`);
    if (filters.from) parts.push(`from=${filters.from}`);
    if (filters.to) parts.push(`to=${filters.to}`);
    if (filters.search) parts.push(`text="${filters.search}"`);
    return parts.length ? parts.join(', ') : 'none';
  }, [filters]);

  // Exports what is on screen, filters included — not the whole table.
  const doExport = (kind) => {
    setExportOpen(false);
    if (!visible.length) return;
    if (kind === 'csv') {
      downloadFile(exportFilename('csv'), logsToCsv(visible), 'text/csv');
    } else {
      downloadFile(exportFilename('txt'), logsToTxt(visible, { filterSummary }), 'text/plain');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-content">Audit logs</h1>
            <p className="mt-1 text-sm text-subtle">Every login, registration, application, and admin action.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-content"
            >
              <i className="bi bi-arrow-clockwise mr-1" /> Refresh
            </button>

            <div ref={exportRef} className="relative">
              <button
                onClick={() => setExportOpen((o) => !o)}
                disabled={!visible.length}
                aria-expanded={exportOpen}
                className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle transition hover:text-content disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className="bi bi-download mr-1" /> Export
                <i className="bi bi-chevron-down ml-1 text-[9px]" />
              </button>

              {exportOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-60 overflow-hidden rounded-lg border border-line bg-raised shadow-lg">
                  <p className="border-b border-line px-3 py-2 text-[11px] text-faint">
                    Exports the {visible.length} entr{visible.length === 1 ? 'y' : 'ies'} currently shown.
                  </p>
                  <button
                    onClick={() => doExport('csv')}
                    className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition hover:bg-muted"
                  >
                    <i className="bi bi-filetype-csv mt-0.5 text-accent" />
                    <span>
                      <span className="block text-xs font-semibold text-content">CSV</span>
                      <span className="block text-[11px] text-subtle">Opens in Excel or Sheets</span>
                    </span>
                  </button>
                  <button
                    onClick={() => doExport('txt')}
                    className="flex w-full items-start gap-2.5 border-t border-line px-3 py-2.5 text-left transition hover:bg-muted"
                  >
                    <i className="bi bi-filetype-txt mt-0.5 text-accent" />
                    <span>
                      <span className="block text-xs font-semibold text-content">Plain text</span>
                      <span className="block text-[11px] text-subtle">Readable report with a header</span>
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ---------- filters ---------- */}
        <div className="mb-4 rounded-xl border border-line bg-raised p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-content">Filters</h2>
            {activeCount > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-accent hover:underline">
                Clear all ({activeCount})
              </button>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">Search</span>
              <input
                value={filters.search}
                onChange={(e) => set('search', e.target.value)}
                placeholder="Action, email, or entity"
                className={fieldCls}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">Action</span>
              <select value={filters.action} onChange={(e) => set('action', e.target.value)} className={fieldCls}>
                <option value="">All actions</option>
                {grouped.map((g) => (
                  <optgroup key={g.label} label={g.label}>
                    {g.items.map((a) => <option key={a} value={a}>{a}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">Role</span>
              <select value={filters.role} onChange={(e) => set('role', e.target.value)} className={fieldCls}>
                <option value="">All roles</option>
                <option value="student">Student</option>
                <option value="company">Company</option>
                <option value="admin">Admin</option>
              </select>
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">From</span>
              <input
                type="date"
                value={filters.from}
                max={filters.to || todayISO()}
                onChange={(e) => set('from', e.target.value)}
                className={fieldCls}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">To</span>
              <input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                max={todayISO()}
                onChange={(e) => set('to', e.target.value)}
                className={fieldCls}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">Max rows</span>
              <select
                value={filters.limit}
                onChange={(e) => set('limit', Number(e.target.value))}
                className={fieldCls}
              >
                {[50, 150, 500, 1000, 2000].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-wide text-faint">Quick range</span>
              <div className="flex flex-wrap gap-1">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => setFilters((f) => ({
                      ...f,
                      from: p.days === 0 ? todayISO() : daysAgoISO(p.days),
                      to: todayISO(),
                    }))}
                    className="rounded-lg border border-line px-2 py-1.5 text-[11px] font-semibold text-subtle transition hover:text-content"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filters.role && (
            <p className="mt-3 text-[11px] text-faint">
              <i className="bi bi-info-circle mr-1" />
              Filtering by role hides entries from deleted accounts — those logs survive the
              account, but no longer have a role attached.
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
        )}

        {!loading && (
          <p className="mb-3 text-xs text-subtle">
            {visible.length === logs.length
              ? `${visible.length} entr${visible.length === 1 ? 'y' : 'ies'}`
              : `${visible.length} of ${logs.length} entries match`}
            {logs.length >= filters.limit && (
              <span className="text-warn">
                {' '}· row limit reached, raise “Max rows” to see older entries
              </span>
            )}
          </p>
        )}

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
            <i className="bi bi-list-columns text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">No audit entries match</p>
            <p className="mt-1 text-xs text-subtle">
              {activeCount > 0
                ? 'Try widening the date range or clearing a filter.'
                : 'Log in, register, or apply to an internship — entries appear here.'}
            </p>
            {activeCount > 0 && (
              <button onClick={clearAll} className="mt-4 rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
            {visible.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                <i className={`bi ${iconFor(l.action)} ${toneFor(l.action)}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${toneFor(l.action)}`}>{l.action}</p>
                  <p className="truncate text-xs text-subtle">
                    {l.userId ? (
                      <Link to={`/admin/users/${l.userId}`} className="hover:text-accent hover:underline">
                        {l.user?.email || `User #${l.userId}`}
                      </Link>
                    ) : (
                      <span className="italic text-faint">deleted user</span>
                    )}
                    {l.user?.role ? ` · ${l.user.role}` : ''}
                    {l.entityType ? ` · ${l.entityType}${l.entityId ? ` #${l.entityId}` : ''}` : ''}
                  </p>
                </div>
                <span className="flex-shrink-0 text-xs text-faint">
                  {new Date(l.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
