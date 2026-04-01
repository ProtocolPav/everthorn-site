import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    EyeIcon,
    CalendarBlankIcon,
    PencilSimpleIcon,
    LockIcon,
    ArrowLeftIcon,
    UserIcon,
    TagIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { WikiArticle } from "@/types/wiki";
import type { ThornyUser } from "@/types/thorny-user";

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
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

interface WikiArticleHeaderProps {
    article: WikiArticle;
}

export function WikiArticleHeader({ article }: WikiArticleHeaderProps) {
    const categoryColor = getCategoryColor(article.category);

    return (
        <header className="relative">
            {/* Cover image */}
            {article.cover_image && (
                <div className="relative w-full h-[30vh] md:h-[45vh] overflow-hidden">
                    <img
                        src={article.cover_image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
                </div>
            )}

            {/* Title area */}
            <div className={cn(
                "px-5 md:px-10",
                article.cover_image ? "-mt-24 md:-mt-32 relative z-10" : "pt-10"
            )}>
                {/* Back link */}
                <Link to="/wiki" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
                    <ArrowLeftIcon className="size-3" weight="bold" />
                    Back to Archives
                </Link>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge className={cn("border text-[10px] uppercase tracking-wider", categoryColor)}>
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

                <h1 className="font-minecraft-seven text-3xl md:text-5xl lg:text-6xl leading-tight mb-4">
                    {article.title}
                </h1>

                {article.summary && (
                    <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-6">
                        {article.summary}
                    </p>
                )}

                {/* Meta line */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground pb-6 border-b border-border/50">
                    <div className="flex items-center gap-1.5">
                        <UserIcon weight="duotone" className="size-3.5" />
                        <span className="font-medium text-foreground/80">
                            {article.author.profile?.character_name ?? article.author.username}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <CalendarBlankIcon weight="duotone" className="size-3.5" />
                        <span>{formatDate(article.created_at)}</span>
                    </div>
                    {article.updated_at !== article.created_at && (
                        <div className="flex items-center gap-1.5">
                            <PencilSimpleIcon weight="duotone" className="size-3.5" />
                            <span>Edited {formatDate(article.updated_at)}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <EyeIcon weight="duotone" className="size-3.5" />
                        <span>{article.view_count} views</span>
                    </div>
                </div>
            </div>
        </header>
    );
}

interface WikiArticleAuthorCardProps {
    author: ThornyUser;
}

export function WikiArticleAuthorCard({ author }: WikiArticleAuthorCardProps) {
    return (
        <Card className="bg-muted/30">
            <CardContent className="p-5">
                <div className="flex items-start gap-4">
                    {/* Character info */}
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Written by</p>
                        <h4 className="font-semibold text-sm mb-0.5">
                            {author.profile?.character_name ?? author.username}
                        </h4>
                        {author.profile?.character_role && (
                            <p className="text-xs text-muted-foreground mb-2">
                                {author.profile.character_role}
                                {author.profile.character_origin && ` — ${author.profile.character_origin}`}
                            </p>
                        )}
                        {author.profile?.lore && (
                            <p className="text-xs text-muted-foreground/80 line-clamp-3 leading-relaxed">
                                {author.profile.lore}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface WikiArticleTagsProps {
    tags: string[];
}

export function WikiArticleTags({ tags }: WikiArticleTagsProps) {
    if (!tags.length) return null;

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            <TagIcon weight="duotone" className="size-3 text-muted-foreground" />
            {tags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    className="text-[10px] px-2 py-0.5 font-normal"
                >
                    {tag}
                </Badge>
            ))}
        </div>
    );
}
