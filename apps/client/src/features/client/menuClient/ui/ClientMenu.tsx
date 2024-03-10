import {
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    useDisclosure,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { Client } from '@/entities/client/model/types';
import { ClientQrCodeModal } from '@/features/client/qrCodeClient';
import { DeleteClientConfirmModal } from '@/features/client/deleteClient';
import { MenuDots, QRCode, Download, Trash } from '@wireguard-vpn/icons';

interface ClientMenuProps {
    client: Client;
}

export default function ClientMenu({ client }: ClientMenuProps) {
    const { t } = useTranslation('Client');

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const {
        isOpen: isOpenConfirm,
        onOpen: onOpenConfirm,
        onOpenChange: onOpenChangeConfirm,
    } = useDisclosure();

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
            onOpen();
        } else if (key === 'download') {
            window.open(
                `http://localhost:3000/wireguard/clients/${client.id}/config`,
                '_blank'
            );
        } else if (key === 'delete') {
            onOpenConfirm();
        }
    };

    return (
        <>
            <Dropdown>
                <DropdownTrigger>
                    <Button variant="bordered" isIconOnly>
                        <div className="size-6">{MenuDots}</div>
                    </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Dropdown menu" onAction={onClickMenu}>
                    {menu.map((item) => (
                        <DropdownItem
                            key={item.key}
                            color={item.key === 'delete' ? 'danger' : 'default'}
                            startContent={
                                <div className="size-4">{item.icon}</div>
                            }
                            showDivider={item.showDivider}
                        >
                            {item.label}
                        </DropdownItem>
                    ))}
                </DropdownMenu>
            </Dropdown>
            <ClientQrCodeModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                clientId={client.id}
            />
            <DeleteClientConfirmModal
                isOpen={isOpenConfirm}
                onOpenChange={onOpenChangeConfirm}
                clientId={client.id}
            />
        </>
    );
}
