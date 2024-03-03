import { baseApi } from '@/shared/api';
import { ClientsBody, ClientBody } from './types';

export const clientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        clients: builder.query<ClientsBody, void>({
            query: () => 'wireguard/clients',
        }),
        client: builder.query<ClientBody, string>({
            query: (id) => `wireguard/clients/${id}`,
        }),
    }),
});

export const { useClientsQuery, useClientQuery } = clientApi;
