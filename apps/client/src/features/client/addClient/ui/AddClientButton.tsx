import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    useDisclosure,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import AddClientForm from './AddClientForm';
import { AddCircle } from '@wireguard-vpn/icons';

export default function AddClientButton() {
    const { t } = useTranslation('Client');

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

    return (
        <>
            <Button
                className="font-medium"
                color="primary"
                onPress={onOpen}
                startContent={
                    <div className="flex items-center justify-center size-6">
                        {AddCircle}
                    </div>
                }
            >
                {t('New client')}
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    <ModalHeader>{t('New client')}</ModalHeader>
                    <ModalBody className="pb-6">
                        <AddClientForm onSuccess={onClose} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
