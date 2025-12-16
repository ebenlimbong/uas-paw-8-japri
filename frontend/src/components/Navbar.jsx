import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, isSeeker, isEmployer, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight">
              JobPortal
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition">
                Cari Lowongan
              </Link>
              {isSeeker && (
                <>
                  <Link to="/my-applications" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Lamaran Saya
                  </Link>
                  <Link to="/saved-jobs" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Tersimpan
                  </Link>
                </>
              )}
              {isEmployer && (
                <>
                  <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Dashboard
                  </Link>
                  <Link to="/employer/post-job" className="text-gray-600 hover:text-blue-600 font-medium transition">
                    Posting Lowongan
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link 
                  to={isEmployer ? '/employer/company-profile' : '/profile'} 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  👤 {user?.email?.split('@')[0] || 'Profile'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:text-blue-700 font-medium transition"
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                Cari Lowongan
              </Link>
              {isSeeker && (
                <>
                  <Link to="/my-applications" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Lamaran Saya
                  </Link>
                  <Link to="/saved-jobs" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Tersimpan
                  </Link>
                  <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Profile
                  </Link>
                </>
              )}
              {isEmployer && (
                <>
                  <Link to="/employer/dashboard" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/employer/post-job" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Posting Lowongan
                  </Link>
                  <Link to="/employer/company-profile" className="text-gray-600 hover:text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Company Profile
                  </Link>
                </>
              )}
              <hr className="my-2" />
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-left text-red-600 font-medium"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link to="/login" className="text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Masuk
                  </Link>
                  <Link to="/register" className="text-blue-600 font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
