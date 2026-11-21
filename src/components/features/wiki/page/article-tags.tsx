import { Badge } from "@/components/ui/badge.tsx";
import { TagIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";

interface WikiArticleTagsProps {
    tags: string[];
}

export function WikiArticleTags({ tags }: WikiArticleTagsProps) {
    if (!tags?.length) return null;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1 text-muted-foreground">
                <TagIcon weight="duotone" className="size-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Tags:</span>
            </div>

            {tags.map((tag) => (
                <Badge
                    key={tag}
                    variant="secondary"
                    asChild
                    className="text-[11px] px-2.5 py-0.5 font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer border border-border/50 shadow-sm"
                >
                    {/* Make them clickable to search for that tag! */}
                    <Link
                        to="/wiki"
                        search={{ tags: [tag] }}
                    >
                        {tag}
                    </Link>
                </Badge>
            ))}
        </div>
    );
}
