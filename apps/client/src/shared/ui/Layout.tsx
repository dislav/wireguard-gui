import { Outlet, useNavigate } from 'react-router-dom';
import { NextUIProvider } from '@nextui-org/react';

interface LayoutProps {
    header: React.ReactNode;
}

export default function Layout({ header }: LayoutProps) {
    const navigate = useNavigate();

    return (
        <NextUIProvider navigate={navigate}>
            <div className="flex justify-center">
                <div className="w-full max-w-3xl flex flex-col gap-8 py-8 px-6">
                    {header}
                    <div className="flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </div>
        </NextUIProvider>
    );
}
