import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

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
              <Link
                to="/companies"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Companies
              </Link>
              <Link
                to="/career-tips"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Career tips
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
              <div
                title={user.name}
                className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center cursor-pointer"
              >
                <span className="text-white font-semibold text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
