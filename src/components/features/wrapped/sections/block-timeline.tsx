// components/features/wrapped/sections/block-timeline.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { FavouriteBlock } from '@/types/wrapped';

interface BlockTimelineProps {
    timeline: FavouriteBlock[];
}

export function BlockTimeline({ timeline }: BlockTimelineProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Helper function to format block names
    const formatBlockName = (blockName: string): string => {
        const parts = blockName.split(':');
        const name = parts.length > 1 ? parts[parts.length - 1] : blockName;

        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    };

    const stats = useMemo(() => {
        if (!timeline || timeline.length === 0) {
            return { quartiles: [] };
        }

        // Sort by month number to ensure chronological order
        const sorted = [...timeline].sort((a, b) => a.month_number - b.month_number);

        // Get 4-5 evenly spaced entries
        const totalEntries = sorted.length;

        if (totalEntries <= 4) {
            return { quartiles: sorted };
        }

        const q1Index = Math.floor(totalEntries * 0.25);
        const q2Index = Math.floor(totalEntries * 0.5);
        const q3Index = Math.floor(totalEntries * 0.75);

        const quartileIndices = [0, q1Index, q2Index, q3Index, totalEntries - 1];
        const uniqueIndices = [...new Set(quartileIndices)];

        const quartiles = uniqueIndices.map(i => sorted[i]);

        return { quartiles };
    }, [timeline]);

    return (
        <section
            ref={ref}
            className="min-h-[70vh] flex items-center justify-center relative overflow-hidden px-4 py-12"
        >
            {/* Background */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-indigo-400 tracking-[0.3em] uppercase mb-4">
                        Evolution
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your Block Journey
                    </h2>
                </motion.div>

                {/* Intro text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-base md:text-lg font-minecraft-seven text-muted-foreground"
                >
                    Your favorite blocks changed throughout the year
                </motion.p>

                {/* Timeline of favorite blocks */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="max-w-3xl mx-auto space-y-6"
                >
                    {stats.quartiles.map((entry, index) => {
                        const isFirst = index === 0;
                        const isLast = index === stats.quartiles.length - 1;
                        const isPlaced = entry.category === 'placed';

                        return (
                            <motion.div
                                key={`${entry.month_number}-${entry.category}`}
                                initial={{ opacity: 0, x: -30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                transition={{ delay: 0.7 + (index * 0.15) }}
                                className="relative"
                            >
                                {/* Timeline connector */}
                                {!isLast && (
                                    <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-indigo-500/30 to-transparent" />
                                )}

                                <div className="flex gap-6 items-start">
                                    {/* Timeline dot */}
                                    <div className="relative flex-shrink-0 mt-2">
                                        <div className={`w-4 h-4 rounded-full border-2 ${
                                            isFirst || isLast
                                                ? 'border-indigo-400 bg-indigo-400/30'
                                                : 'border-indigo-500/50 bg-indigo-500/20'
                                        }`} />
                                        {(isFirst || isLast) && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full bg-indigo-400/30"
                                                animate={{
                                                    scale: [1, 1.5, 1],
                                                    opacity: [0.5, 0, 0.5]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-2 pb-4">
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-minecraft-ten text-indigo-400/80">
                                                {entry.month_name}
                                            </p>
                                            <span className={`text-xs font-minecraft-seven px-2 py-1 rounded ${
                                                isPlaced
                                                    ? 'bg-emerald-500/20 text-emerald-400'
                                                    : 'bg-orange-500/20 text-orange-400'
                                            }`}>
                                                {isPlaced ? 'Placed' : 'Mined'}
                                            </span>
                                        </div>
                                        <div className={`text-2xl md:text-3xl font-minecraft-seven ${
                                            isFirst || isLast
                                                ? 'bg-gradient-to-r from-indigo-400 to-violet-400 text-transparent bg-clip-text'
                                                : 'text-foreground/90'
                                        }`}>
                                            {formatBlockName(entry.favorite_block)}
                                        </div>
                                        <p className="text-xs md:text-sm font-minecraft-seven text-muted-foreground/60">
                                            {entry.count.toLocaleString()} times
                                        </p>
                                        {isFirst && (
                                            <p className="text-xs md:text-sm font-minecraft-seven text-muted-foreground/60 italic">
                                                Where your journey began
                                            </p>
                                        )}
                                        {isLast && (
                                            <p className="text-xs md:text-sm font-minecraft-seven text-muted-foreground/60 italic">
                                                Your latest favorite
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Closing message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.5 }}
                    className="text-center text-sm md:text-base font-minecraft-seven text-muted-foreground/60 italic"
                >
                    Your building style evolved all year long!
                </motion.p>
            </div>
        </section>
    );
}
