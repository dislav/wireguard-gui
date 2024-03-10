import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi } from '@/entities/client';

export const deleteClientThunk = createAsyncThunk(
    'client/deleteClient',
    async (id: string, { dispatch }) => {
        try {
            await dispatch(
                clientApi.endpoints.deleteClient.initiate(id)
            ).unwrap();
        } catch (e) {
            console.log(e);
        }
    }
);
