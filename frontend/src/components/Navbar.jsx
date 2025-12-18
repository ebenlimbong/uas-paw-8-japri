import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">JP</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">JobPortal</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Find Jobs
                        </Link>
                        <Link to="/companies" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Companies
                        </Link>
                        <Link to="/career-tips" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                            Career Tips
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link to={user.role === 'seeker' ? '/seeker/profile' : '#'} className="flex items-center gap-2 hover:bg-gray-50 rounded-full pr-3 py-1 transition-colors">
                                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {user.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Post Job
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
