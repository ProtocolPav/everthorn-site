import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {EyeIcon, CalendarBlankIcon, UserIcon} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { WikiArticleStub } from "@/types/wiki";

const CATEGORY_COLORS: Record<string, string> = {
    lore: "bg-amber-900/80 text-amber-200 border-amber-500/30 backdrop-blur-sm",
    history: "bg-slate-800/80 text-blue-200 border-blue-400/30 backdrop-blur-sm",
    projects: "bg-emerald-900/80 text-emerald-200 border-emerald-400/30 backdrop-blur-sm",
    guides: "bg-violet-900/80 text-violet-200 border-violet-400/30 backdrop-blur-sm",
    characters: "bg-rose-900/80 text-rose-200 border-rose-400/30 backdrop-blur-sm",
    locations: "bg-cyan-900/80 text-cyan-200 border-cyan-400/30 backdrop-blur-sm",
    events: "bg-pink-900/80 text-pink-200 border-pink-400/30 backdrop-blur-sm",
    default: "bg-black/60 text-white/80 border-white/20 backdrop-blur-sm",
};

const CATEGORY_HUES: Record<string, number> = {
    lore: 38,
    history: 220,
    projects: 155,
    guides: 270,
    characters: 340,
    locations: 185,
    events: 310,
};

function getCategoryColor(category: string) {
    return CATEGORY_COLORS[category.toLowerCase()] ?? CATEGORY_COLORS.default;
}

function getFallbackCoverStyle(pageId: string, category: string) {
    const hue = CATEGORY_HUES[category.toLowerCase()] ?? 240;
    let hash = 0;
    for (let i = 0; i < pageId.length; i++) {
        hash = ((hash << 5) - hash + pageId.charCodeAt(i)) | 0;
    }
    const angle = (Math.abs(hash) % 60) + 120;
    const shift = (Math.abs(hash) % 20) - 10;

    return {
        background: `
      url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E"),
      linear-gradient(${angle}deg, hsl(${hue + shift}, 45%, 22%) 0%, hsl(${hue}, 55%, 16%) 50%, hsl(${hue - shift}, 50%, 12%) 100%)`,
        backgroundBlendMode: "overlay, normal" as const,
    };
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
    variant?: "default" | "compact";
    className?: string;
}

export function WikiArticleCard({ article, variant = "default", className }: WikiArticleCardProps) {
    const categoryColor = getCategoryColor(article.category);

    if (variant === "compact") {
        return (
            <Link to="/wiki/$slug" params={{ slug: article.page_id }} className="block">
                <Card
                    className={cn(
                        "group flex gap-3 p-2.5 cursor-pointer transition-colors hover:border-foreground/15",
                        className
                    )}
                >
                    <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
                        {article.cover_image ? (
                            <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        ) : (
                            <div
                                className="w-full h-full"
                                style={getFallbackCoverStyle(article.page_id, article.category)}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
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

    // Default — full-bleed cover with overlaid text
    return (
        <Link to="/wiki/$slug" params={{ slug: article.page_id }} className="block h-full">
            <Card
                className={cn(
                    "group relative overflow-hidden border-0 p-0 cursor-pointer",
                    "aspect-3/2 h-full",
                    className
                )}
            >
                {/* Cover */}
                {article.cover_image ? (
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
                    />
                ) : (
                    <div
                        className="absolute inset-0"
                        style={getFallbackCoverStyle(article.page_id, article.category)}
                    />
                )}

                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Category + lock badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <Badge className={cn("border text-[9px] uppercase tracking-wider backdrop-blur-sm", categoryColor)}>
                        {article.category}
                    </Badge>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-almendra text-xl leading-snug text-white mb-1.5 line-clamp-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]">
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
