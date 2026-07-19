import { useState, useEffect, useCallback } from 'react';
import AdminNavbar from '../../components/layout/AdminNavbar';
import Toast from '../../components/shared/Toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import useToast from '../../hooks/useToast';
import { getUsers, setUserStatus, deleteUser } from '../../api/adminApi';

const STATUS_STYLE = {
  active: 'bg-accent-soft text-accent',
  suspended: 'bg-danger/10 text-danger',
  inactive: 'bg-muted text-subtle',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ role: '', status: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const { message: toastMessage, showToast, clearToast } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    const q = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const res = await getUsers(q);
    if (res.success) { setUsers(res.users || []); setError(null); }
    else setError(res.message);
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const changeStatus = async (user, status) => {
    const res = await setUserStatus(user.id, status);
    showToast(res.success ? `${user.email} → ${status}` : res.message);
    if (res.success) load();
  };

  const doDelete = async () => {
    const res = await deleteUser(confirm.id);
    showToast(res.success ? `${confirm.email} deleted` : res.message);
    setConfirm(null);
    if (res.success) load();
  };

  const selectCls = 'rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Users</h1>
          <p className="mt-1 text-sm text-subtle">Suspend, reactivate, or remove accounts.</p>
        </header>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search by email"
            className={`${selectCls} flex-1 min-w-[200px]`}
          />
          <select value={filters.role} onChange={(e) => setFilters({ ...filters, role: e.target.value })} className={selectCls}>
            <option value="">All roles</option>
            <option value="student">Student</option>
            <option value="company">Company</option>
            <option value="admin">Admin</option>
          </select>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })} className={selectCls}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger">{error}</div>
        )}

        {loading ? (
          <div className="h-64 animate-pulse rounded-xl border border-line bg-muted" />
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-raised py-16 text-center">
            <i className="bi bi-people text-3xl text-faint" />
            <p className="mt-3 text-sm font-semibold text-content">No users match</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-line bg-raised">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-faint">
                <tr>
                  <th className="px-4 py-3 font-bold">User</th>
                  <th className="px-4 py-3 font-bold">Role</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                  <th className="px-4 py-3 font-bold">Joined</th>
                  <th className="px-4 py-3 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {users.map((u) => {
                  const name = u.studentProfile?.fullName || u.companyProfile?.companyName;
                  const isAdmin = u.role === 'admin';
                  return (
                    <tr key={u.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-content">{name || u.email}</p>
                        {name && <p className="text-xs text-subtle">{u.email}</p>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-subtle">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_STYLE[u.status] || STATUS_STYLE.inactive}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-subtle">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          {isAdmin ? (
                            <span className="text-xs text-faint">Protected</span>
                          ) : (
                            <>
                              {u.status === 'suspended' ? (
                                <button onClick={() => changeStatus(u, 'active')}
                                  className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle hover:text-accent">
                                  Reactivate
                                </button>
                              ) : (
                                <button onClick={() => changeStatus(u, 'suspended')}
                                  className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle hover:text-warn">
                                  Suspend
                                </button>
                              )}
                              <button onClick={() => setConfirm(u)}
                                className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle hover:text-danger">
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Toast message={toastMessage} onClose={clearToast} />
      <ConfirmDialog
        open={Boolean(confirm)}
        title="Delete this user?"
        message={confirm ? `This permanently deletes ${confirm.email} and cascades to their applications, CVs, and listings. This cannot be undone.` : ''}
        confirmLabel="Delete"
        onConfirm={doDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
