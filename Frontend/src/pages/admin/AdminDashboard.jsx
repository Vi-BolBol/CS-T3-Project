import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import { getStats, getSuspicious } from '../../api/adminApi';

function StatCard({ label, value, icon, tone = 'default' }) {
  return (
    <div className="rounded-xl border border-line bg-raised p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-subtle">{label}</p>
        <i className={`bi ${icon} ${tone === 'warn' ? 'text-warn' : 'text-accent'}`} />
      </div>
      <p className="mt-2 text-2xl font-black text-content">{value ?? '—'}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [flagged, setFlagged] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, f] = await Promise.all([getStats(), getSuspicious()]);
      if (!s.success) setError(s.message);
      else setStats(s.stats);
      if (f.success) setFlagged(f.flagged || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Admin dashboard</h1>
          <p className="mt-1 text-sm text-subtle">Platform overview and accounts worth a look.</p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 animate-pulse rounded-xl border border-line bg-muted" />)}
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="Total users" value={stats?.users} icon="bi-people-fill" />
              <StatCard label="Students" value={stats?.students} icon="bi-mortarboard-fill" />
              <StatCard label="Companies" value={stats?.companies} icon="bi-building-fill" />
              <StatCard label="Suspended" value={stats?.suspended} icon="bi-slash-circle-fill" tone="warn" />
              <StatCard label="Internships" value={stats?.internships} icon="bi-briefcase-fill" />
              <StatCard label="Applications" value={stats?.applications} icon="bi-send-fill" />
              <StatCard label="Admins" value={stats?.admins} icon="bi-shield-lock-fill" />
            </div>

            <section>
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-black text-content">Flagged accounts</h2>
                  <p className="text-xs text-subtle">Suspended accounts, and company accounts missing a profile.</p>
                </div>
                <Link to="/admin/users" className="text-xs font-semibold text-accent hover:underline">
                  Manage users →
                </Link>
              </div>

              {flagged.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line bg-raised py-12 text-center">
                  <i className="bi bi-check-circle text-2xl text-accent" />
                  <p className="mt-2 text-sm font-semibold text-content">Nothing flagged</p>
                  <p className="mt-1 text-xs text-subtle">No suspended or malformed accounts right now.</p>
                </div>
              ) : (
                <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-raised">
                  {flagged.map((u) => (
                    <li key={`${u.id}-${u.reason}`} className="flex items-center justify-between gap-4 px-4 py-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-content">{u.email}</p>
                        <p className="text-xs text-subtle">{u.reason}</p>
                      </div>
                      <span className="flex-shrink-0 rounded-md bg-warn/10 px-2 py-1 text-[11px] font-bold text-warn">
                        {u.role}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
