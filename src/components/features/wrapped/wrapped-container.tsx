// features/wrapped/wrapped-container.tsx
"use client"

import { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

interface WrappedContainerProps {
    children: ReactNode;
}

export function WrappedContainer({ children }: WrappedContainerProps) {
    // Track scroll progress for potential progress bar or effects
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="relative w-full bg-background">
            {/* Optional: Progress bar at top */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
                style={{ scaleX }}
            />

            {/* Main scrolling content */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
