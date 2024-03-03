import { Card, CardBody, Switch } from '@nextui-org/react';
import dayjs from 'dayjs';

import { Client } from '../model/types.ts';

interface ClientCardProps {
    client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
    return (
        <Card>
            <CardBody>
                <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-base font-bold">
                            {client.name}
                        </span>
                        <div className="flex items-center text-sm gap-2">
                            {client.telegramId && (
                                <span>{client.telegramId}</span>
                            )}
                            <span>{client.address}</span>
                            {client.latestHandshakeAt && (
                                <span>
                                    {dayjs(client.latestHandshakeAt).fromNow()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Switch
                            classNames={{ wrapper: 'mr-0' }}
                            isSelected={client.enabled}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
