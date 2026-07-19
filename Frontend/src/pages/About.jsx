import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/layout/AnimatedBackground';

const PILLARS = [
  {
    icon: 'bi-bullseye',
    title: 'Our mission',
    text: 'Remove the friction between studying and getting hired — structured pipelines instead of scattered Telegram posts.',
  },
  {
    icon: 'bi-eye',
    title: 'Our vision',
    text: 'Become the platform Cambodian students actually open when they start looking for an internship.',
  },
  {
    icon: 'bi-flag',
    title: 'Our goal',
    text: 'Match real skills to real openings, and cut the review workload for the companies on the other side.',
  },
];

const TEAM = [
  { name: 'Vibol', role: 'Database Administrator', initials: 'VB' },
  { name: 'Rathanak', role: 'Backend Developer', initials: 'RN' },
  { name: 'Lov Kimtech', role: 'Full-stack Developer', initials: 'LK' },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnimatedBackground />
      <Header />

      <main className="flex-1">
        <section className="border-b border-line bg-raised/70 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
              Our story
            </span>
            <h1 className="mt-2 text-4xl font-black tracking-tight text-content sm:text-5xl">
              About <span className="text-accent">Internship Finder</span>
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">
              We connect students with companies offering real internships. Students build a CV,
              browse and apply to listings, and track their applications. Companies post listings
              and review applicants — without either side losing track of the other.
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Overview + metrics */}
          <div className="grid gap-8 md:grid-cols-3 md:items-start">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-black tracking-tight text-content">
                Bridging the gap between ambition and opportunity
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-subtle">
                Finding an internship in Cambodia usually means scrolling social media, asking
                around, and emailing the same CV over and over with no idea whether anyone read it.
                Internship Finder replaces that with one place: a CV that lives with your account,
                listings you can actually filter, and a status you can check instead of guessing.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-subtle">
                On the other side, companies get applicants with structured CVs they can read
                in-app, and a dashboard that tells them which listing is working.
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-raised p-6">
              <p className="text-[11px] font-bold uppercase tracking-wider text-accent">
                Quick metrics
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-2xl font-black text-content">100%</p>
                  <p className="text-[11px] uppercase tracking-wide text-faint">
                    Vetted organizations
                  </p>
                </div>
                <div className="border-t border-line pt-4">
                  <p className="text-2xl font-black text-accent">Cambodia</p>
                  <p className="text-[11px] uppercase tracking-wide text-faint">
                    Primary talent hub
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillars */}
          <section className="mt-20">
            <h2 className="text-2xl font-black tracking-tight text-content">
              Foundational pillars
            </h2>
            <p className="mt-1 text-xs text-subtle">The principles behind the platform.</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PILLARS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-line bg-raised p-6 transition-colors hover:border-accent/40"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                    <i className={`bi ${p.icon} text-lg`} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-content">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-subtle">{p.text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Team */}
          <section className="mt-20">
            <h2 className="text-2xl font-black tracking-tight text-content">Our team</h2>
            <p className="mt-1 text-xs text-subtle">
              A CADT Gen11 cross-disciplinary project team.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TEAM.map((m) => (
                <div
                  key={m.name}
                  className="group rounded-2xl border border-line bg-raised p-6 text-center transition-colors hover:border-accent/40"
                >
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-soft text-sm font-black tracking-wider text-accent transition-transform duration-300 group-hover:scale-105">
                    {m.initials}
                  </div>
                  <h4 className="mt-4 text-sm font-bold text-content">{m.name}</h4>
                  <p className="mt-0.5 text-[11px] font-medium text-subtle">{m.role}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
