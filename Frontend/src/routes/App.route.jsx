import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Explore from "../pages/Explore";
import InternshipDetail from "../pages/InternshipDetail";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login.auth";
import Signup from "../pages/auth/signup.auth";

import CompanyHome from "../pages/company/CompanyHome";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanySetting from "../pages/company/CompanySetting";
import CompanyInternships from "../pages/company/CompanyInternships";
import CompanySearch from "../pages/company/CompanySearch";
import CreateInternship from "../pages/company/CreateInternship";
import ApplicantCVReview from "../pages/company/ApplicantCVReview";

import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAuditLogs from "../pages/admin/AdminAuditLogs";

import UserHome from "../pages/user/UserHome";
import BrowseInternships from "../pages/user/BrowseInternships";
import UserProfile from "../pages/user/UserProfile";
import UserSetting from "../pages/user/UserSetting";
import UserApplication from "../pages/user/UserApplication";

import StudentNavbar from "../components/layout/StudentNavbar";
import StudentFooter from "../components/layout/StudentFooter";
import RequireRole from "../components/shared/RequireRole";
import { CVBuilderProvider } from "../context/CVBuilderContext";
import CVChoice from "../pages/cv/CVChoice";
import CVUploadReview from "../pages/cv/CVUploadReview";
import CVDashboard from "../pages/cv/CVDashboard";
import CVStep1Photo from "../pages/cv/CVStep1Photo";
import CVStep2Personal from "../pages/cv/CVStep2Personal";
import CVStep3About from "../pages/cv/CVStep3About";
import CVStep4Experience from "../pages/cv/CVStep4Experience";
import CVStep5Preview from "../pages/cv/CVStep5Preview";

/* ---------- Legacy redirects ---------- */
function LegacyCompany() {
  const { id } = useParams();
  return <Navigate to={`/explore?type=companies&company=${id}`} replace />;
}
/* /view-detail?id= used to be a whole separate page that ALWAYS rendered the
   student shell — including for company users who reached it from their own
   navbar search. Details now open in a pane, so this is a redirect: students go
   to their own page, everyone else to the public one. */
function LegacyViewDetail() {
  const [params] = useSearchParams();
  const id = params.get("id");
  let role = null;
  try { role = JSON.parse(localStorage.getItem("user") || "null")?.role || null; } catch { /* malformed */ }

  const base = role === "student" ? "/user/internships" : "/explore";
  return <Navigate to={id ? `${base}?job=${id}` : base} replace />;
}

function CVBuilderRoutes() {
  return (
    <CVBuilderProvider>
      <StudentNavbar />
      <Routes>
        <Route path="/" element={<CVChoice />} />
        <Route path="/upload-review" element={<CVUploadReview />} />
        <Route path="/manage" element={<CVDashboard />} />
        <Route path="/step1" element={<CVStep1Photo />} />
        <Route path="/step2" element={<CVStep2Personal />} />
        <Route path="/step3" element={<CVStep3About />} />
        <Route path="/step4" element={<CVStep4Experience />} />
        <Route path="/step5" element={<CVStep5Preview />} />
      </Routes>
      <StudentFooter />
    </CVBuilderProvider>
  );
}

const student = (el) => <RequireRole roles={["student"]}>{el}</RequireRole>;
const company = (el) => <RequireRole roles={["company"]}>{el}</RequireRole>;
const admin   = (el) => <RequireRole roles={["admin"]}>{el}</RequireRole>;

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ---------- Public (no auth) ---------- */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Old public URLs -> the single Explore page */}
        <Route path="/internships" element={<Navigate to="/explore?type=internships" replace />} />
        <Route path="/companies" element={<Navigate to="/explore?type=companies" replace />} />
        {/* Full listing page. The Explore pane is a summary; this is the whole thing.
            Public route — it renders the student shell if a student opens it. */}
        <Route path="/internships/:id" element={<InternshipDetail />} />
        <Route path="/companies/:id" element={<LegacyCompany />} />
        <Route path="/view-detail" element={<LegacyViewDetail />} />

        {/* ---------- Student ---------- */}
        <Route path="/user/home" element={student(<UserHome />)} />
        <Route path="/user/internships" element={student(<BrowseInternships />)} />
        <Route path="/user/browse" element={<Navigate to="/user/internships" replace />} />
        <Route path="/user/profile" element={student(<UserProfile />)} />
        {/* Read-only view of a student profile. Companies reach this from an
            applicant row and admins from the user table, so it can't be
            student-only — that would bounce a company reviewing an applicant
            straight back to its own dashboard. */}
        <Route
          path="/user/profile/:id"
          element={<RequireRole roles={["student", "company", "admin"]}><UserProfile /></RequireRole>}
        />
        <Route path="/user/settings" element={student(<UserSetting />)} />
        <Route path="/user/applications" element={student(<UserApplication />)} />
        <Route path="/cv/*" element={student(<CVBuilderRoutes />)} />

        {/* ---------- Company ----------
            NOTE: these must be declared before any /company/:id style route, and
            the public company detail now lives on /explore, so there is no
            dynamic /company/:id left to collide with /company/home. */}
        <Route path="/company" element={<Navigate to="/explore?type=companies" replace />} />
        <Route path="/company/home" element={company(<CompanyHome />)} />
        <Route path="/company/dashboard" element={company(<CompanyDashboard />)} />
        <Route path="/company/profile" element={company(<CompanyProfile />)} />
        <Route path="/company/settings" element={company(<CompanySetting />)} />
        <Route path="/company/internships" element={company(<CompanyInternships />)} />
        <Route path="/company/search" element={company(<CompanySearch />)} />
        <Route path="/company/create-internship" element={company(<CreateInternship />)} />
        <Route path="/company/applicant/:applicantId/cv" element={company(<ApplicantCVReview />)} />

        {/* ---------- Admin ---------- */}
        <Route path="/admin" element={admin(<AdminDashboard />)} />
        <Route path="/admin/users" element={admin(<AdminUsers />)} />
        <Route path="/admin/audit" element={admin(<AdminAuditLogs />)} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
