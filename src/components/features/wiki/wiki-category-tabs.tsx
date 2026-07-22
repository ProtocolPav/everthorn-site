import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getVisibleCategories } from "@/config/wiki-options";
import { motion } from "motion/react";
import { useRef, useEffect, useState } from "react";

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
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (!scrollContainerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, [categories]);

    return (
        <div className="relative w-full md:w-auto">
            {/* Left Fade Mask */}
            <div
                className={cn(
                    "absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none transition-opacity duration-300",
                    canScrollLeft ? "opacity-100" : "opacity-0"
                )}
            />

            {/* Scrollable Track */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="overflow-x-auto no-scrollbar scroll-smooth relative"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* Removed the heavy grey background border track */}
                <div className="flex items-center gap-4 px-1 w-max">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        const Icon = cat.icon!;
                        const count = articleCounts?.[cat.slug];

                        return (
                            <button
                                key={cat.slug}
                                onClick={() => onCategoryChange(cat.slug)}
                                className={cn(
                                    "relative flex items-center gap-2 pb-2.5 pt-1 text-sm font-medium transition-colors cursor-pointer outline-none group",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Floating Underline Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="wiki-category-underline"
                                        className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary rounded-t-full"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                                    />
                                )}

                                <Icon
                                    weight={isActive ? "fill" : "regular"}
                                    className={cn(
                                        "size-4 transition-transform duration-300",
                                        isActive ? "text-primary scale-110" : "group-hover:scale-110"
                                    )}
                                />

                                <span>{cat.label}</span>

                                {count !== undefined && count > 0 && (
                                    <Badge
                                        variant="secondary"
                                        className={cn(
                                            "ml-0.5 px-1.5 py-0 text-[10px] font-bold min-w-4 h-4 transition-colors",
                                            isActive
                                                ? "bg-primary/15 text-primary"
                                                : "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {count}
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Right Fade Mask */}
            <div
                className={cn(
                    "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none transition-opacity duration-300",
                    canScrollRight ? "opacity-100" : "opacity-0"
                )}
            />
        </div>
    );
}
