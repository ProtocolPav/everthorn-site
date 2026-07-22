import { useEffect, useRef, useState } from "react";

export function useScrollVisibility(scroll_threshold: number = 24) {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        lastScrollY.current = window.scrollY;
        let ticking = false;

        const update = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY <= 0) {
                setVisible(true);
            } else if (Math.abs(delta) >= scroll_threshold) {
                setVisible(delta < 0);
                lastScrollY.current = currentY;
            }

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return visible;
}