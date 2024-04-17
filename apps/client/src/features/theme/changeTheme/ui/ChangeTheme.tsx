import { Button } from '@nextui-org/react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@/shared/model';
import { changeTheme, selectTheme } from '@/entities/theme';
import { Sun, Moon } from '@wireguard-vpn/icons';

export default function ChangeTheme() {
    const dispatch = useAppDispatch();
    const currentTheme = useSelector(selectTheme);

    const onClick = () => {
        dispatch(changeTheme(currentTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <Button onPress={onClick} isIconOnly>
            <div className="size-6">
                {currentTheme === 'light' ? Moon : Sun}
            </div>
        </Button>
    );
}
