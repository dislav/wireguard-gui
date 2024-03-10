import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalProps,
} from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import DeleteClientButton from './DeleteClientButton';

interface DeleteClientConfirmModalProps extends Omit<ModalProps, 'children'> {
    clientId: string;
}

export default function DeleteClientConfirmModal({
    clientId,
    ...props
}: DeleteClientConfirmModalProps) {
    const { t } = useTranslation('Client');

    return (
        <Modal {...props}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>
                            {t('Confirmation of deletion')}
                        </ModalHeader>
                        <ModalBody>
                            {t('Are you sure you want to delete the client?')}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" onPress={onClose}>
                                {t('Cancel')}
                            </Button>
                            <DeleteClientButton
                                color="primary"
                                clientId={clientId}
                            >
                                {t('Confirm')}
                            </DeleteClientButton>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
