import { BaseQueryFn } from '@reduxjs/toolkit/query/react';

import { baseQuery } from './baseQuery';
import { invalidateSession } from './invalidateSession';

export const baseQueryWithAuth: BaseQueryFn = async function (
    args,
    api,
    extraOptions
) {
    const result = await baseQuery(args, api, extraOptions);

    if (
        typeof result?.error?.status === 'number' &&
        result.error.status === 401
    ) {
        api.dispatch(invalidateSession());
    }

    return result;
};
