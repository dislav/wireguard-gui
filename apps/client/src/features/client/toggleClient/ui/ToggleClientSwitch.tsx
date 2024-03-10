import { Switch } from '@nextui-org/react';

import { Client } from '@/entities/client/model/types';
import { useAppDispatch } from '@/shared/model';
import { toggleClientThunk } from '@/features/client/toggleClient';

interface ToggleClientSwitchProps {
    client: Client;
}

export default function ToggleClientSwitch({
    client,
}: ToggleClientSwitchProps) {
    const dispatch = useAppDispatch();

    const onToggleClient = async (enabled: boolean) => {
        dispatch(toggleClientThunk({ id: client.id, enabled }));
    };

    return (
        <Switch
            size="sm"
            color="primary"
            classNames={{ wrapper: 'mr-0' }}
            onValueChange={onToggleClient}
            isSelected={client.enabled}
        />
    );
}
