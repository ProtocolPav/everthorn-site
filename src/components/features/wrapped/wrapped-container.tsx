// features/wrapped/wrapped-container.tsx
"use client"

import { ReactNode } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { X } from 'lucide-react';

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
            {/* Progress bar at top */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
                style={{ scaleX }}
            />

            {/* Close button */}
            <motion.a
                href="/home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center border-2 border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/50 hover:bg-card transition-all group"
                style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
                aria-label="Close and go home"
            >
                {/* Pixel corners */}
                <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-primary/50 transition-colors" />
                <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-primary/50 transition-colors" />
                <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-primary/50 transition-colors" />
                <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-primary/50 transition-colors" />

                <X className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </motion.a>

            {/* Main scrolling content */}
            <div className="w-full">
                {children}
            </div>
        </div>
    );
}
