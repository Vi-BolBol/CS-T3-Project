import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import AnimatedBackground from '../components/layout/AnimatedBackground';
import StudentNavbar from '../components/layout/StudentNavbar';
import StudentFooter from '../components/layout/StudentFooter';

/*
  404, rendered in the shell that matches whoever hit it.

  It used to always render the public header — so a signed-in student who
  mistyped a URL was handed the signed-out navigation, and "Back home" took them
  to the marketing homepage with a "Go to dashboard" button. That is a dead end
  dressed up as a link: the student is already signed in, and the page is telling
  them to sign in again.

  Now the destinations follow the role: a student goes to their own home and
  their own internship browser, a company to its dashboard, an admin to theirs.
*/

const readRole = () => {
  try { return JSON.parse(localStorage.getItem('user') || 'null')?.role || null; }
  catch { return null; }
};

const DESTINATIONS = {
  student: { home: '/user/home',      browse: '/user/internships', browseLabel: 'Explore internships' },
  company: { home: '/company/home',   browse: '/company/explore',  browseLabel: 'Explore' },
  admin:   { home: '/admin',          browse: '/admin/users',      browseLabel: 'Manage users' },
  null:    { home: '/',               browse: '/explore',          browseLabel: 'Browse internships' },
};

export default function NotFound() {
  const role = readRole();
  const dest = DESTINATIONS[role] || DESTINATIONS.null;

  const isStudent = role === 'student';
  // Company and admin pages supply their own shells elsewhere; this route sits
  // outside them, so only the student shell is rendered here. Everyone else
  // gets a bare page rather than the misleading signed-out header.
  const showPublicShell = !role;

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      {showPublicShell && <AnimatedBackground />}
      {showPublicShell && <Header />}
      {isStudent && <StudentNavbar />}

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
            to={dest.home}
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-ink transition hover:brightness-95"
          >
            <i className="bi bi-house" /> Back home
          </Link>
          <Link
            to={dest.browse}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-raised px-6 py-3 text-sm font-semibold text-content transition hover:bg-muted"
          >
            {dest.browseLabel}
          </Link>
        </div>
      </main>

      {showPublicShell && <Footer />}
      {isStudent && <StudentFooter />}
    </div>
  );
}
