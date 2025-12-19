import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetail from "./pages/JobDetail.jsx";
import SeekerProfile from "./pages/seeker/Profile.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

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
      </Route>

      {/* ========= EMPLOYER ROUTES ========= */}
      <Route element={<ProtectedRoute allowedRoles={["employer"]} />}>
        <Route path="/employer/*" element={<div>Employer Dashboard</div>} />
      </Route>
    </Routes>
  );
}
