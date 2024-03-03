import { configureStore, Middleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Reducers
import { sessionSlice } from '@/entities/session';
import { clientSlice } from '@/entities/client';

// Api
import { baseApi } from '@/shared/api';

// Listeners
import { invalidSessionListenerMiddleware } from '@/features/auth/invalidSession';

export function makeStore() {
    let preloadedState = {};

    try {
        const state = localStorage.getItem('state');

        if (state) {
            preloadedState = JSON.parse(state);
        }
    } catch (e) {
        console.log(e);
    }

    const store = configureStore({
        reducer: {
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

store.subscribe(() => {
    const state = store.getState();

    localStorage.setItem(
        'state',
        JSON.stringify({
            [sessionSlice.name]: state.session,
        })
    );
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
