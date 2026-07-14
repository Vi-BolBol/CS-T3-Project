import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useLogout from '../../hooks/useLogout';
import CompanyNavbar from '../../components/layout/CompanyNavbar';
import Footer from '../../components/layout/CompanyFooter';
import ThemeToggle from '../../components/shared/ThemeToggle';
import Toast from '../../components/shared/Toast';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import useToast from '../../hooks/useToast';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: 'bi-palette' },
  { id: 'account', label: 'Account', icon: 'bi-person-gear' },
  { id: 'security', label: 'Security', icon: 'bi-shield-lock' },
];

const inputCls =
  'w-full rounded-lg border border-line bg-muted px-3 py-2 text-sm text-content placeholder:text-faint focus:border-accent focus:outline-none';

function Panel({ title, description, children }) {
  return (
    <section className="rounded-xl border border-line bg-raised p-5">
      <h2 className="text-sm font-bold text-content">{title}</h2>
      {description && <p className="mt-0.5 text-xs text-subtle">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function CompanySetting() {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = SECTIONS.some((s) => s.id === searchParams.get('s')) ? searchParams.get('s') : 'appearance';

  const { message: toastMessage, showToast, clearToast } = useToast();
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [confirmLogout, setConfirmLogout] = useState(false);
  const account = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const changePassword = (e) => {
    e.preventDefault();
    if (!pw.current || !pw.next) return showToast('Fill in both password fields.');
    if (pw.next.length < 8) return showToast('New password must be at least 8 characters.');
    if (pw.next !== pw.confirm) return showToast('New passwords do not match.');
    // TODO(backend): POST /api/auth/change-password — endpoint doesn't exist yet.
    showToast('Password change isn’t wired to the backend yet.');
  };

  const logout = useLogout();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <CompanyNavbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-6">
          <h1 className="text-2xl font-black tracking-tight text-content">Settings</h1>
          <p className="mt-1 text-sm text-subtle">Appearance, account, and security.</p>
        </header>

        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="md:w-56 md:flex-shrink-0">
            <nav className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-raised p-1.5 md:sticky md:top-24 md:flex-col">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSearchParams({ s: s.id })}
                  className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    active === s.id ? 'bg-accent-soft text-accent' : 'text-subtle hover:bg-muted hover:text-content'
                  }`}
                >
                  <i className={`bi ${s.icon}`} /> {s.label}
                </button>
              ))}
              <div className="my-1 hidden h-px bg-line md:block" />
              <button
                onClick={() => setConfirmLogout(true)}
                className="flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-subtle transition-colors hover:bg-muted hover:text-danger"
              >
                <i className="bi bi-box-arrow-right" /> Log out
              </button>
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            {active === 'appearance' && (
              <Panel title="Appearance" description="Choose how Internship Finder looks to you.">
                <ThemeToggle />
              </Panel>
            )}

            {active === 'account' && (
              <Panel title="Account" description="Your sign-in details.">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Email</label>
                  <input value={account.email || ''} disabled className={`${inputCls} cursor-not-allowed opacity-70`} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-subtle">Role</label>
                  <input value={account.role || 'company'} disabled className={`${inputCls} cursor-not-allowed opacity-70`} />
                </div>
              </Panel>
            )}

            {active === 'security' && (
              <Panel title="Security" description="Keep your account protected.">
                <form onSubmit={changePassword} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-subtle">Current password</label>
                    <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} className={inputCls} placeholder="••••••••" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-subtle">New password</label>
                      <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} className={inputCls} placeholder="At least 8 characters" />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-subtle">Confirm new password</label>
                      <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} className={inputCls} />
                    </div>
                  </div>
                  <button type="submit" className="rounded-lg bg-accent px-4 py-2 text-xs font-bold text-accent-ink transition hover:opacity-90">
                    Update password
                  </button>
                </form>
              </Panel>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <Toast message={toastMessage} onClose={clearToast} />
      <ConfirmDialog
        open={confirmLogout}
        title="Log out?"
        message="You'll need to sign in again to manage listings or review applicants."
        confirmLabel="Log out"
        onConfirm={logout}
        onCancel={() => setConfirmLogout(false)}
      />
    </div>
  );
}
