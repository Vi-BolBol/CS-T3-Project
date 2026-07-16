import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/layout/AnimatedBackground';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <AnimatedBackground />
      <Header />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="text-7xl font-black tracking-tight text-accent sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-black tracking-tight text-content sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 max-w-sm text-sm text-subtle">
          The page you&apos;re looking for doesn&apos;t exist, or it moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink transition hover:brightness-95"
          >
            <i className="bi bi-house" /> Back home
          </Link>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-raised px-6 py-3 text-sm font-semibold text-content transition hover:bg-muted"
          >
            Browse internships
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
