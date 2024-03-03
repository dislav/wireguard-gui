import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsLoggedIn } from '@/entities/session';

interface GuestGuardProps {
    children: React.ReactNode;
}

export default function GuestGuard({ children }: GuestGuardProps) {
    const location = useLocation();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
}
