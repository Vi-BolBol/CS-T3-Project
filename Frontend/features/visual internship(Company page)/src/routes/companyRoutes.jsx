import CompanyHome from '../Pages/CompanyHome';
import CompanyDashboard from '../Pages/CompanyDashboard';
import CompanyProfile from '../Pages/CompanyProfile';
import CompanySetting from '../Pages/CompanySetting';
import CreateSetting from '../Pages/CreateSetting';

const routes = {
  '/': CompanyHome,
  '/company-home': CompanyHome,
  '/company-dashboard': CompanyDashboard,
  '/company-profile': CompanyProfile,
  '/company-settings': CompanySetting,
  '/create-wizard': CreateSetting
};

export function getCompanyRoute(pathname) {
  return routes[pathname] || CompanyHome;
}

export default routes;
