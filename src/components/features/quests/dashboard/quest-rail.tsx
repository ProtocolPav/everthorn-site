import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
    title: string;
    count: number;
    children?: ReactNode;
}

/** Shared eyebrow for every dashboard section so they read as one system. */
export function QuestSectionHeader({ title, count, children }: SectionHeaderProps) {
    return (
        <div className="flex min-h-8 items-center gap-2">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
            <span className="text-[11px] tabular-nums text-muted-foreground/70">{count}</span>
            {children && <div className="ml-auto flex items-center gap-1">{children}</div>}
        </div>
    );
}

interface QuestRailProps {
    title: string;
    count: number;
    children: ReactNode;
}

/** Horizontal snap-scroller. Arrows only appear when there is something to scroll to. */
export function QuestRail({ title, count, children }: QuestRailProps) {
    const ref = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [edge, setEdge] = useState({ start: true, end: false });

    const childrenArray = Array.isArray(children) ? children : [children];
    const visible = childrenArray.slice(0, visibleCount);

    const maybeMore = visibleCount < childrenArray.length;

    const measure = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        const isAtStart = el.scrollLeft <= 2;
        const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 2;
        setEdge({ start: isAtStart, end: isAtEnd && !maybeMore });
    }, [maybeMore]);

    useEffect(() => {
        measure();
    }, [measure, visibleCount, childrenArray.length]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new ResizeObserver(measure);
        observer.observe(el);
        el.addEventListener("scroll", measure, { passive: true });
        return () => {
            observer.disconnect();
            el.removeEventListener("scroll", measure);
        };
    }, [measure]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const io = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    setVisibleCount((v) => Math.min(v + 6, childrenArray.length));
                }
            },
            { root: ref.current, rootMargin: "200px 0px 0px 0px", threshold: 0.01 }
        );
        io.observe(sentinel);
        return () => io.disconnect();
    }, [childrenArray.length]);

    useEffect(() => {
        setVisibleCount(6);
    }, [childrenArray.length]);

    function scrollBy(direction: 1 | -1) {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const el = ref.current;
        if (!el) return;
        el.scrollBy({ left: direction * 320, behavior: reduce ? "auto" : "smooth" });
        if (direction === 1 && maybeMore && el.scrollLeft + el.clientWidth >= el.scrollWidth - 400) {
            setVisibleCount((v) => Math.min(v + 6, childrenArray.length));
        }
    }

    const overflowing = maybeMore || !(edge.start && edge.end);

    return (
        <section className="flex flex-col gap-2">
            <QuestSectionHeader title={title} count={count}>
                {overflowing && (
                    <>
                        <Button variant="ghost" size="icon-sm" disabled={edge.start} onClick={() => scrollBy(-1)}>
                            <CaretLeftIcon />
                            <span className="sr-only">Scroll {title} left</span>
                        </Button>
                        <Button variant="ghost" size="icon-sm" disabled={edge.end && !maybeMore} onClick={() => scrollBy(1)}>
                            <CaretRightIcon />
                            <span className="sr-only">Scroll {title} right</span>
                        </Button>
                    </>
                )}
            </QuestSectionHeader>
            <div
                ref={ref}
                className={cn(
                    "-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2 pt-1 scrollbar-hide",
                    "scroll-px-1"
                )}
            >
                {visible}
                {maybeMore && <div ref={sentinelRef} className="h-px w-[1px] shrink-0 snap-align-none" aria-hidden="true" />}
            </div>
        </section>
    );
}
