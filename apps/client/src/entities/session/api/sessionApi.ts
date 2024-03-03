import { baseApi, SESSION_TAG } from '@/shared/api';
import { LoginDto, SessionBody } from './types';

export const sessionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<boolean, LoginDto>({
            query: (body) => ({
                url: 'session',
                method: 'POST',
                body,
            }),
            invalidatesTags: [SESSION_TAG],
        }),
        session: builder.query<SessionBody, void>({
            query: () => 'session',
            providesTags: [SESSION_TAG],
        }),
    }),
});

export const { useLoginMutation, useSessionQuery } = sessionApi;
