import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EyeIcon, CalendarBlankIcon, LockIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { WikiArticleStub } from "@/types/wiki";

const CATEGORY_COLORS: Record<string, string> = {
    lore: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20",
    history: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20",
    projects: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    guides: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/20",
    characters: "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/20",
    locations: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    events: "bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/20",
    default: "bg-muted text-muted-foreground border-border",
};

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.default;
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function formatViewCount(count: number) {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
}

interface WikiArticleCardProps {
    article: WikiArticleStub;
    variant?: "default" | "featured" | "compact";
    className?: string;
}

export function WikiArticleCard({ article, variant = "default", className }: WikiArticleCardProps) {
    const categoryColor = getCategoryColor(article.category);

    if (variant === "featured") {
        return (
            <Link to="/wiki/$slug" params={{ slug: article.page_id }} className="block">
                <Card
                    className={cn(
                        "group relative overflow-hidden border-0 p-0 cursor-pointer",
                        "aspect-[16/9] md:aspect-[21/9]",
                        className
                    )}
                >
                    {article.cover_image ? (
                        <img
                            src={article.cover_image}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-secondary" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className={cn("border text-[10px] uppercase tracking-wider", categoryColor)}>
                                {article.category}
                            </Badge>
                            {article.locked && (
                                <Badge variant="outline" className="border-white/20 text-white/80 text-[10px]">
                                    <LockIcon weight="bold" className="size-2.5" />
                                    Locked
                                </Badge>
                            )}
                        </div>

                        <h2 className="font-minecraft-seven text-xl md:text-3xl text-white leading-tight mb-2 line-clamp-2">
                            {article.title}
                        </h2>

                        <p className="text-sm md:text-base text-white/75 line-clamp-2 max-w-2xl leading-relaxed mb-4">
                            {article.summary}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-white/60">
                            <span className="font-medium text-white/80">
                                {article.author.profile?.character_name ?? article.author.username}
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarBlankIcon weight="duotone" className="size-3" />
                                {formatDate(article.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                                <EyeIcon weight="duotone" className="size-3" />
                                {formatViewCount(article.view_count)}
                            </span>
                        </div>
                    </div>
                </Card>
            </Link>
        );
    }

    if (variant === "compact") {
        return (
            <Link to="/wiki/$slug" params={{ slug: article.page_id }} className="block">
                <Card
                    className={cn(
                        "group flex gap-4 p-3 cursor-pointer transition-colors hover:border-foreground/15",
                        className
                    )}
                >
                    {article.cover_image && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>
                    )}

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className={cn("border text-[9px] uppercase tracking-wider", categoryColor)}>
                                {article.category}
                            </Badge>
                        </div>
                        <h4 className="text-sm font-semibold leading-tight line-clamp-1 group-hover:text-foreground/80 transition-colors">
                            {article.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {article.summary}
                        </p>
                    </div>
                </Card>
            </Link>
        );
    }

    // Default card
    return (
        <Link to="/wiki/$slug" params={{ slug: article.page_id }} className="block">
            <Card
                className={cn(
                    "group relative overflow-hidden border-0 p-0 cursor-pointer",
                    "aspect-[4/5]",
                    className
                )}
            >
                {article.cover_image ? (
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/60 to-secondary/40" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute top-3 left-3">
                    <Badge className={cn("border text-[9px] uppercase tracking-wider backdrop-blur-sm", categoryColor)}>
                        {article.category}
                    </Badge>
                </div>

                {article.locked && (
                    <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="border-white/20 text-white/70 backdrop-blur-sm text-[9px]">
                            <LockIcon weight="bold" className="size-2.5" />
                        </Badge>
                    </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base font-semibold text-white leading-tight mb-1.5 line-clamp-2 font-minecraft-seven">
                        {article.title}
                    </h3>

                    <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3">
                        {article.summary}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-white/50">
                        <span className="font-medium text-white/70">
                            {article.author.profile?.character_name ?? article.author.username}
                        </span>
                        <div className="flex items-center gap-2.5">
                            <span className="flex items-center gap-1">
                                <CalendarBlankIcon weight="duotone" className="size-2.5" />
                                {formatDate(article.created_at)}
                            </span>
                            <span className="flex items-center gap-1">
                                <EyeIcon weight="duotone" className="size-2.5" />
                                {formatViewCount(article.view_count)}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export function WikiArticleCardSkeleton({ variant = "default" }: { variant?: "default" | "featured" | "compact" }) {
    if (variant === "featured") {
        return <Skeleton className="aspect-[21/9] w-full rounded-xl" />;
    }

    if (variant === "compact") {
        return (
            <Card className="flex gap-4 p-3">
                <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-16" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                </div>
            </Card>
        );
    }

    return <Skeleton className="aspect-[4/5] w-full rounded-xl" />;
}
