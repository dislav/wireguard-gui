import { baseApi, CLIENT_TAG } from '@/shared/api';
import {
    ClientBody,
    ClientsBody,
    CreateClientDto,
    UpdateClientDto,
} from './types';

export const clientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addClient: builder.mutation<ClientBody, CreateClientDto>({
            query: (body) => ({
                url: 'wireguard/clients',
                method: 'POST',
                body,
            }),
            invalidatesTags: [CLIENT_TAG],
        }),
        clients: builder.query<ClientsBody, void>({
            query: () => 'wireguard/clients',
            providesTags: [CLIENT_TAG],
        }),
        client: builder.query<ClientBody, string>({
            query: (id) => `wireguard/clients/${id}`,
            providesTags: [CLIENT_TAG],
        }),
        updateClient: builder.mutation<ClientBody, UpdateClientDto>({
            query: (body) => ({
                url: `wireguard/clients/${body.id}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: [CLIENT_TAG],
        }),
        enableClient: builder.mutation<ClientBody, string>({
            query: (id) => ({
                url: `wireguard/clients/${id}/enable`,
                method: 'PUT',
            }),
        }),
        disableClient: builder.mutation<ClientBody, string>({
            query: (id) => ({
                url: `wireguard/clients/${id}/disable`,
                method: 'PUT',
            }),
        }),
        deleteClient: builder.mutation<ClientBody, string>({
            query: (id) => ({
                url: `wireguard/clients/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [CLIENT_TAG],
        }),
    }),
});

export const {
    useAddClientMutation,
    useClientsQuery,
    useClientQuery,
    useEnableClientMutation,
    useDisableClientMutation,
    useUpdateClientMutation,
    useDeleteClientMutation,
} = clientApi;
