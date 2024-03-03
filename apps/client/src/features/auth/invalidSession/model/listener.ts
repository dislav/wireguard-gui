import { createListenerMiddleware } from '@reduxjs/toolkit';

import { AppDispatch, RootState } from '@/app/store';
import { invalidateSession } from '@/shared/api';
import { logoutThunk } from '../../logout';

export const invalidSessionListenerMiddleware = createListenerMiddleware();

export const startInvalidSessionListener =
    invalidSessionListenerMiddleware.startListening.withTypes<
        RootState,
        AppDispatch
    >();

startInvalidSessionListener({
    actionCreator: invalidateSession,
    effect: (_, api) => {
        api.dispatch(logoutThunk());
    },
});
