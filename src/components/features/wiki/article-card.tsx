import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarBlankIcon, UserIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { getCategoryBadge, getFallbackCoverStyle } from "@/config/wiki-options";
import {formatDate} from "date-fns";
import {PageOut} from "@/api/nexuscore/model";

interface WikiArticleCardProps {
    article: PageOut;
    className?: string;
}

export function WikiArticleCard({ article, className }: WikiArticleCardProps) {
    const categoryBadge = getCategoryBadge(article.category);

    return (
        <Link to="/wiki/$slug" params={{ slug: article.slug }} className="block h-full">
            <Card
                className={cn(
                    "group relative overflow-hidden bg-black border-0 p-0 cursor-pointer",
                    "aspect-4/3 h-full",
                    className
                )}
            >
                {/* Cover */}
                {article.cover_image ? (
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="object-cover w-full h-full group-hover:scale-[1.02] transition-transform duration-170 ease-out"
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={getFallbackCoverStyle(article.slug, article.category)}
                    />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category + lock badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge className={cn("border text-[9px] uppercase tracking-wider backdrop-blur-sm", categoryBadge)}>
                        {article.category}
                    </Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-almendra font-normal text-xl leading-snug text-white mb-1.5 line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
                        {article.title}
                    </h3>

                    <p className="text-xs text-white/70 line-clamp-1 leading-relaxed mb-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                        {article.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/50">
                            <span className="flex gap-1 items-center font-medium text-white/65 truncate mr-2">
                                <UserIcon weight="duotone" className="size-2.5"/>
                                {article.author.username}
                            </span>
                        <div className="flex items-center gap-2.5 shrink-0">
                                <span className="flex items-center gap-1">
                                    <CalendarBlankIcon weight="duotone" className="size-2.5" />
                                    {formatDate(article.created_at, 'd MMM, y')}
                                </span>
                            {/*<span className="flex items-center gap-1">*/}
                            {/*    <EyeIcon weight="duotone" className="size-2.5" />*/}
                            {/*    0*/}
                            {/*    /!*{formatViewCount(article.view_count)}*!/*/}
                            {/*</span>*/}
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    )
}

export function WikiArticleCardSkeleton({ variant = "default", className }: { variant?: "default" | "compact"; className?: string }) {
    if (variant === "compact") {
        return (
            <Card className="flex gap-3 p-2.5">
                <Skeleton className="w-14 h-14 rounded flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </Card>
        );
    }

    return <Skeleton className={cn("aspect-[3/2] w-full rounded-xl", className)} />;
}
