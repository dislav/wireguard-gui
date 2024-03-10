import { useState } from 'react';
import { Button, ButtonProps } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/shared/model';
import { deleteClientThunk } from '@/features/client/deleteClient';

interface DeleteClientButtonProps extends ButtonProps {
    clientId: string;
}

export default function DeleteClientButton({
    clientId,
    color = 'danger',
    children,
    ...props
}: DeleteClientButtonProps) {
    const { t } = useTranslation('Client');

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const onDelete = async () => {
        setIsLoading(true);
        await dispatch(deleteClientThunk(clientId)).unwrap();
        setIsLoading(false);
    };

    return (
        <Button
            {...props}
            color={color}
            onPress={onDelete}
            isLoading={isLoading}
        >
            {children || t('Delete client')}
        </Button>
    );
}
