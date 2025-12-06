// components/features/wrapped/sections/total-playtime.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { PlaytimeMetrics } from '@/types/wrapped';

interface TotalPlaytimeProps {
    data: PlaytimeMetrics;
}

export function TotalPlaytime({ data }: TotalPlaytimeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const totalHours = Math.round(data.total_seconds / 3600);
        const totalDays = Math.round(data.total_seconds / 86400);
        const totalWeeks = Math.round(data.total_seconds / 604800);
        const percentage = Math.round(Math.min((totalHours / 8760) * 100, 100));

        return {
            hours: totalHours,
            days: totalDays,
            weeks: totalWeeks,
            percentage: percentage,
        };
    }, [data.total_seconds]);

    return (
        <section
            ref={ref}
            className="min-h-[70vh] flex items-center justify-center relative overflow-hidden px-4 py-12"
        >
            {/* Background decoration */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-blue-400 tracking-[0.3em] uppercase mb-4">
                        Time Played
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        In 2025, you spent...
                    </h2>
                </motion.div>

                {/* Big number - total hours */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 100
                    }}
                    className="text-center space-y-6"
                >
                    <div className="relative">
                        {/* The actual number */}
                        <motion.div
                            className="text-7xl md:text-8xl lg:text-9xl font-minecraft-seven bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.4 }}
                        >
                            {stats.hours.toLocaleString()}
                        </motion.div>

                        {/* Glow behind */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6 }}
                        className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground"
                    >
                        HOURS ON EVERTHORN
                    </motion.p>
                </motion.div>

                {/* Additional stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="space-y-3"
                >
                    <p className="text-center text-sm md:text-base font-minecraft-seven text-muted-foreground">
                        That's...
                    </p>

                    <div className="flex items-center justify-center gap-6 flex-wrap">
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                                {stats.days}
                            </span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">days</span>
                        </div>

                        <span className="text-muted-foreground/50">•</span>

                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                                {stats.weeks}
                            </span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">weeks</span>
                        </div>

                        <span className="text-muted-foreground/50">•</span>

                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                                {stats.percentage}%
                            </span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">of 2025</span>
                        </div>
                    </div>
                </motion.div>

                {/* Fun fact */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="text-center text-sm md:text-base font-minecraft-seven text-muted-foreground/50 italic"
                >
                    {stats.hours > 1000
                        ? "Exceptional dedication to your craft"
                        : stats.hours > 500
                            ? "You've made Everthorn your second home"
                            : stats.hours > 100
                                ? "A true Everthorn adventurer"
                                : "Every hour builds your legacy"
                    }
                </motion.p>
            </div>
        </section>
    );
}
