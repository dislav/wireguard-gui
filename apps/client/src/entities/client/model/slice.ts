import { createSlice } from '@reduxjs/toolkit';
import { ClientState } from './types';
import { clientApi } from '@/entities/client/api/clientApi.ts';

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

export const { clearClients } = clientSlice.actions;
