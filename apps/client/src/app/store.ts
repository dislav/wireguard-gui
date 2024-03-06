import { configureStore, lruMemoize, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Reducers
import { themeSlice } from '@/entities/theme';
import { sessionSlice } from '@/entities/session';
import { clientSlice } from '@/entities/client';

// Api
import { baseApi } from '@/shared/api';

// Listeners
import { invalidSessionListenerMiddleware } from '@/features/auth/invalidSession';

export function makeStore() {
    let preloadedState = {};

    try {
        const authorized = localStorage.getItem('authorized');
        const theme = localStorage.getItem('theme');

        if (authorized !== null) {
            preloadedState = {
                ...preloadedState,
                [sessionSlice.name]: {
                    isLoggedIn: JSON.parse(authorized),
                },
            };
        }

        if (theme !== null) {
            preloadedState = {
                ...preloadedState,
                [themeSlice.name]: {
                    theme: theme ?? 'light',
                },
            };
        }
    } catch (e) {
        console.log(e);
    }

    const store = configureStore({
        reducer: {
            [themeSlice.name]: themeSlice.reducer,
            [sessionSlice.name]: sessionSlice.reducer,
            [clientSlice.name]: clientSlice.reducer,
            [baseApi.reducerPath]: baseApi.reducer,
        },
        preloadedState,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware()
                .concat(baseApi.middleware as Middleware)
                .concat(invalidSessionListenerMiddleware.middleware),
    });

    setupListeners(store.dispatch);

    return store;
}

export const store = makeStore();

const saveState = lruMemoize((isLoggedIn: string, theme: string) => {
    localStorage.setItem('authorized', isLoggedIn);
    localStorage.setItem('theme', theme);
});

store.subscribe(() => {
    const state = store.getState();

    saveState(JSON.stringify(state.session.isLoggedIn), state.theme.theme);
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
