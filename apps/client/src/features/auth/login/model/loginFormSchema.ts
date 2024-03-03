import { z } from 'zod';
import i18n from '@wireguard-vpn/i18n';

export const loginFormSchema = z.object({
    username: z.string().min(1, { message: i18n.t('Required field') }),
    password: z.string().min(1, { message: i18n.t('Required field') }),
});

export type LoginFormSchema = z.infer<typeof loginFormSchema>;
