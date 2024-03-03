import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '@/app/store';
import { SessionState } from './types';
import { sessionApi } from '@/entities/session';

const initialState: SessionState = {
    username: undefined,
    isLoggedIn: false,
};

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        clearSession: (state) => {
            state.username = undefined;
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            sessionApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                state.isLoggedIn = payload;
            }
        );
    },
});

export const selectIsLoggedIn = (state: RootState) => state.session.isLoggedIn;

export const { clearSession } = sessionSlice.actions;
