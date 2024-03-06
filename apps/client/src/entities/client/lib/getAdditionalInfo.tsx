import dayjs from 'dayjs';

import { Client } from '../model/types';
import { convertBytes } from '@/shared/lib';
import {
    ClockCircle,
    RoundArrowDown,
    RoundArrowUp,
} from '@wireguard-vpn/icons';

export function getAdditionalInfo(client: Client) {
    const result: { icon?: React.ReactNode; label: string }[] = [];

    if (client.transferTx) {
        result.push({
            icon: RoundArrowDown,
            label: convertBytes(client.transferTx),
        });
    }

    if (client.transferRx) {
        result.push({
            icon: RoundArrowUp,
            label: convertBytes(client.transferRx),
        });
    }

    if (client.latestHandshakeAt) {
        result.push({
            icon: ClockCircle,
            label: dayjs(client.latestHandshakeAt).fromNow(),
        });
    }

    if (client.telegramId) {
        result.push({ label: client.telegramId.toString() });
    }

    return result;
}
