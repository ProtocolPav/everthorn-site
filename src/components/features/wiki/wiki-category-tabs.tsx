import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WIKI_CATEGORIES } from "@/config/wiki-options";

interface WikiCategoryTabsProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    articleCounts?: Record<string, number>;
}

export function WikiCategoryTabs({ activeCategory, onCategoryChange, articleCounts }: WikiCategoryTabsProps) {
    return (
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-1.5 pb-1">
                {WIKI_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.slug;
                    const Icon = cat.icon;
                    const count = articleCounts?.[cat.slug];

                    return (
                        <button
                            key={cat.slug}
                            onClick={() => onCategoryChange(cat.slug)}
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap border",
                                isActive
                                    ? "bg-foreground text-background border-foreground shadow-sm"
                                    : "bg-transparent text-muted-foreground border-transparent hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon
                                weight={isActive ? "fill" : "regular"}
                                className="size-3.5"
                            />
                            {cat.label}
                            {count !== undefined && count > 0 && (
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "ml-0.5 px-1.5 py-0 text-[9px] font-bold min-w-4 h-4",
                                        isActive
                                            ? "bg-background/20 text-background"
                                            : "bg-muted"
                                    )}
                                >
                                    {count}
                                </Badge>
                            )}
                        </button>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
    );
}
