import { Link } from 'react-router-dom';
import Header from '../../components/layout/Header';

/**
 * Shared shell for /login and /signup so the two pages can't drift apart.
 * Left = brand panel (hidden on mobile), right = form card.
 * The left panel's copy is passed in, which is what lets Signup cross-fade it
 * between the student and company pitches.
 */
export default function AuthLayout({ side, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />

      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 0%, rgb(var(--c-accent) / 0.08) 0%, transparent 70%)',
          }}
        />

        <div className="relative grid w-full max-w-4xl overflow-hidden rounded-2xl border border-line bg-raised shadow-sm md:grid-cols-2">
          {/* Brand panel */}
          <aside className="relative hidden flex-col justify-between border-r border-line bg-surface p-8 md:flex">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(80% 60% at 0% 0%, rgb(var(--c-accent) / 0.10) 0%, transparent 70%)',
              }}
            />
            <div className="relative">
              <Link to="/" className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-xs font-black text-accent-ink">
                  IF
                </span>
                <span className="text-sm font-black text-content">Internship Finder</span>
              </Link>
            </div>

            <div className="relative">{side}</div>

            <p className="relative text-[11px] text-faint">
              A CADT Gen11 cross-disciplinary project.
            </p>
          </aside>

          {/* Form panel */}
          <section className="p-6 sm:p-8">{children}</section>
        </div>
      </main>
    </div>
  );
}
