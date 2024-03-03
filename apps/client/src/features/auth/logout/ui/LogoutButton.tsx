import { Button, cn } from '@nextui-org/react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '@/shared/model';
import { logoutThunk } from '../model/logout';

interface LogoutButtonProps {
    className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const onLogout = async () => {
        await dispatch(logoutThunk()).unwrap();
    };

    return (
        <Button className={cn(className)} onClick={onLogout}>
            {t('Logout')}
        </Button>
    );
}
