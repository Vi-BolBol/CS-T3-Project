import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthLayout from './AuthLayout';
import RolePitch from './RolePitch';
import SocialSignIn from '../../components/auth/SocialSignIn';
import { loginUser } from '../../api/authApi';
import useToast from '../../hooks/useToast';
import Toast from '../../components/shared/Toast';
import {
  requestNotificationPermission,
  showLoginNotification,
} from '../../services/browserNotificationService';

const HOME_FOR = {
  admin: '/admin',
  student: '/user/home',
  company: '/company/home',
};

const POINTS = [
  { icon: 'bi-file-earmark-person', text: 'Your CV, saved and ready to attach' },
  { icon: 'bi-send-check', text: 'Apply in one click' },
  { icon: 'bi-kanban', text: 'Track every application in one view' },
];

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /* Where the apply-gate wants us back. Only same-site paths are honoured —
     accepting an arbitrary `next` would be an open-redirect. */
  const rawNext = params.get('next');
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { message: toastMessage, showToast, clearToast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginUser({
        email: credentials.email.trim(),
        password: credentials.password,
      });

      // Only proceed if the server really returned a session.
      if (result.success && result.token && result.user) {
        // Drop whatever was there first. Writing over a half-stale pair is how
        // you end up authenticated as the previous account.
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));

        const home = HOME_FOR[result.user.role];
        if (!home) {
          setError('This account has an unrecognised role. Contact an administrator.');
          return;
        }
        const targetPath = next || home;

        // Only now — after the backend has actually confirmed the login —
        // do we ask for notification permission (a no-op if the browser
        // already recorded a decision) and try to show a real system
        // notification. Nothing here can throw, and no token/password/
        // personal data is ever put in the notification body.
        await requestNotificationPermission();
        const { shown } = await showLoginNotification();

        if (shown) {
          navigate(targetPath, { replace: true });
        } else {
          // Notifications unsupported / denied / unavailable right now:
          // fall back to a normal in-app toast instead of alert(), and give
          // it a moment on screen before moving to the dashboard.
          showToast('You logged in successfully. Check your recommended internships.');
          setTimeout(() => navigate(targetPath, { replace: true }), 1400);
        }
        return;
      }

      // A suspended account is not a wrong password — say so plainly, with the
      // reason and the return date when the admin supplied them.
      if (result.suspended) {
        const parts = ['Account suspended.'];
        if (result.suspension?.reason) parts.push(`Reason: ${result.suspension.reason}`);
        if (result.suspension?.until) {
          parts.push(
            `Access returns on ${new Date(result.suspension.until).toLocaleDateString(undefined, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}.`
          );
        } else {
          parts.push('Contact an administrator to appeal.');
        }
        setError(parts.join(' '));
      } else {
        setError(result.message || 'Login failed. Check your email and password.');
      }
    } catch {
      setError('Could not reach the server. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  const side = (
    <RolePitch
      eyebrow="Welcome back"
      icon="bi-box-arrow-in-right"
      headline="Pick up where you left off."
      points={POINTS}
    />
  );

  return (
    <AuthLayout description={side} descriptionSide="left">
      <div className="mb-5">
        <h1 className="text-lg font-black tracking-tight text-content">Log in</h1>
        <p className="mt-0.5 text-xs text-subtle">Welcome back to Internship Finder.</p>
      </div>

      <form className="mt-5 space-y-4" onSubmit={handleLogin} noValidate>
        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={credentials.email}
          onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))}
          required
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="block text-[11px] font-semibold uppercase tracking-wide text-subtle"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="text-[11px] font-bold text-accent hover:underline"
            >
              {showPw ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            id="login-password"
            type={showPw ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            value={credentials.password}
            onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
            required
            className="w-full rounded-xl border border-line bg-muted px-4 py-2.5 text-sm text-content outline-none transition placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-xs font-medium text-danger"
          >
            <i className="bi bi-exclamation-triangle-fill mt-px" />
            <span>{error}</span>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <i className="bi bi-arrow-repeat animate-spin" /> Signing in…
            </>
          ) : (
            'Log in'
          )}
        </Button>

        <p className="pt-0.5 text-center text-xs text-subtle">
          Don&apos;t have an account?{' '}
          <Link
            to={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'}
            className="font-bold text-accent hover:underline"
          >
            Create one
          </Link>
        </p>
      </form>

      {/* Circular provider icons at the foot of the form, same as signup. */}
      <SocialSignIn action="Log in" />

      {/* Fallback shown only when a real browser notification couldn't be
          displayed (unsupported browser, denied, etc). */}
      <Toast message={toastMessage} onClose={clearToast} variant="success" />
    </AuthLayout>
  );
}
