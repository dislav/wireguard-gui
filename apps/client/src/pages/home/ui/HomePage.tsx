import { ClientCard, useClientsQuery } from '@/entities/client';

export default function HomePage() {
    const { data, isLoading } = useClientsQuery();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            {data &&
                data.length > 0 &&
                data.map((client) => (
                    <ClientCard key={client.id} client={client} />
                ))}
        </div>
    );
}
