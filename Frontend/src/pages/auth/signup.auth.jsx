import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthLayout from './AuthLayout';
import { registerUser } from '../../api/authApi';

/**
 * Everything that differs between the two account types lives here, so the
 * form below stays one form and the switch is purely presentational.
 * Note `admin` is deliberately absent — the backend rejects role:"admin" on
 * /api/auth/register by design (admins are promoted via CLI).
 */
const ROLES = {
  student: {
    key: 'student',
    label: 'Student',
    icon: 'bi-mortarboard',
    nameLabel: 'Full name',
    namePlaceholder: 'Sok Dara',
    // The backend reads `fullName` for students and `companyName` for companies.
    // Sending a generic `name` silently saves NULL — that was the Round-3 bug.
    nameField: 'fullName',
    cta: 'Create student account',
    home: '/user/home',
    headline: 'Find an internship worth your time.',
    blurb: 'Build a CV, apply in one click, and track every application in one place.',
    points: [
      { icon: 'bi-file-earmark-person', text: 'Guided CV builder, or upload a PDF' },
      { icon: 'bi-stars', text: 'AI scoring with concrete feedback' },
      { icon: 'bi-kanban', text: 'Every application, one dashboard' },
    ],
  },
  company: {
    key: 'company',
    label: 'Company',
    icon: 'bi-building',
    nameLabel: 'Company name',
    namePlaceholder: 'TechNova Co., Ltd.',
    nameField: 'companyName',
    cta: 'Create company account',
    home: '/company/home',
    headline: 'Hire the interns who actually applied.',
    blurb: 'Post a listing, read CVs inline, and decide without leaving the page.',
    points: [
      { icon: 'bi-megaphone', text: 'Five-step listing wizard' },
      { icon: 'bi-people', text: 'Applicant CVs reviewed in-app' },
      { icon: 'bi-graph-up-arrow', text: 'Applications-per-listing analytics' },
    ],
  },
};

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  // Deep link: /signup?role=company lands straight on the company side.
  const initialRole = params.get('role') === 'company' ? 'company' : 'student';

  // ?next= comes from the apply-gate. Same-site paths only (no open-redirect).
  const rawNext = params.get('next');
  const next = rawNext && rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;

  const [role, setRole] = useState(initialRole);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const cfg = ROLES[role];
  const isCompany = role === 'company';

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError(`${cfg.nameLabel} is required.`);
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerUser({
        email: formData.email.trim(),
        password: formData.password,
        role,
        [cfg.nameField]: formData.name.trim(),
      });

      if (res.success) {
        // THE BUG: this used to be `if (res.token) setItem(...)`, and register
        // returned no token — so on a machine that had logged in before, the new
        // `user` was written over the OLD token and every request authenticated
        // as the previous account. Register now issues a token; we clear first
        // and refuse to proceed without one.
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (!res.token || !res.user) {
          setError('Account created, but no session was returned. Please log in.');
          navigate('/login', { replace: true });
          return;
        }

        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        // A company that followed a "log in to apply" link still belongs on its
        // own dashboard — `next` only makes sense for the student who wanted it.
        navigate(next && role === 'student' ? next : cfg.home, { replace: true });
        return;
      }

      setError(res.message || 'Account creation failed.');
    } catch {
      setError('Could not reach the server. Is the backend running on port 3000?');
    } finally {
      setLoading(false);
    }
  };

  /* Brand panel — both variants stay mounted and cross-fade, so the switch
     reads as one continuous motion rather than a flash of empty space. */
  const side = (
    <div className="relative min-h-[240px]">
      {Object.values(ROLES).map((r) => (
        <div
          key={r.key}
          aria-hidden={r.key !== role}
          className={`absolute inset-0 transition-all duration-300 ease-out ${
            r.key === role
              ? 'translate-y-0 opacity-100'
              : 'pointer-events-none -translate-y-2 opacity-0'
          }`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
            <i className={`bi ${r.icon}`} /> {r.label}
          </span>
          <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-content">
            {r.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-subtle">{r.blurb}</p>
          <ul className="mt-6 space-y-3">
            {r.points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-xs text-subtle">
                <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                  <i className={`bi ${p.icon}`} />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <AuthLayout side={side}>
      <div className="mb-5">
        <h1 className="text-xl font-black tracking-tight text-content">Create your account</h1>
        <p className="mt-1 text-xs text-subtle">
          Already have one?{' '}
          <Link
            to={next ? `/login?next=${encodeURIComponent(next)}` : '/login'}
            className="font-bold text-accent hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      {/* Animated role switch — the pill slides, the labels invert. */}
      <div
        role="tablist"
        aria-label="Account type"
        className="relative mb-5 flex rounded-xl border border-line bg-muted p-1"
      >
        <span
          aria-hidden="true"
          className={`absolute bottom-1 left-1 top-1 w-[calc(50%-0.25rem)] rounded-lg bg-accent shadow-sm transition-transform duration-300 ease-out ${
            isCompany ? 'translate-x-full' : 'translate-x-0'
          }`}
        />
        {Object.values(ROLES).map((r) => (
          <button
            key={r.key}
            type="button"
            role="tab"
            aria-selected={role === r.key}
            onClick={() => {
              setRole(r.key);
              setError('');
            }}
            className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-colors duration-200 ${
              role === r.key ? 'text-accent-ink' : 'text-subtle hover:text-content'
            }`}
          >
            <i className={`bi ${r.icon}`} />
            {r.label}
          </button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={handleSignup} noValidate>
        {/* Keyed on role: remounting replays the swap animation on switch. */}
        <div key={role} className="if-swap">
          <Input
            label={cfg.nameLabel}
            type="text"
            autoComplete={isCompany ? 'organization' : 'name'}
            placeholder={cfg.namePlaceholder}
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </div>

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder={isCompany ? 'hr@company.com' : 'you@example.com'}
          value={formData.email}
          onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
          required
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="signup-password"
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
            id="signup-password"
            type={showPw ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={formData.password}
            onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
            required
            className="w-full rounded-xl border border-line bg-muted px-4 py-2.5 text-sm text-content outline-none transition placeholder:text-faint focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-[11px] text-faint">
            Minimum 8 characters — the backend enforces this too.
          </p>
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
              <i className="bi bi-arrow-repeat animate-spin" /> Creating account…
            </>
          ) : (
            cfg.cta
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-[11px] text-faint">
        Administrator accounts can&apos;t be self-registered.
      </p>
    </AuthLayout>
  );
}
