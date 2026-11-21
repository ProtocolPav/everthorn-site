import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface QuestCardSkeletonProps {
    className?: string
}

/** Mirrors QuestCard's structure so the loading grid matches the real card's height. */
export function QuestCardSkeleton({ className }: QuestCardSkeletonProps) {
    return (
        <Card className={cn('p-0 overflow-hidden h-full flex flex-col', className)}>
            <div className="px-2.5 py-1.5 bg-muted/30 border-b flex items-center gap-1.5 shrink-0">
                <Skeleton className="h-4 w-14 rounded-md" />
                <Skeleton className="h-4 w-20 rounded-md" />
            </div>

            <CardContent className="p-2.5 flex flex-col flex-1">
                <Skeleton className="h-4 w-3/4" />
                <div className="my-2 flex flex-col gap-1">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-5/6" />
                </div>

                <div className="flex-1" />

                <div className="mb-2 flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-16 rounded-md" />
                    <Skeleton className="h-3 w-14" />
                </div>

                <Skeleton className="mb-2 h-6 w-full rounded-md" />

                <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-1.5">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-6 w-28 rounded-md" />
                </div>
            </CardContent>
        </Card>
    )
}
