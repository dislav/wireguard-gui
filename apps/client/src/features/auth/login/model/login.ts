import { createAsyncThunk } from '@reduxjs/toolkit';

import { LoginDto, sessionApi } from '@/entities/session';
import { isFetchBaseQueryError, isMessageError } from '@/shared/api';

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (body: LoginDto, { dispatch }) => {
        try {
            await dispatch(sessionApi.endpoints.login.initiate(body)).unwrap();
        } catch (err) {
            if (isFetchBaseQueryError(err)) {
                if (typeof err.data === 'string') {
                    throw new Error(err.data);
                } else if (isMessageError(err.data)) {
                    throw new Error(err.data.message);
                }
            }

            throw new Error('Unknown error');
        }
    }
);
