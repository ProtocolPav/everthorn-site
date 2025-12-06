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

    // Calculate hours, days, and weeks
    const stats = useMemo(() => {
        const totalHours = Math.floor(data.total_seconds / 3600);
        const totalDays = (data.total_seconds / 86400).toFixed(0);
        const totalWeeks = (data.total_seconds / 604800).toFixed(0);
        const percentage = Math.min((totalHours / 8760) * 100, 100).toFixed(0); // % of year

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
                <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-3xl w-full text-center space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="space-y-3"
                >
                    <div className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-md">
                        <span className="text-xs font-minecraft-ten text-blue-400 tracking-wider">
                            TIME PLAYED
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-minecraft-ten text-foreground/80">
                        In 2025, you spent...
                    </h2>
                </motion.div>

                {/* Big number - total hours */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 100
                    }}
                    className="space-y-3"
                >
                    <div className="relative inline-block">
                        {/* Subtle glow effect behind number */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />

                        <motion.h1
                            className="relative text-7xl md:text-8xl lg:text-9xl font-minecraft-seven leading-none bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500 text-transparent bg-clip-text"
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            {stats.hours.toLocaleString()}
                        </motion.h1>
                    </div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground"
                    >
                        HOURS ON EVERTHORN
                    </motion.p>
                </motion.div>

                {/* Additional stats - compact inline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="space-y-3"
                >
                    <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                        That's almost
                    </p>

                    <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-minecraft-seven text-cyan-400">{stats.days}</span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">days</span>
                        </div>

                        <span className="text-muted-foreground/50">•</span>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-minecraft-seven text-blue-400">{stats.weeks}</span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">weeks</span>
                        </div>

                        <span className="text-muted-foreground/50">•</span>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl md:text-3xl font-minecraft-seven text-purple-400">{stats.percentage}%</span>
                            <span className="text-sm md:text-base font-minecraft-ten text-muted-foreground">of 2025</span>
                        </div>
                    </div>
                </motion.div>

                {/* Fun fact */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-sm md:text-base font-minecraft-seven text-muted-foreground/60 italic"
                >
                    {stats.hours > 1000
                        ? "That's dedication! You practically lived in Everthorn."
                        : stats.hours > 500
                            ? "You've made Everthorn your second home!"
                            : stats.hours > 100
                                ? "A true Everthorn adventurer!"
                                : "Every hour counts in building your legacy!"
                    }
                </motion.p>
            </div>
        </section>
    );
}
