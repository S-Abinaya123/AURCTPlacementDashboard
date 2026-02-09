import { useEffect, useState, type JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../service/auth.service';
import VerifyingUserLoading from '../components/loadingComponent/loginPageLoading/VerifyingUserLoading';

const PublicRoute = ({ element }: { element: JSX.Element }) => {
    const [isValid, setIsValid] = useState<boolean | null>(null);

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

    if (isValid === null) return <VerifyingUserLoading />;

    const role = localStorage.getItem('role');

    if(role ==='ADMIN' || role === 'FACULTY') return isValid ? <Navigate to="/faculty/home" replace /> : element;
    else return isValid ? <Navigate to="/student/home" replace /> : element;
    
};

export default PublicRoute;
