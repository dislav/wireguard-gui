import { Skeleton } from '@nextui-org/react';

import { ClientCardSkeleton } from '@/entities/client';

export function HomePageSkeleton() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <Skeleton className="md:w-1/4 w-2/5 md:h-9 h-8 rounded-lg" />
                <Skeleton className="md:w-1/4 w-2/5 h-10 rounded-medium" />
            </div>
            <div className="flex flex-col gap-4">
                {[...Array(10)].map((_, index) => (
                    <ClientCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
