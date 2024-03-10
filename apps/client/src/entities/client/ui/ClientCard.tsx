import { Card, CardBody, Avatar } from '@nextui-org/react';
import dayjs from 'dayjs';

import { Client } from '../model/types';
import { getAdditionalInfo } from '../lib/getAdditionalInfo';
import { ClientMenu } from '@/features/client/menuClient';
import { ToggleClientSwitch } from '@/features/client/toggleClient';

interface ClientCardProps {
    client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
    const isOnline =
        !!client.latestHandshakeAt &&
        dayjs().diff(client.latestHandshakeAt, 'minute') < 5;

    const additionalInfo = getAdditionalInfo(client);

    return (
        <Card>
            <CardBody>
                <div className="flex justify-between gap-6">
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Avatar />
                                {isOnline && (
                                    <span className="absolute top-0 right-0 flex w-2.5 h-2.5">
                                        <span className="absolute w-full h-full bg-danger/75 rounded-full animate-ping-slow duration-300" />
                                        <span className="relative w-2.5 h-2.5 bg-danger rounded-full" />
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-zinc-800 dark:text-white text-base font-bold">
                                    {client.name}
                                </span>
                                <span className="text-zinc-500 dark:text-zinc-300 text-sm">
                                    {client.address}
                                </span>
                            </div>
                        </div>
                        {additionalInfo.length > 0 && (
                            <div className="flex md:flex-row flex-col md:items-center text-zinc-500 dark:text-zinc-300 text-sm md:gap-2 gap-1">
                                {additionalInfo.map((info, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1"
                                    >
                                        {info.icon && (
                                            <span className="flex items-center justify-center size-4">
                                                {info.icon}
                                            </span>
                                        )}
                                        {info.label}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col justify-between gap-2">
                        <ClientMenu client={client} />
                        <ToggleClientSwitch client={client} />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
