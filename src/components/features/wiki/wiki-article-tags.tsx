import { Badge } from "@/components/ui/badge";
import { TagIcon } from "@phosphor-icons/react";

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
