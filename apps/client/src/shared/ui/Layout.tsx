import { Outlet, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

interface LayoutProps {
    header: React.ReactNode;
}

export default function Layout({ header }: LayoutProps) {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate}>
            {header}
            <div className="flex justify-center py-8">
                <main className="w-full max-w-3xl flex flex-col gap-6 px-4">
                    <Outlet />
                </main>
            </div>
        </NextUIProvider>
    );
}
