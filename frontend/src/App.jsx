import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import SeekerProfile from "./pages/seeker/Profile.jsx";
import SavedJobs from "./pages/seeker/SavedJobs.jsx";
import EmployerProfile from "./pages/employer/EmployerProfile.jsx";
import EmployerJobs from "./pages/employer/Jobs.jsx";
import JobForm from "./pages/employer/JobForm.jsx";
import EmployerApplicants from "./pages/employer/Applicants.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SeekerApplications from "./pages/seeker/Application.jsx";

export default function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div className="p-10 text-center">Checking auth...</div>;
  }

  return (
    <Routes>
      {/* ========= PUBLIC ROUTES ========= */}
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========= SEEKER ROUTES ========= */}
      <Route element={<ProtectedRoute allowedRoles={["seeker"]} />}>
        <Route path="/seeker/profile" element={<SeekerProfile />} />
        <Route path="/seeker/applications" element={<SeekerApplications />} />
        <Route path="/seeker/saved-jobs" element={<SavedJobs />} />

      </Route>

      {/* ========= EMPLOYER ROUTES ========= */}
      <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
        <Route path="/employer/profile" element={<EmployerProfile />} />
         <Route path="/employer/jobs" element={<EmployerJobs />} />
         <Route path="/employer/jobs/:id/edit" element={<JobForm />} />
         <Route path="/employer/jobs/new" element={<JobForm />} />
          <Route path="/employer/jobs/:jobId/applications" element={<EmployerApplicants />}
  />

        </Route>
    </Routes>
  );
}
