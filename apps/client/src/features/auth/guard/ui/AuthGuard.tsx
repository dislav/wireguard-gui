import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsLoggedIn } from '@/entities/session';

interface AuthGuardProps {
    children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const location = useLocation();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (isLoggedIn) {
        return <Navigate to={location.state?.from?.pathname || '/'} />;
    }

    return children;
}
