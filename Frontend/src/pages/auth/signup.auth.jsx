import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import RolePitch from './RolePitch';
import SocialSignIn from '../../components/auth/SocialSignIn';
import { registerUser } from '../../api/authApi';
import useToast from '../../hooks/useToast';
import Toast from '../../components/shared/Toast';
import {
  requestNotificationPermission,
  showRegistrationNotification,
} from '../../services/browserNotificationService';

/**
 * Everything that differs between the two account types lives here, so the form
 * below stays ONE form and the switch is purely presentational.
 *
 * `admin` is deliberately absent — the backend rejects role:"admin" on
 * /api/auth/register by design (admins are promoted via CLI).
 */
const ROLES = {
  student: {
    key: 'student',
    label: 'Student',
    icon: 'bi-mortarboard',
    nameLabel: 'Full name',
    namePlaceholder: 'Sok Dara',
    emailPlaceholder: 'you@example.com',
    // The backend reads `fullName` for students and `companyName` for companies.
    // Sending a generic `name` silently saves NULL — that was the Round-3 bug.
    nameField: 'fullName',
    autoComplete: 'name',
    cta: 'Create student account',
    home: '/user/home',
  },
  company: {
    key: 'company',
    label: 'Company',
    icon: 'bi-building',
    nameLabel: 'Company name',
    namePlaceholder: 'TechNova Co., Ltd.',
    emailPlaceholder: 'hr@company.com',
    nameField: 'companyName',
    autoComplete: 'organization',
    cta: 'Create company account',
    home: '/company/home',
  },
};

/* The description beside the form. Narrow — the form is twice its width — so the
   copy is a headline and three proof points, not a marketing wall. Keyed on role
   so switching replays the 280ms fade while the panel slides. */
const PITCH = {
  student: (
    <RolePitch
      key="student"
      eyebrow="Student"
      icon="bi-mortarboard"
      headline="Find an internship worth your time."
      points={[
        { icon: 'bi-file-earmark-person', text: 'Guided CV builder, or upload a PDF' },
        { icon: 'bi-stars', text: 'AI scoring with concrete feedback' },
        { icon: 'bi-kanban', text: 'Every application, one dashboard' },
      ]}
    />
  ),
  company: (
    <RolePitch
      key="company"
      eyebrow="Company"
      icon="bi-building"
      headline="Hire the interns who actually applied."
      points={[
        { icon: 'bi-megaphone', text: 'Five-step listing wizard' },
        { icon: 'bi-people', text: 'Applicant CVs reviewed in-app' },
        { icon: 'bi-graph-up-arrow', text: 'Applications-per-listing analytics' },
      ]}
    />
  ),
};

