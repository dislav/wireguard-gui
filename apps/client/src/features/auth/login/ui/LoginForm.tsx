import { useState } from 'react';
import { Button, cn } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/shared/model';
import { loginThunk } from '@/features/auth/login';
import { loginFormSchema, LoginFormSchema } from '../model/loginFormSchema';
import { Input } from '@/shared/ui';

interface LoginFormProps {
    className?: string;
}

export default function LoginForm({ className }: LoginFormProps) {
    const { t } = useTranslation('Auth');

    const dispatch = useAppDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
        resolver: zodResolver(loginFormSchema),
    });

    const onSubmit: SubmitHandler<LoginFormSchema> = async (data) => {
        setIsLoading(true);
        setError(null);

        try {
            await dispatch(loginThunk(data)).unwrap();
        } catch (e) {
            const error = e as Error;

            setError(error.message);
        }

        setIsLoading(false);
    };

    return (
        <div
            className={cn(
                className,
                'w-full max-w-lg bg-default-50 rounded-3xl p-6'
            )}
        >
            <form
                className="flex flex-col gap-8"
                onSubmit={handleSubmit(onSubmit)}
            >
                {error && (
                    <div className="bg-danger-200 rounded-xl py-4 px-6">
                        {error}
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    <Input
                        {...register('username')}
                        label={t('Username')}
                        isInvalid={!!formState.errors.username}
                        errorMessage={formState.errors.username?.message}
                    />

                    <Input
                        {...register('password')}
                        type="password"
                        label={t('Password')}
                        isInvalid={!!formState.errors.password}
                        errorMessage={formState.errors.password?.message}
                    />
                </div>

                <Button
                    color="primary"
                    size="lg"
                    type="submit"
                    isLoading={isLoading}
                >
                    {t('Login')}
                </Button>
            </form>
        </div>
    );
}
