import {
    Card,
    CardBody,
    Switch,
    Button,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Avatar,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

import { Client } from '../model/types';
import { getAdditionalInfo } from '../lib/getAdditionalInfo';
import { useAppDispatch } from '@/shared/model';
import {
    deleteClientThunk,
    disableClientThunk,
    enableClientThunk,
} from '@/features/client';
import { MenuDots, QRCode, Download, Trash } from '@wireguard-vpn/icons';

interface ClientCardProps {
    client: Client;
}

export default function ClientCard({ client }: ClientCardProps) {
    const { t } = useTranslation('Client');

    const dispatch = useAppDispatch();

    const isOnline =
        !!client.latestHandshakeAt &&
        dayjs().diff(client.latestHandshakeAt, 'minute') < 5;

    const additionalInfo = getAdditionalInfo(client);

    const menu = [
        {
            key: 'qrcode',
            icon: QRCode,
            label: t('QR code'),
        },
        {
            key: 'download',
            icon: Download,
            label: t('Download'),
            showDivider: true,
        },
        {
            key: 'delete',
            icon: Trash,
            label: t('Delete'),
            color: 'danger',
        },
    ];

    const onClickMenu = async (key: string | number) => {
        if (key === 'qrcode') {
            // TODO: open modal with qrcode
            console.log(key);
        } else if (key === 'download') {
            window.open(
                `http://localhost:3000/wireguard/clients/${client.id}/config`,
                '_blank'
            );
        } else if (key === 'delete') {
            await dispatch(deleteClientThunk(client.id)).unwrap();
        }
    };

    const onToggleClient = async (enable: boolean) => {
        if (enable) {
            await dispatch(enableClientThunk(client.id)).unwrap();
        } else {
            await dispatch(disableClientThunk(client.id)).unwrap();
        }
    };

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
                        <Dropdown>
                            <DropdownTrigger>
                                <Button variant="bordered" isIconOnly>
                                    <div className="size-6">{MenuDots}</div>
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Dropdown menu"
                                onAction={onClickMenu}
                            >
                                {menu.map((item) => (
                                    <DropdownItem
                                        key={item.key}
                                        color={
                                            item.key === 'delete'
                                                ? 'danger'
                                                : 'default'
                                        }
                                        startContent={
                                            <div className="size-4">
                                                {item.icon}
                                            </div>
                                        }
                                        showDivider={item.showDivider}
                                    >
                                        {item.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Switch
                            size="sm"
                            color="primary"
                            classNames={{ wrapper: 'mr-0' }}
                            onValueChange={onToggleClient}
                            isSelected={client.enabled}
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
