import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';

// Job Seeker Pages
import Profile from './pages/JobSeeker/Profile';
import MyApplications from './pages/JobSeeker/MyApplications';
import SavedJobs from './pages/JobSeeker/SavedJobs';

// Employer Pages
import Dashboard from './pages/Employer/Dashboard';
import CompanyProfile from './pages/Employer/CompanyProfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Placeholder for pages that will be added by team member
const ComingSoon = ({ title }) => (
  <Layout>
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600">Halaman ini akan segera tersedia</p>
    </div>
  </Layout>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Job Seeker Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/saved-jobs" 
            element={
              <ProtectedRoute allowedRoles={['seeker']}>
                <SavedJobs />
              </ProtectedRoute>
            } 
          />

          {/* Employer Routes */}
          <Route 
            path="/employer/dashboard" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* Routes below will be implemented by team member */}
          <Route 
            path="/employer/post-job" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ComingSoon title="Posting Lowongan" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/edit-job/:id" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ComingSoon title="Edit Lowongan" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/jobs/:jobId/applicants" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ComingSoon title="Daftar Pelamar" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/company-profile" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;