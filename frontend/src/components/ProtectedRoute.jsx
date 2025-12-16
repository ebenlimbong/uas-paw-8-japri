import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Tunggu cek login selesai

  // Jika user belum login, lempar ke login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role user tidak sesuai (misal Seeker mau masuk halaman Employer)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Lempar ke home
  }

  // Jika lolos, render halaman yang diminta
  return <Outlet />;
};

export default ProtectedRoute;