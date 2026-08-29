import { useEffect, useRef, useState } from "react";

export function useScrollVisibility(hideThreshold: number = 120, showThreshold: number = 12) {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        lastScrollY.current = window.scrollY;
        let ticking = false;

        const update = () => {
            const currentY = window.scrollY;
            const delta = currentY - lastScrollY.current;

            if (currentY <= 10) {
                setVisible(true);
                lastScrollY.current = currentY;
            } else if (delta > hideThreshold) {
                // Long scroll down — hide
                setVisible(false);
                lastScrollY.current = currentY;
            } else if (delta < -showThreshold) {
                // Small scroll up — show immediately
                setVisible(true);
                lastScrollY.current = currentY;
            } else if (delta < 0) {
                // Tiny upward nudge should still reveal — but don't reset lastScrollY yet,
                // so the next down-scroll still needs a long distance to hide again
                setVisible(true);
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