import { useState, useEffect, useCallback } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { getAuditLogs } from '../../api/adminApi';

// Colour-code by what the action means, so a long log is scannable.
const toneFor = (action = '') => {
  if (action.includes('DELETED') || action.includes('REJECTED') || action.includes('BLOCKED')) return 'text-danger';
  if (action.includes('SUSPENDED')) return 'text-warn';
  if (action.includes('ACCEPTED') || action.includes('GRANTED') || action.includes('REGISTERED')) return 'text-accent';
  return 'text-subtle';
};

const iconFor = (action = '') => {
  if (action.includes('LOGIN')) return 'bi-box-arrow-in-right';
  if (action.includes('REGISTERED')) return 'bi-person-plus';
  if (action.includes('APPLICATION')) return 'bi-send';
  if (action.includes('USER_')) return 'bi-person-gear';
  if (action.includes('ADMIN_')) return 'bi-shield-lock';
  return 'bi-dot';
};

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getAuditLogs({ limit: 150 });
    if (res.success) { setLogs(res.logs || []); setError(null); }
    else setError(res.message);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = filter
    ? logs.filter((l) => (l.action || '').toLowerCase().includes(filter.toLowerCase()) ||
                         (l.user?.email || '').toLowerCase().includes(filter.toLowerCase()))
    : logs;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-content">Audit logs</h1>
            <p className="mt-1 text-sm text-subtle">Every login, registration, application, and admin action.</p>
          </div>
          <button onClick={load} className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-subtle hover:text-content">
            <i className="bi bi-arrow-clockwise mr-1" /> Refresh
          </button>
        </header>

        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by action or email"
          className="mb-4 w-full rounded-lg border border-line bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:border-accent focus:outline-none"
        />

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
            <i className="bi bi-list-columns text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">No audit entries</p>
            <p className="mt-1 text-xs text-subtle">Log in, register, or apply to an internship — entries appear here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
            {visible.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                <i className={`bi ${iconFor(l.action)} ${toneFor(l.action)}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${toneFor(l.action)}`}>{l.action}</p>
                  <p className="truncate text-xs text-subtle">
                    {l.user?.email || 'deleted user'}
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