const inputCls =
  'w-full rounded-lg border border-line bg-muted px-3.5 py-1.5 text-sm text-content outline-none transition placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent';

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Deep link: /signup?role=company lands straight on the company side.
  const [role, setRole] = useState(params.get('role') === 'company' ? 'company' : 'student');

  // ?next= comes from the apply-gate. Same-site paths only (no open-redirect).
  const rawNext = params.get('next');
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { message: toastMessage, showToast, clearToast } = useToast();

  const cfg = ROLES[role];
  const isCompany = role === 'company';
  const set = (k) => (e) => setFormData((p) => ({ ...p, [k]: e.target.value }));

  const mismatch =
    formData.confirm.length > 0 && formData.confirm !== formData.password;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) return setError(`${cfg.nameLabel} is required.`);
    if (formData.password.length < 8) return setError('Password must be at least 8 characters.');
    // Checked here, never sent — `confirm` exists purely to catch a typo before
    // it becomes a password the person can't reproduce.
    if (formData.password !== formData.confirm) return setError('The two passwords don\u2019t match.');

    setLoading(true);
    try {
      const res = await registerUser({
        email: formData.email.trim(),
        password: formData.password,
        role,
        [cfg.nameField]: formData.name.trim(),
      });

      if (res.success) {
        // Register issues a token now. It used to not, and the frontend wrote the
        // new `user` beside the OLD token — which authenticated you as the
        // PREVIOUS account. Clear first, and refuse to proceed without a token.
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!res.token || !res.user) {
          setError('Account created, but no session was returned. Please log in.');
          navigate('/login', { replace: true });
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        const targetPath = next && role === 'student' ? next : cfg.home;

        // Backend has now genuinely confirmed account creation + a session.
        // Ask for permission (no-op if already decided) and try a real
        // system notification before falling back to a toast.
        await requestNotificationPermission();
        const { shown } = await showRegistrationNotification();

        if (shown) {
          navigate(targetPath, { replace: true });
        } else {
          showToast(
            'Account created! Complete your profile to receive better internship recommendations.'
          );
          setTimeout(() => navigate(targetPath, { replace: true }), 1400);
        }
        return;
      }

      setError(res.message || 'Account creation failed.');
    } catch {
      setError('Could not reach the server. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      description={PITCH[role]}
      /* student -> [-1]  description left,  form centre
         company -> [1-]  form centre,       description right
         The form never moves; the description slides across and back. */
      descriptionSide={isCompany ? 'right' : 'left'}
    >
      <div>
        <h1 className="text-lg font-black tracking-tight text-content">Create your account</h1>
        <p className="mt-0.5 text-xs text-subtle">
          {isCompany
            ? 'Post listings and review applicants.'
            : 'Build a CV, apply, and track every application.'}
        </p>
      </div>

      {/* Role switch — the pill slides, and the form panel slides with it. */}
      <div
        role="tablist"
        aria-label="Account type"
        className="relative mt-3 flex rounded-xl border border-line bg-muted p-1"
      >
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-accent shadow-sm transition-transform duration-500 ease-[cubic-bezier(.22,.61,.36,1)] ${
            isCompany ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        {Object.values(ROLES).map((r) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={role === r.key}
            onClick={() => { setRole(r.key); setError(''); }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors duration-200 ${
              role === r.key ? 'text-accent-ink' : 'text-subtle hover:text-content'
            }`}
          >
            <i className={`bi ${r.icon}`} />
            {r.label}
          </button>
        ))}
      </div>

      <form className="mt-3 space-y-2.5" onSubmit={handleSignup} noValidate>
        {/* Keyed on role so the label/placeholder swap replays the 280ms fade. */}
        <div key={role} className="if-swap">
          <label htmlFor="signup-name" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-subtle">
            {cfg.nameLabel}
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete={cfg.autoComplete}
            placeholder={cfg.namePlaceholder}
            value={formData.name}
            onChange={set('name')}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-subtle">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            placeholder={cfg.emailPlaceholder}
            value={formData.email}
            onChange={set('email')}
            required
            className={inputCls}
          />
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label htmlFor="signup-password" className="block text-[11px] font-semibold uppercase tracking-wide text-subtle">
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
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={set('password')}
            required
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="signup-confirm" className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-subtle">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Type it again"
            value={formData.confirm}
            onChange={set('confirm')}
            required
            aria-invalid={mismatch}
            className={`${inputCls} ${mismatch ? '!border-danger' : ''}`}
          />
          {mismatch && (
            <p className="mt-1 text-[11px] font-medium text-danger">
              <i className="bi bi-exclamation-circle mr-1" />
              The two passwords don&apos;t match.
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/10 p-2.5 text-[11px] font-medium text-danger"
          >
            <i className="bi bi-exclamation-triangle-fill mt-px" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || mismatch}
          className="mt-1 w-full rounded-lg bg-accent px-4 py-2 text-sm font-bold text-accent-ink transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <i className="bi bi-arrow-repeat mr-1 inline-block animate-spin" /> Creating account…
            </>
          ) : (
            cfg.cta
          )}
        </button>
        <p className="pt-0.5 text-center text-xs text-subtle">
          Already have an account?{' '}
          <Link
            to={next ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className="font-bold text-accent hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>

      <SocialSignIn action="Sign up" />

      {/* Fallback shown only when a real browser notification couldn't be
          displayed (unsupported browser, denied, etc). */}
      <Toast message={toastMessage} onClose={clearToast} variant="success" />
    </AuthLayout>
  );
}
