import { createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi, toggleClient } from '@/entities/client';

export const enableClientThunk = createAsyncThunk(
    'client/enableClient',
    async (id: string, { dispatch }) => {
        dispatch(toggleClient(id));

        try {
            await dispatch(
                clientApi.endpoints.enableClient.initiate(id)
            ).unwrap();
        } catch (e) {
            dispatch(toggleClient(id));

            console.log(e);
        }
    }
);
