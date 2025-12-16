import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

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
import PostJob from './pages/Employer/PostJob';
import EditJob from './pages/Employer/EditJob';
import ViewApplicants from './pages/Employer/ViewApplicants';
import CompanyProfile from './pages/Employer/CompanyProfile';

// Components
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route 
            path="/employer/post-job" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/edit-job/:id" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EditJob />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employer/jobs/:jobId/applicants" 
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <ViewApplicants />
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