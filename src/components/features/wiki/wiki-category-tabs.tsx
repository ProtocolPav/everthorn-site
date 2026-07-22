import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getVisibleCategories } from "@/config/wiki-options";
import { motion } from "motion/react";

interface WikiCategoryTabsProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    articleCounts?: Record<string, number>;
    hasMember?: boolean;
}

export function WikiCategoryTabs({
                                     activeCategory,
                                     onCategoryChange,
                                     articleCounts,
                                     hasMember = false,
                                 }: WikiCategoryTabsProps) {
    const categories = getVisibleCategories(true, true, hasMember);

    return (
        // The container acts as the track for the pills
        <div className="flex items-center gap-1 p-1 bg-muted/40 border border-input/40 rounded-lg w-max">
            {categories.map((cat) => {
                const isActive = activeCategory === cat.slug;
                const Icon = cat.icon!;
                const count = articleCounts?.[cat.slug];

                return (
                    <button
                        key={cat.slug}
                        onClick={() => onCategoryChange(cat.slug)}
                        className={cn(
                            "relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer outline-none",
                            isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {/* Smooth sliding background indicator */}
                        {isActive && (
                            <motion.div
                                layoutId="wiki-category-indicator"
                                className="absolute inset-0 bg-background rounded-md shadow-sm border border-border/50"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                            />
                        )}

                        {/* Content (Z-indexed above the animated background) */}
                        <span className="relative z-10 flex items-center gap-1.5">
                            <Icon
                                weight={isActive ? "fill" : "regular"}
                                className={cn(
                                    "size-3.5 transition-colors",
                                    isActive && "text-primary"
                                )}
                            />
                            {cat.label}
                        </span>

                        {count !== undefined && count > 0 && (
                            <Badge
                                variant="secondary"
                                className={cn(
                                    "relative z-10 ml-0.5 px-1.5 py-0 text-[9px] font-bold min-w-4 h-4 transition-colors",
                                    isActive
                                        ? "bg-muted text-foreground"
                                        : "bg-muted/50 text-muted-foreground"
                                )}
                            >
                                {count}
                            </Badge>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
