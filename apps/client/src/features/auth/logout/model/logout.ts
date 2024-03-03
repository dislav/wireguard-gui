import { createAsyncThunk } from '@reduxjs/toolkit';

import { clearSession, sessionApi } from '@/entities/session';

export const logoutThunk = createAsyncThunk(
    'auth/logout',
    async (_, { dispatch }) => {
        dispatch(clearSession());

        await new Promise((resolve) => setTimeout(resolve, 10));

        dispatch(sessionApi.util?.resetApiState());
    }
);
