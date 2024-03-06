import { createApi } from '@reduxjs/toolkit/query/react';

import { baseQueryWithAuth } from './baseQueryWithAuth';
import { CLIENT_TAG, SESSION_TAG } from './tags';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithAuth,
    endpoints: () => ({}),
    tagTypes: [SESSION_TAG, CLIENT_TAG],
});
