// components/features/wrapped/sections/most-addicted-day.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { PlaytimeMetrics } from '@/types/wrapped';

interface MostAddictedDayProps {
    data: PlaytimeMetrics;
}

export function MostAddictedDay({ data }: MostAddictedDayProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const date = new Date(data.highest_day);
        const totalHours = Math.round(data.highest_day_seconds / 3600);

        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();

        const suffix = (day: number) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };

        return {
            monthName,
            day,
            year,
            hours: totalHours,
            daySuffix: suffix(day),
            fullDate: `${monthName} ${day}${suffix(day)}`
        };
    }, [data.highest_day, data.highest_day_seconds]);

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
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-amber-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-orange-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-amber-400 tracking-[0.3em] uppercase mb-4">
                        Peak Day
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your longest session
                    </h2>
                </motion.div>

                {/* Date display */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                        duration: 0.8,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 120
                    }}
                    className="text-center space-y-6"
                >
                    <div className="relative inline-block">
                        {/* Background number */}
                        <div className="font-minecraft-seven text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none text-amber-500/10 select-none whitespace-nowrap">
                            {stats.day}
                        </div>

                        {/* Overlaid gradient date */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="font-minecraft-seven text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-transparent bg-clip-text whitespace-nowrap">
                                    {stats.monthName} {stats.day}<sup className="text-3xl md:text-4xl">{stats.daySuffix}</sup>
                                </div>
                            </motion.div>
                        </div>

                        {/* Subtle glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl -z-10"
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
                        {stats.year}
                    </motion.p>
                </motion.div>

                {/* Hours */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center space-y-3"
                >
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px flex-1 max-w-24 bg-border" />
                        <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                            You Played
                        </p>
                        <div className="h-px flex-1 max-w-24 bg-border" />
                    </div>

                    {/* Pixelated/blocky container */}
                    <div className="inline-block relative">
                        {/* Pixelated corners effect */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-amber-500/30" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500/30" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-amber-500/30" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-500/30" />

                        <div className="px-8 py-4 border-2 border-amber-500/30 bg-amber-500/5" style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
                            <div className="flex items-baseline gap-3">
                <span className="text-4xl md:text-5xl font-minecraft-seven bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                    {stats.hours}
                </span>
                                <span className="text-lg font-minecraft-ten text-muted-foreground uppercase tracking-wide">
                    Hours
                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 1 }}
                    className="text-center text-sm md:text-base font-minecraft-seven text-muted-foreground/50 italic"
                >
                    {stats.hours >= 12
                        ? "A legendary marathon session"
                        : stats.hours >= 8
                            ? "Pure dedication"
                            : stats.hours >= 5
                                ? "Quality time well spent"
                                : "Every moment counts"
                    }
                </motion.p>
            </div>
        </section>
    );
}
