import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthLayout from './AuthLayout';
import { loginUser } from '../../api/authApi';

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
        navigate(next || home, { replace: true });
        return;
      }

      setError(result.message || 'Login failed. Check your email and password.');
    } catch {
      setError('Could not reach the server. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  const side = (
    <div>
      <h2 className="text-2xl font-black leading-tight tracking-tight text-content">
        Welcome back.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-subtle">
        Pick up exactly where you left off.
      </p>
      <ul className="mt-6 space-y-3">
        {POINTS.map((p) => (
          <li key={p.text} className="flex items-center gap-3 text-xs text-subtle">
            <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
              <i className={`bi ${p.icon}`} />
            </span>
            {p.text}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <AuthLayout side={side}>
      <div className="mb-6">
        <h1 className="text-xl font-black tracking-tight text-content">Log in</h1>
        <p className="mt-1 text-xs text-subtle">
          Don&apos;t have an account?{' '}
          <Link
            to={next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'}
            className="font-bold text-accent hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleLogin} noValidate>
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
      </form>

      <p className="mt-6 text-center text-[11px] text-faint">
        By logging in you agree to the platform&apos;s terms of use.
      </p>
    </AuthLayout>
  );
}
