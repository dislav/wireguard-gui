import { createBrowserRouter } from 'react-router-dom';

// Guards
import { AuthGuard, GuestGuard } from '@/features/auth/guard';

// Layouts
import { HomeLayout } from './layouts/homeLayout';

// Pages
import { HomePage } from '@/pages/home';
import { LoginPage } from '@/pages/login';

export const router = createBrowserRouter([
    {
        path: '/',
        element: HomeLayout,
        children: [
            {
                index: true,
                element: (
                    <GuestGuard>
                        <HomePage />
                    </GuestGuard>
                ),
            },
        ],
    },
    {
        path: '/login',
        element: (
            <AuthGuard>
                <LoginPage />
            </AuthGuard>
        ),
    },
]);
