import { Skeleton } from "@/components/ui/skeleton.tsx";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils.ts";

export function WikiArticleDetailSkeleton() {
    return (
        <div className="min-h-screen">
            {/* Header Area Simulation */}
            <header className="relative w-full">
                {/* Skeleton Cover Image */}
                <Skeleton className="w-full h-[25vh] md:h-[35vh] rounded-none" />

                <div className={cn(
                    "px-3 md:px-8 py-0 relative z-10",
                    "-mt-20 md:-mt-28"
                )}>
                    <div className="max-w-5xl mx-auto w-full">
                        <Link
                            to="/wiki"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors mb-6"
                        >
                            <ArrowLeftIcon className="size-3" weight="bold" />
                            Back to Archives
                        </Link>

                        {/* Skeleton Tags */}
                        <div className="flex gap-2 mb-3">
                            <Skeleton className="h-5 w-16 rounded-full" />
                            <Skeleton className="h-5 w-12 rounded-full" />
                        </div>

                        {/* Skeleton Title */}
                        <Skeleton className="h-10 md:h-14 w-3/4 mb-4" />

                        {/* Skeleton Summary */}
                        <div className="space-y-2 mb-6">
                            <Skeleton className="h-5 w-full max-w-2xl" />
                            <Skeleton className="h-5 w-4/5 max-w-xl" />
                        </div>

                        {/* Skeleton Meta Info */}
                        <div className="flex gap-5 pb-6 border-b border-border/50">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Body Area Simulation */}
            <div className="px-3 md:px-8 py-0 pb-20 sm:pb-0">
                <div className="max-w-5xl mx-auto mt-8">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-4/5" />
                        <Skeleton className="h-4 w-full" />

                        <Skeleton className="h-[300px] w-full mt-8 mb-8 rounded-lg" />

                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-[85%]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
