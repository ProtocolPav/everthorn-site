import { Skeleton } from "@/components/ui/skeleton";

export function WikiArticleDetailSkeleton() {
    return (
        <div className="min-h-screen pb-20">
            {/* Hero Image */}
            <Skeleton className="w-full h-[35vh] md:h-[40vh] rounded-none" />

            {/* Main Article Container */}
            {/* Added bg-background and rounded-t-2xl so the negative margin overlaps the hero cleanly */}
            <div className="max-w-7xl mx-auto px-5 md:px-10 relative z-10 -mt-12 md:-mt-16">
                <div className="bg-background rounded-t-2xl pt-8 md:pt-10 space-y-6">

                    {/* Header Section */}
                    <div>
                        {/* Tags / Badges */}
                        <div className="flex gap-2 mb-4">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>

                        {/* Title */}
                        <Skeleton className="h-10 md:h-14 w-[85%] md:w-2/3 mb-4" />

                        {/* Subtitle / Excerpt */}
                        <Skeleton className="h-5 w-[90%] md:w-1/2 mb-8" />

                        {/* Meta Lockup (Author avatar, name, date) */}
                        <div className="flex items-center gap-4 pb-6 border-b border-border/50">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-20" />
                            </div>
                        </div>
                    </div>

                    {/* Main Grid: Content + Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 pt-6">

                        {/* Left: Article Content */}
                        <div className="space-y-10">
                            {/* Paragraph 1 */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[98%]" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[85%]" />
                            </div>

                            {/* Heading 2 + Paragraph 2 */}
                            <div className="space-y-4">
                                <Skeleton className="h-8 w-[40%] mb-2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[95%]" />
                                <Skeleton className="h-4 w-[90%]" />
                                <Skeleton className="h-4 w-[65%]" />
                            </div>

                            {/* Inline Content Image placeholder */}
                            <Skeleton className="h-[350px] w-full rounded-xl" />

                            {/* Paragraph 3 */}
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-[96%]" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-[75%]" />
                            </div>
                        </div>

                        {/* Right: Sidebar / Infobox */}
                        <div className="space-y-8 hidden lg:block">

                            {/* Wiki Infobox Simulation */}
                            <div className="border border-border/50 rounded-xl p-5 space-y-5 bg-muted/20">
                                <Skeleton className="h-6 w-1/2 mx-auto" />
                                <Skeleton className="h-[200px] w-full rounded-lg" />

                                <div className="space-y-4 pt-2 border-t border-border/50 mt-4">
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/3" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-2/5" />
                                        <Skeleton className="h-4 w-1/3" />
                                    </div>
                                </div>
                            </div>

                            {/* Table of Contents Simulation */}
                            <div className="space-y-4 sticky top-24">
                                <Skeleton className="h-5 w-2/3 mb-2" />
                                <Skeleton className="h-3 w-1/2" />
                                <Skeleton className="h-3 w-2/3 ml-4" />
                                <Skeleton className="h-3 w-1/2 ml-4" />
                                <Skeleton className="h-3 w-3/5" />
                                <Skeleton className="h-3 w-2/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
