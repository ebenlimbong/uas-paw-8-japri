import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const getProfileLink = () => {
    if (user?.role === "seeker") return "/seeker/profile";
    if (user?.role === "employer") return "/employer/profile";
    return "/";
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-[100%] mx-30 px-6">
        <div className="flex justify-between items-center h-18">

          {/* LEFT - Logo & Menu */}
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">●</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                JAPRI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium">
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Find Jobs
              </Link>
            </div>
          </div>

          {/* RIGHT - Auth */}
          <div className="flex items-center">
            {!user ? (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
              >
                Sign in
              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <div
                    title={user.name}
                    className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition"
                  >
                    <span className="text-white font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-semibold text-gray-900 truncate">{user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                        {user.role}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to={getProfileLink()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">My Profile</span>
                      </Link>

                      {user.role === "seeker" && (
                        <>
                          <Link
                            to="/seeker/applications"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <span className="font-medium">My Applications</span>
                          </Link>
                          <Link
                            to="/seeker/saved-jobs"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                          >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            <span className="font-medium">Saved Jobs</span>
                          </Link>
                        </>
                      )}

                      {user.role === "employer" && (
                        <Link
                          to="/employer/jobs"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
                        >
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="font-medium">Manage Jobs</span>
                        </Link>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;

