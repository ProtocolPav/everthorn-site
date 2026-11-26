import { useEffect, useRef } from "react";

/**
 * Loads more as the returned sentinel approaches the bottom of the nearest
 * ScrollArea viewport (or the window). `trigger` should change whenever the
 * rendered list grows, so a short viewport keeps filling instead of stalling.
 */
export function useInfiniteScroll(
    hasMore: boolean,
    onLoadMore: () => void,
    trigger: unknown,
    threshold = 600,
) {
    const sentinelRef = useRef<HTMLDivElement | null>(null);
    const callbackRef = useRef(onLoadMore);

    useEffect(() => {
        callbackRef.current = onLoadMore;
    }, [onLoadMore]);

    useEffect(() => {
        if (!hasMore) return;
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const root = sentinel.closest('[data-slot="scroll-area-viewport"]') as HTMLElement | null;

        function check() {
            const node = sentinelRef.current;
            if (!node) return;
            const viewportBottom = root ? root.getBoundingClientRect().bottom : window.innerHeight;
            if (node.getBoundingClientRect().top - viewportBottom <= threshold) {
                callbackRef.current();
            }
        }

        const target: HTMLElement | Window = root ?? window;
        target.addEventListener("scroll", check, { passive: true });
        window.addEventListener("resize", check);
        check();

        return () => {
            target.removeEventListener("scroll", check);
            window.removeEventListener("resize", check);
        };
    }, [hasMore, threshold, trigger]);

    return sentinelRef;
}
