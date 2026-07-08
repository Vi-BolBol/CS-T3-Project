import { BrowserRouter, Routes, Route } from "react-router-dom";

import NotFound from "../pages/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import { publicRoutes, companyRoutes, studentRoutes } from "./routes.config";

import StudentNavbar from "../components/layout/StudentNavbar";
import StudentFooter from "../components/layout/StudentFooter";
import { CVBuilderProvider } from "../context/CVBuilderContext";
import CVChoice from "../pages/cv/CVChoice";
import CVUploadReview from "../pages/cv/CVUploadReview";
import CVDashboard from "../pages/cv/CVDashboard";
import CVStep1Photo from "../pages/cv/CVStep1Photo";
import CVStep2Personal from "../pages/cv/CVStep2Personal";
import CVStep3About from "../pages/cv/CVStep3About";
import CVStep4Experience from "../pages/cv/CVStep4Experience";
import CVStep5Preview from "../pages/cv/CVStep5Preview";

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
        {[...publicRoutes, ...companyRoutes, ...studentRoutes].map(({ path, element, role }) => (
          <Route key={path} path={path} element={<ProtectedRoute role={role}>{element}</ProtectedRoute>} />
        ))}

        <Route path="/cv/*" element={<CVBuilderRoutes />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}