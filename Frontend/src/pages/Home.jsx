import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import HeroSection from '../components/layout/HeroSection';
import Footer from '../components/layout/Footer';

const STATS = [
  { value: '2026', label: 'Established' },
  { value: '94%', label: 'Placement rate' },
  { value: '45+', label: 'Partner companies' },
];

const FEATURES = [
  {
    icon: 'bi-file-earmark-person',
    title: 'CV Builder',
    text: 'Guided step-by-step builder, PDF upload with parsing, and AI scoring with feedback.',
  },
  {
    icon: 'bi-search',
    title: 'Real listings',
    text: 'Filter by location, work environment, internship type, company, and pay range.',
  },
  {
    icon: 'bi-send-check',
    title: 'One-click apply',
    text: 'Your CV is attached automatically. No re-uploading the same file to every company.',
  },
  {
    icon: 'bi-kanban',
    title: 'Track everything',
    text: 'See every application and its status — pending, accepted, rejected — in one view.',
  },
];

const STUDENT_STEPS = [
  { n: '1', title: 'Build your CV', text: 'Fill in the wizard or upload an existing PDF and let it parse itself.' },
  { n: '2', title: 'Find a match', text: 'Search and filter listings until you find one worth your time.' },
  { n: '3', title: 'Apply and track', text: 'Apply in one click, then watch the status change from your dashboard.' },
];

const COMPANY_STEPS = [
  { n: '1', title: 'Create a profile', text: 'Tell students who you are, where you are, and what you build.' },
  { n: '2', title: 'Post a listing', text: 'A five-step wizard walks you through everything a student needs to know.' },
  { n: '3', title: 'Review applicants', text: 'Read CVs inline and accept or reject without leaving the page.' },
];

const TRACKS = [
  { icon: 'bi-code-slash', title: 'Software Engineering', query: 'engineer', desc: 'Frontend, backend, and full-stack roles at growing tech firms.' },
  { icon: 'bi-palette', title: 'Product Design', query: 'design', desc: 'UI/UX and product design roles in creative environments.' },
  { icon: 'bi-graph-up', title: 'Data & Analytics', query: 'data', desc: 'Analyse real datasets and build models that ship.' },
];

const STORIES = [
  {
    quote:
      'I built my CV in the evening and had three applications out before midnight. Two of them replied within a week.',
    author: 'Sokha P.',
    role: 'Frontend Intern',
    meta: 'Started Winter 2025',
  },
  {
    quote:
      'Being able to see every application in one list — instead of digging through my inbox — is the part I actually missed when I stopped using it.',
    author: 'Dara L.',
    role: 'Data Analyst Intern',
    meta: 'Started Fall 2025',
  },
];

function SectionHead({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center">
      {eyebrow && (
        <span className="text-[11px] font-bold uppercase tracking-wider text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-3xl font-black tracking-tight text-content sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-subtle">{subtitle}</p>
      )}
    </div>
  );
}

function Steps({ steps }) {
  return (
    <ol className="mt-6 space-y-4">
      {steps.map((s) => (
        <li key={s.n} className="flex gap-4">
          <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-accent-soft text-sm font-black text-accent">
            {s.n}
          </span>
          <div>
            <h4 className="text-sm font-bold text-content">{s.title}</h4>
            <p className="mt-0.5 text-xs leading-relaxed text-subtle">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Header />
      <HeroSection />

      <main className="flex-1">
        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 divide-y divide-line rounded-2xl border border-line bg-raised shadow-sm sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((s) => (
              <div key={s.label} className="p-6 text-center">
                <p className="text-3xl font-black tracking-tight text-content">{s.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-faint">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="What you get"
            title="Everything in one place"
            subtitle="No spreadsheets, no lost email threads, no re-uploading the same CV five times."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-line bg-raised p-5 transition-colors hover:border-accent/40"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                  <i className={`bi ${f.icon} text-lg`} />
                </span>
                <h3 className="mt-4 text-sm font-bold text-content">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-subtle">{f.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — two audiences */}
        <section className="border-y border-line bg-raised">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHead eyebrow="How it works" title="Two sides, one platform" />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                  <i className="bi bi-mortarboard" /> For students
                </span>
                <Steps steps={STUDENT_STEPS} />
                <Link
                  to="/signup"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  Start as a student <i className="bi bi-arrow-right" />
                </Link>
              </div>

              <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
                <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-subtle">
                  <i className="bi bi-building" /> For companies
                </span>
                <Steps steps={COMPANY_STEPS} />
                <Link
                  to="/signup?role=company"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  Start as a company <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tracks */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Explore"
            title="Find your track"
            subtitle="Roles across the disciplines students at CADT actually study."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {TRACKS.map((t) => (
              <div
                key={t.title}
                className="flex flex-col justify-between rounded-2xl border border-line bg-raised p-6"
              >
                <div>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent">
                    <i className={`bi ${t.icon} text-lg`} />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-content">{t.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-subtle">{t.desc}</p>
                </div>
                <Link
                  to={`/explore?q=${encodeURIComponent(t.query)}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline"
                >
                  View roles <i className="bi bi-arrow-right" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Stories */}
        <section className="border-y border-line bg-raised">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <SectionHead title="Success stories" subtitle="From students who found a role here." />
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {STORIES.map((s) => (
                <figure
                  key={s.author}
                  className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-8"
                >
                  <blockquote>
                    <div className="mb-4 flex gap-0.5 text-accent">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className="bi bi-star-fill text-xs" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed text-subtle">“{s.quote}”</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent-soft text-sm font-black text-accent">
                      {s.author[0]}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-content">{s.author}</p>
                      <p className="text-xs text-accent">{s.role}</p>
                      <p className="text-[11px] text-faint">{s.meta}</p>
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(50% 100% at 50% 100%, rgb(var(--c-accent) / 0.10) 0%, transparent 70%)',
            }}
          />
          <div className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black tracking-tight text-content sm:text-4xl">
              Ready to begin?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-subtle">
              Create an account, build a CV, and send your first application tonight.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink shadow-sm shadow-accent/20 transition hover:brightness-95"
              >
                Create your account <i className="bi bi-arrow-right" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-raised px-6 py-3 text-sm font-semibold text-content transition hover:bg-muted"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
