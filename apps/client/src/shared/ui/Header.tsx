import { Avatar, cn } from '@nextui-org/react';

import { WireguardLogo } from '@wireguard-vpn/icons';
import { useSessionQuery } from '@/entities/session';

interface HeaderProps {
    className?: string;
}

export default function Header({ className }: HeaderProps) {
    const { data } = useSessionQuery();

    return (
        <div className={cn(className, 'flex items-center justify-between')}>
            <div className="flex items-center gap-4">
                <div className="text-red-500 size-16 bg-default-100 rounded-full p-3 [&>svg]:size-full">
                    {WireguardLogo}
                </div>
                <span className="text-xl font-bold">Wireguard</span>
            </div>
            {data?.username && (
                <div className="flex items-center gap-2">
                    <Avatar
                        name={`${data.username[0]}${data.username[1]}`.toUpperCase()}
                    />
                    {data.username}
                </div>
            )}
        </div>
    );
}
