import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../service/auth.service';
import VerifyingUserLoading from '../components/loadingComponent/loginPageLoading/VerifyingUserLoading';

const ProtectedRoute = () => {
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const location = useLocation();

    useEffect(() => {
        const verifyToken = async () => {
        const token = localStorage.getItem('Token');
        if (!token) return setIsValid(false);

        try {
            const response = await authService.verifyToken();
            setIsValid(response.status === 200);
        } catch (err) {
            setIsValid(false);
        }
        };

        verifyToken();
    }, []);

    if (isValid === null) {
        return <VerifyingUserLoading />;
    }

    return isValid ? <Outlet /> : <Navigate to="/auth" state={{ from: location }} replace />;
};

export default ProtectedRoute;
