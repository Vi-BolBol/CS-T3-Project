import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

import Login from "../pages/auth/Login.auth";
import Signup from "../pages/auth/signup.auth";

import Company from "../pages/company/company";
import CompanyDetail from "../pages/company/companyDetail";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanySetting from "../pages/company/CompanySetting";
import CreateSetting from "../pages/company/CreateSetting";
import CreateInternship from "../pages/company/CreateInternship";

import UserHome from "../pages/user/UserHome";
import UserProfile from "../pages/user/UserProfile";
import UserSetting from "../pages/user/UserSetting";
import UserApplication from "../pages/user/UserApplication";
import Pipeline from "../pages/user/Pipeline";
import ViewDetail from "../pages/user/ViewDetail";

/**
 * Route table as data. Each entry is a plain object so App.route.jsx can
 * just `.map()` over these instead of hand-writing every <Route>.
 * `role` is a placeholder hook for ProtectedRoute — leave null for public
 * routes, or set "student" / "company" once role-gating is wired up.
 */
export const publicRoutes = [
  { path: "/", element: <Home />, role: null },
  { path: "/about", element: <About />, role: null },
  { path: "/contact", element: <Contact />, role: null },
  { path: "/login", element: <Login />, role: null },
  { path: "/signup", element: <Signup />, role: null },
  { path: "/company", element: <Company />, role: null },
  { path: "/company/:id", element: <CompanyDetail />, role: null },
];

export const companyRoutes = [
  { path: "/company/home", element: <CompanyHome />, role: "company" },
  { path: "/company/dashboard", element: <CompanyDashboard />, role: "company" },
  { path: "/company/profile", element: <CompanyProfile />, role: "company" },
  { path: "/company/settings", element: <CompanySetting />, role: "company" },
  { path: "/company/create-wizard", element: <CreateSetting />, role: "company" },
  { path: "/company/create-internship", element: <CreateInternship />, role: "company" },
];

export const studentRoutes = [
  { path: "/user/home", element: <UserHome />, role: "student" },
  { path: "/user/profile", element: <UserProfile />, role: "student" },
  { path: "/user/settings", element: <UserSetting />, role: "student" },
  { path: "/user/applications", element: <UserApplication />, role: "student" },
  { path: "/pipeline", element: <Pipeline />, role: "student" },
  { path: "/view-detail", element: <ViewDetail />, role: "student" },
];

export const allRoutes = [...publicRoutes, ...companyRoutes, ...studentRoutes];