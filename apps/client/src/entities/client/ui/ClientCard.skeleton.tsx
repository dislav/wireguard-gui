import { Card, CardBody, Skeleton } from '@nextui-org/react';

export default function ClientCardSkeleton() {
    return (
        <Card>
            <CardBody>
                <div className="flex justify-between">
                    <div className="md:w-1/3 w-3/4 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-10 rounded-full" />
                            <div className="flex-1 flex flex-col gap-1">
                                <Skeleton className="w-2/4 h-2.5 rounded-lg" />
                                <Skeleton className="w-2/3 h-2.5 rounded-lg" />
                            </div>
                        </div>
                        <div className="flex md:flex-row flex-col md:items-center gap-2">
                            <Skeleton className="w-2/3 h-3 rounded-lg" />
                            <Skeleton className="w-2/4 h-3 rounded-lg" />
                            <Skeleton className="w-1/3 h-3 rounded-lg" />
                        </div>
                    </div>
                    <div className="flex flex-col justify-between gap-2">
                        <Skeleton className="size-10 rounded-medium" />
                        <Skeleton className="w-10 h-6 rounded-medium" />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
