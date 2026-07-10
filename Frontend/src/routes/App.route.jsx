import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import BrowseCompanies from "../pages/company/BrowseCompanies";
import CompanyDetailPublic from "../pages/company/CompanyDetailPublic";
import CompanyHome from "../pages/company/CompanyHome";
import CompanyDashboard from "../pages/company/CompanyDashboard";
import CompanyProfile from "../pages/company/CompanyProfile";
import CompanySetting from "../pages/company/CompanySetting";
import CreateSetting from "../pages/company/CreateSetting";
import CreateInternship from "../pages/company/CreateInternship";
import ApplicantCVReview from "../pages/company/ApplicantCVReview";

import UserHome from "../pages/user/UserHome";
import UserProfile from "../pages/user/UserProfile";
import UserSetting from "../pages/user/UserSetting";
import UserApplication from "../pages/user/UserApplication";
import Pipeline from "../pages/user/Pipeline";
import ViewDetail from "../pages/user/ViewDetail";

import StudentNavbar from "../components/layout/StudentNavbar";
import StudentFooter from "../components/layout/StudentFooter";
import { CVBuilderProvider } from "../context/CVBuilderContext";
import CVChoice from "../pages/CV/CVChoice";
import CVUploadReview from "../pages/CV/CVUploadReview";
import CVDashboard from "../pages/CV/CVDashboard";
import CVStep1Photo from "../pages/CV/CVStep1Photo";
import CVStep2Personal from "../pages/CV/CVStep2Personal";
import CVStep3About from "../pages/CV/CVStep3About";
import CVStep4Experience from "../pages/CV/CVStep4Experience";
import CVStep5Preview from "../pages/CV/CVStep5Preview";

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

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/company" element={<BrowseCompanies />} />
        <Route path="/company/:id" element={<CompanyDetailPublic />} />

        <Route path="/company/home" element={<CompanyHome />} />
        <Route path="/company/dashboard" element={<CompanyDashboard />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
        <Route path="/company/settings" element={<CompanySetting />} />
        <Route path="/company/create-wizard" element={<CreateSetting />} />
        <Route path="/company/create-internship" element={<CreateInternship />} />
        <Route path="/company/applicant/:applicantId/cv" element={<ApplicantCVReview />} />

        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/settings" element={<UserSetting />} />
        <Route path="/user/applications" element={<UserApplication />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/view-detail" element={<ViewDetail />} />

        <Route path="/cv/*" element={<CVBuilderRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}