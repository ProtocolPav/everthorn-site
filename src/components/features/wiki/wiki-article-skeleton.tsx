import { Skeleton } from "@/components/ui/skeleton";

export function WikiArticleDetailSkeleton() {
    return (
        <div className="min-h-screen">
            <Skeleton className="w-full h-[35vh]" />

            <div className="px-5 md:px-10 -mt-16 relative z-10">
                <Skeleton className="h-3 w-24 mb-6" />
                <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <Skeleton className="h-10 w-3/4 mb-3" />
                <Skeleton className="h-5 w-1/2 mb-6" />
                <div className="flex gap-5 pb-6 border-b border-border/50">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                </div>
            </div>

            <div className="px-5 md:px-10 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 max-w-6xl mx-auto">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-lg" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                        <Skeleton className="h-20 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
}
