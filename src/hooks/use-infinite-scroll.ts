// hooks/use-infinite-scroll.ts
import { useEffect, useRef } from 'react';

export function useInfiniteScroll(
    onLoadMore: () => void,
    isLoading: boolean,
    hasMore: boolean,
) {
    const ref = useRef<HTMLTableRowElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isLoading) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [onLoadMore, isLoading, hasMore]);

    return ref;
}