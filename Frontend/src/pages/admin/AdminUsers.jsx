import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminNavbar from '../../components/layout/AdminNavbar';
import Toast from '../../components/shared/Toast';
import SuspendUserDialog from '../../components/admin/SuspendUserDialog';
import DeleteUserDialog from '../../components/admin/DeleteUserDialog';
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
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [busy, setBusy] = useState(false);
  const { message: toastMessage, showToast, clearToast } = useToast();
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setLoading(true);
    const q = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
    const res = await getUsers(q);
    if (res.success) { setUsers(res.users || []); setError(null); }
    else setError(res.message);
    setLoading(false);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  // Reactivating needs no extra input; suspending goes through the dialog so a
  // reason and duration are always captured.
  const reactivate = async (user) => {
    const res = await setUserStatus(user.id, 'active');
    showToast(res.success ? `${user.email} reactivated` : res.message);
    if (res.success) load();
  };

  const doSuspend = async ({ reason, days }) => {
    setBusy(true);
    const res = await setUserStatus(suspendTarget.id, 'suspended', { reason, days });
    setBusy(false);
    showToast(res.message);
    if (res.success) { setSuspendTarget(null); load(); }
  };

  const doDelete = async ({ reason }) => {
    setBusy(true);
    const res = await deleteUser(deleteTarget.id, { reason });
    setBusy(false);
    if (res.success) {
      showToast(
        res.tombstoned
          ? `${deleteTarget.email} deleted. ${res.tombstoned} application(s) marked as removed.`
          : `${deleteTarget.email} deleted.`
      );
      setDeleteTarget(null);
      load();
    } else {
      showToast(res.message);
    }
  };

  const selectCls = 'rounded-lg border border-line bg-muted px-3 py-2 text-xs text-content focus:border-accent focus:outline-none';

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AdminNavbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Users</h1>
          <p className="mt-1 text-sm text-subtle">Click any row to inspect an account\u2019s activity before acting on it.</p>
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
                    <tr
                      key={u.id}
                      onClick={() => navigate(`/admin/users/${u.id}`)}
                      className="cursor-pointer transition hover:bg-muted/40"
                    >
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
                      {/* stopPropagation everywhere: the row itself navigates to the
                          detail page, and an action button must not do both. */}
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          <Link
                            to={`/admin/users/${u.id}`}
                            className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle transition hover:text-accent"
                            title="View this account's activity and content"
                          >
                            <i className="bi bi-clock-history" /> Activity
                          </Link>

                          {isAdmin ? (
                            <span className="px-1 text-xs text-faint">Protected</span>
                          ) : (
                            <>
                              {u.status === 'suspended' ? (
                                <button onClick={() => reactivate(u)}
                                  className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle hover:text-accent">
                                  Reactivate
                                </button>
                              ) : (
                                <button onClick={() => setSuspendTarget(u)}
                                  className="rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-subtle hover:text-warn">
                                  Suspend
                                </button>
                              )}
                              <button onClick={() => setDeleteTarget(u)}
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
      <SuspendUserDialog
        open={Boolean(suspendTarget)}
        user={suspendTarget}
        busy={busy}
        onConfirm={doSuspend}
        onCancel={() => setSuspendTarget(null)}
      />
      <DeleteUserDialog
        open={Boolean(deleteTarget)}
        user={deleteTarget}
        busy={busy}
        onConfirm={doDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
