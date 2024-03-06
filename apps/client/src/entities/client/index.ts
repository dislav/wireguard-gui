export {
    clientApi,
    useAddClientMutation,
    useClientsQuery,
    useClientQuery,
    useUpdateClientMutation,
    useEnableClientMutation,
    useDisableClientMutation,
    useDeleteClientMutation,
} from './api/clientApi';
export {
    clientSlice,
    clearClients,
    toggleClient,
    selectClients,
} from './model/slice';
export { ClientCard, ClientCardSkeleton } from './ui';
