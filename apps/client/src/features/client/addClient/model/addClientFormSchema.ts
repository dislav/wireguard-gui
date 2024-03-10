import { z } from 'zod';
import i18n from '@wireguard-vpn/i18n';

export const addClientFormSchema = z.object({
    name: z.string().min(1, { message: i18n.t('Required field') }),
});

export type AddClientFormSchema = z.infer<typeof addClientFormSchema>;
