import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge.tsx";
import {
    CalendarBlankIcon,
    PencilSimpleIcon,
    LockIcon,
    ArrowLeftIcon,
    UserIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils.ts";
import { getCategoryBadge, getFallbackCoverStyle } from "@/config/wiki-options.ts";
import { formatDate } from "date-fns";
import {PageOut} from "@/api/nexuscore/model";

interface WikiArticleHeaderProps {
    article: PageOut
}

export function WikiArticleHeader({ article }: WikiArticleHeaderProps) {
    const categoryBadge = getCategoryBadge(article.category);

    return (
        <header className="relative">
            {/* Cover image or fallback */}
            {article.cover_image ? (
                <div className="relative w-full h-[25vh] md:h-[35vh] overflow-hidden">
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 bg-linear-to-r from-background/30 to-transparent" />
                </div>
            ) : (
                <div
                    className="relative w-full h-[15vh] md:h-[22vh]"
                    style={getFallbackCoverStyle(article.slug, article.category)}
                >
                    <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-transparent" />
                </div>
            )}

            {/* Title area */}
            <div className={cn(
                "px-3 md:px-8 py-0 relative z-10",
                article.cover_image ? "-mt-20 md:-mt-28" : "-mt-10 md:-mt-14"
            )}>
                <div className="max-w-5xl mx-auto w-full">
                    <Link
                        to="/wiki"
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
                    >
                        <ArrowLeftIcon className="size-3" weight="bold" />
                        Back to Archives
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={cn("border text-[10px] uppercase tracking-wider", categoryBadge)}>
                            {article.category}
                        </Badge>
                        {article.locked && (
                            <Badge variant="outline" className="text-[10px] gap-1">
                                <LockIcon weight="bold" className="size-2.5" />
                                Locked
                            </Badge>
                        )}
                        {!article.published && (
                            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-600 dark:text-amber-400">
                                Draft
                            </Badge>
                        )}
                    </div>

                    <h1 className="font-almendra font-normal text-3xl md:text-5xl lg:text-6xl leading-tight mb-4">
                        {article.title}
                    </h1>

                    {article.summary && (
                        <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
                            {article.summary}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground pb-6 border-b border-border/50">
                        <div className="flex items-center gap-1.5">
                            <UserIcon weight="duotone" className="size-3.5" />
                            <span className="font-medium text-foreground/80">
                                {article.author.username}
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <CalendarBlankIcon weight="duotone" className="size-3.5" />
                            <span>{formatDate(article.created_at, 'd MMM, y')}</span>
                        </div>
                        {article.updated_at !== article.created_at && (
                            <div className="flex items-center gap-1.5">
                                <PencilSimpleIcon weight="duotone" className="size-3.5" />
                                <span>Edited {formatDate(article.updated_at, 'd MMM, y')}</span>
                            </div>
                        )}
                        {/*<div className="flex items-center gap-1.5">*/}
                        {/*    <EyeIcon weight="duotone" className="size-3.5" />*/}
                        {/*    <span>{article.view_count} views</span>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        </header>
    );
}
