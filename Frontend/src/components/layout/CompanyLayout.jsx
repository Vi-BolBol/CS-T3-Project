import { Outlet } from 'react-router-dom';
import CompanyNavbar from './CompanyNavbar';
import CompanyFooter from './CompanyFooter';

/*
  One shell for the whole company area.

  Every company page used to render <CompanyNavbar /> itself. Because each page
  is a separate route element, React unmounted and remounted the navbar on every
  single tab change — the search box cleared, the applicant badge refetched from
  scratch, and the bar visibly flickered. It looked like the navigation was
  "changing" between tabs because, functionally, it was a different navbar each
  time.

  Mounting it once here and swapping only <Outlet /> keeps the bar — and its
  state — completely stable across the company section. This mirrors what
  AdminLayout already does for the admin area.
*/
export default function CompanyLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-content selection:bg-accent selection:text-accent-ink">
      <CompanyNavbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <CompanyFooter />
    </div>
  );
}
