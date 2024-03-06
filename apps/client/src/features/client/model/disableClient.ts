import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi, toggleClient } from '@/entities/client';

export const disableClientThunk = createAsyncThunk(
    'client/disableClient',
    async (id: string, { dispatch }) => {
        dispatch(toggleClient(id));

        try {
            await dispatch(
                clientApi.endpoints.disableClient.initiate(id)
            ).unwrap();
        } catch (e) {
            dispatch(toggleClient(id));

            console.log(e);
        }
    }
);
