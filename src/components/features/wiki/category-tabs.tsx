import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getVisibleCategories } from "@/config/wiki-options";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import {Button} from "@/components/ui/button.tsx";

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

    // Handle clicking the arrows
    const scrollByAmount = (direction: "left" | "right") => {
        if (!scrollContainerRef.current) return;

        // Scroll by roughly 60% of the container's width per click
        // to ensure the user doesn't lose context of where they were
        const scrollAmount = scrollContainerRef.current.clientWidth * 0.6;

        scrollContainerRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth"
        });
    };

    return (
        <div className="relative w-full md:w-auto md:max-w-xl lg:max-w-3xl flex items-center">

            {/* Left Scroll Button & Fade Mask */}
            <AnimatePresence>
                {canScrollLeft && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-0 bottom-0 z-20 flex items-center pr-8 bg-gradient-to-r from-background via-background to-transparent"
                    >
                        <Button
                            onClick={() => scrollByAmount("left")}
                            size={'icon-sm'}
                            variant={'ghost'}
                            aria-label="Scroll left"
                        >
                            <CaretLeftIcon weight="bold" className="size-3.5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Scrollable Track */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScroll}
                className="overflow-x-auto no-scrollbar scroll-smooth relative w-full"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/*
                    Added px-4 so the tabs have room to breathe and don't immediately
                    collide with the absolute-positioned arrow buttons
                */}
                <div className="flex items-center gap-4 px-2 md:px-4 w-max">
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.slug;
                        const Icon = cat.icon!;
                        const count = articleCounts?.[cat.slug];

                        return (
                            <button
                                key={cat.slug}
                                onClick={() => onCategoryChange(cat.slug)}
                                className={cn(
                                    "relative flex items-center gap-2 pb-2.5 pt-1 text-sm font-medium transition-colors cursor-pointer outline-none group select-none",
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

            {/* Right Scroll Button & Fade Mask */}
            <AnimatePresence>
                {canScrollRight && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-0 bottom-0 z-20 flex items-center pl-8 bg-linear-to-l from-background via-background to-transparent"
                    >
                        <Button
                            onClick={() => scrollByAmount("right")}
                            size={'icon-sm'}
                            variant={'ghost'}
                            aria-label="Scroll right"
                        >
                            <CaretRightIcon weight="bold" className="size-3.5" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
