import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AuthGuard() {
  const { isLogin } = useAuth();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export function AdminGuard() {
  const { isLogin, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
