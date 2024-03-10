import { useState } from 'react';
import { Button } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import {
    addClientFormSchema,
    AddClientFormSchema,
} from '../model/addClientFormSchema';
import { useAppDispatch } from '@/shared/model';
import { addClientThunk } from '../model/addClient';
import { Input } from '@/shared/ui';

interface AddClientFormProps {
    onSuccess?: () => void;
}

export default function AddClientForm({ onSuccess }: AddClientFormProps) {
    const { t } = useTranslation('Client');

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState, setError } =
        useForm<AddClientFormSchema>({
            resolver: zodResolver(addClientFormSchema),
        });

    const onSubmit: SubmitHandler<AddClientFormSchema> = async (data) => {
        setIsLoading(true);

        try {
            await dispatch(addClientThunk(data)).unwrap();

            onSuccess?.();
        } catch (e) {
            const error = e as Error;

            setError('name', { message: t(error.message) });
        }

        setIsLoading(false);
    };

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
                {...register('name')}
                label={t('Name')}
                isInvalid={!!formState.errors.name}
                errorMessage={formState.errors.name?.message}
            />

            <Button color="primary" type="submit" isLoading={isLoading}>
                {t('Save')}
            </Button>
        </form>
    );
}
