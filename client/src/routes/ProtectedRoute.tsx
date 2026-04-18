import { useEffect, useState, type ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../service/auth.service";
import VerifyingUserLoading from "../components/loadingComponent/loginPageLoading/VerifyingUserLoading";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children?: ReactNode;
}

const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      // First check if token exists synchronously
      const token = localStorage.getItem("Token");

      if (!token) {
        setIsValid(false);
        return;
      }

      try {
        const res = await authService.verifyToken();
        setIsValid(true);
        setUserRole(res.data.data.role);
      } catch {
        // Token invalid, clear storage
        localStorage.removeItem('Token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('role');
        setIsValid(false);
      }
    };

    verify();
  }, []);

  // Show loading only if we're still verifying
  if (isValid === null) {
    return <VerifyingUserLoading />;
  }

  // Not authenticated, redirect to login
  if (!isValid) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Authenticated but wrong role - redirect to their appropriate dashboard
  if (allowedRoles && !allowedRoles.includes(userRole || '')) {
    if (userRole === 'FACULTY' || userRole === 'ADMIN') {
      return <Navigate to="/faculty" replace />;
    }
    return <Navigate to="/student" replace />;
  }

  // Render children or Outlet
  if (children) {
    return <>{children}</>;
  }
  return <Outlet />;
};

export default ProtectedRoute;
