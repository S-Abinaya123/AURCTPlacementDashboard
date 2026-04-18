import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../service/auth.service';
import VerifyingUserLoading from '../components/loadingComponent/loginPageLoading/VerifyingUserLoading';

const PublicRoute = ({ element }: { element: JSX.Element }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('Token');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                await authService.verifyToken();
                setIsAuthenticated(true);
            } catch (err) {
                // Token invalid, clear storage
                localStorage.removeItem('Token');
                localStorage.removeItem('userId');
                localStorage.removeItem('userName');
                localStorage.removeItem('role');
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, []);

    if (isLoading) {
        return <VerifyingUserLoading />;
    }

    // If already authenticated, redirect to appropriate dashboard
    if (isAuthenticated) {
        const role = localStorage.getItem('role');
        
        // Use navigate with replace to avoid history issues
        if (role === 'FACULTY' || role === 'ADMIN') {
            return <Navigate to="/faculty" replace />;
        }
        return <Navigate to="/student" replace />;
    }

    // Not authenticated, show the element (login page)
    return element;
};

export default PublicRoute;
