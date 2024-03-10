import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi, toggleClient } from '@/entities/client';

export const toggleClientThunk = createAsyncThunk(
    'client/toggleClient',
    async ({ id, enabled }: { id: string; enabled: boolean }, { dispatch }) => {
        dispatch(toggleClient(id));

        try {
            if (enabled) {
                await dispatch(
                    clientApi.endpoints.enableClient.initiate(id)
                ).unwrap();
            } else {
                await dispatch(
                    clientApi.endpoints.disableClient.initiate(id)
                ).unwrap();
            }
        } catch (err) {
            dispatch(toggleClient(id));
        }
    }
);
