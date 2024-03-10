import {
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalProps,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

interface ClientQrCodeModalProps extends Omit<ModalProps, 'children'> {
    clientId: string;
}

export default function ClientQrCodeModal({
    clientId,
    ...props
}: ClientQrCodeModalProps) {
    const { t } = useTranslation('Client');

    return (
        <Modal {...props}>
            <ModalContent>
                <ModalBody className="py-6">
                    <Image
                        width={512}
                        height={512}
                        src={`http://localhost:3000/wireguard/clients/${clientId}/qrcode`}
                        alt={t('QR code')}
                    />
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}
