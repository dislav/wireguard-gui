import { Button } from '@nextui-org/react';

import { useAppDispatch } from '@/shared/model';
import { logoutThunk } from '../model/logout';
import { Logout } from '@wireguard-vpn/icons';

export default function LogoutButton() {
    const dispatch = useAppDispatch();

    const onLogout = async () => {
        await dispatch(logoutThunk()).unwrap();
    };

    return (
        <Button color="danger" onPress={onLogout} isIconOnly>
            <div className="size-6">{Logout}</div>
        </Button>
    );
}
