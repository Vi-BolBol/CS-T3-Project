import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Soft accent wash — token-based so it inverts with the theme. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(60% 60% at 50% 0%, rgb(var(--c-accent) / 0.10) 0%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
          <i className="bi bi-stars" /> Built for students in Cambodia
        </span>

        <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-content sm:text-5xl lg:text-6xl">
          Launch your career with the{' '}
          <span className="text-accent">right internship</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-relaxed text-subtle sm:text-base">
          Build a CV, browse verified listings, apply in one click, and track every
          application — all in one platform.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink shadow-sm shadow-accent/20 transition hover:brightness-95"
          >
            Create your account <i className="bi bi-arrow-right" />
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-raised px-6 py-3 text-sm font-semibold text-content transition hover:bg-muted"
          >
            <i className="bi bi-search" /> Browse internships
          </Link>
        </div>

        <p className="mt-6 text-xs text-faint">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
