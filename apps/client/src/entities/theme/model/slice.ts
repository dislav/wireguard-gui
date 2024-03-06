import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeState, Theme } from './types';
import { RootState } from '@/app/store';

const initialState: ThemeState = {
    theme: 'light',
};

export const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        changeTheme: (state, action: PayloadAction<Theme>) => {
            state.theme = action.payload;
        },
    },
});

export const selectTheme = (state: RootState) => state.theme.theme;

export const { changeTheme } = themeSlice.actions;
