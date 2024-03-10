import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ClientCard, selectClients, useClientsQuery } from '@/entities/client';
import { AddClientButton } from '@/features/client/addClient';
import { HomePageSkeleton } from './HomePage.skeleton';

export default function HomePage() {
    const { t } = useTranslation('Client');

    const { isLoading } = useClientsQuery();

    const clients = useSelector(selectClients);

    if (isLoading) {
        return <HomePageSkeleton />;
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="md:text-3xl text-2xl font-bold">
                    {t('Clients', { count: clients.length })}
                </h1>

                <AddClientButton />
            </div>
            {clients.length > 0 && (
                <div className="flex flex-col gap-4">
                    {clients.map((client) => (
                        <ClientCard key={client.id} client={client} />
                    ))}
                </div>
            )}
        </div>
    );
}
