import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";
import NotFound from "../pages/NotFound";

import Login from "../pages/auth/Login.auth";
import Signup from "../pages/auth/signup.auth";

import Company from "../pages/company/company";
import CompanyDetail from "../pages/company/companyDetail";

import UserHome from "../pages/user/UserHome";
import UserProfile from "../pages/user/UserProfile";
import UserSetting from "../pages/user/UserSetting";
import UserApplication from "../pages/user/UserApplication";

import CVChoice from "../pages/CV/CVChoice";
import CVMarker from "../pages/CV/CVMarker";
import CSPreview from "../pages/CV/CSPreview";

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/company" element={<Company />} />
        <Route path="/company/:id" element={<CompanyDetail />} />

        <Route path="/user/home" element={<UserHome />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/settings" element={<UserSetting />} />
        <Route path="/user/applications" element={<UserApplication />} />

        <Route path="/cv-choice" element={<CVChoice />} />
        <Route path="/cv-maker" element={<CVMarker />} />
        <Route path="/cv-preview" element={<CSPreview />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}