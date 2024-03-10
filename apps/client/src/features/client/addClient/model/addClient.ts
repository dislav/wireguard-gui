import { createAsyncThunk } from '@reduxjs/toolkit';

import { clientApi } from '@/entities/client';
import { AddClientFormSchema } from './addClientFormSchema';
import { isFetchBaseQueryError, isMessageError } from '@/shared/api';

export const addClientThunk = createAsyncThunk(
    'client/addClient',
    async (body: AddClientFormSchema, { dispatch }) => {
        try {
            await dispatch(
                clientApi.endpoints.addClient.initiate(body)
            ).unwrap();
        } catch (err) {
            if (isFetchBaseQueryError(err)) {
                if (typeof err.data === 'string') {
                    throw new Error(err.data);
                } else if (isMessageError(err.data)) {
                    throw new Error(
                        typeof err.data.message === 'string'
                            ? err.data.message
                            : err.data.message[0]
                    );
                }
            }

            throw new Error('Unknown error');
        }
    }
);
