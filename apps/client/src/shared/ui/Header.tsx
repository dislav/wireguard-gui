import { Badge } from '@nextui-org/react';

import { WireguardLogo } from '@wireguard-vpn/icons';
import { ChangeTheme } from '@/features/theme';
import packageJson from '../../../package.json';

export default function Header() {
    return (
        <header className="sticky top-0 flex justify-center bg-background/50 backdrop-blur-xl py-4 z-20">
            <div className="w-full max-w-3xl flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <div className="text-red-500 size-12 bg-content2 rounded-full p-2 [&>svg]:size-full">
                        {WireguardLogo}
                    </div>
                    <Badge
                        size="sm"
                        content={`v${packageJson.version}`}
                        classNames={{ badge: 'font-semibold' }}
                    >
                        <span className="text-xl font-bold">Wireguard</span>
                    </Badge>
                </div>
                <ChangeTheme />
            </div>
        </header>
    );
}
