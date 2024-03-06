import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import { ClientState } from './types';
import { clientApi } from '../api/clientApi';

const initialState: ClientState = {
    clients: [],
};

export const clientSlice = createSlice({
    name: 'client',
    initialState,
    reducers: {
        clearClients: (state) => {
            state.clients = [];
        },
        toggleClient: (state, { payload }: PayloadAction<string>) => {
            state.clients = state.clients.map((client) => {
                if (client.id === payload) {
                    return {
                        ...client,
                        enabled: !client.enabled,
                    };
                }

                return client;
            });
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            clientApi.endpoints.clients.matchFulfilled,
            (state, { payload }) => {
                state.clients = payload;
            }
        );
    },
});

export const selectClients = (state: RootState) => state.client.clients;

export const { clearClients, toggleClient } = clientSlice.actions;
