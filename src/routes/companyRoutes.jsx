import CompanyHome from '../Pages/CompanyHome';
import CompanyDashboard from '../Pages/CompanyDashboard';
import CompanyProfile from '../Pages/CompanyProfile';
import CompanySetting from '../Pages/CompanySetting';
import CreateInternship from '../Pages/CreateInternship';

const routes = {
  '/': CompanyHome,
  '/company-home': CompanyHome,
  '/company-dashboard': CompanyDashboard,
  '/company-profile': CompanyProfile,
  '/company-settings': CompanySetting,
  '/create-wizard': CreateInternship
};

export function getCompanyRoute(pathname) {
  return routes[pathname] || CompanyHome;
}

export default routes;