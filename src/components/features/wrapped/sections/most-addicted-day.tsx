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

        // Format date parts
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthName = date.toLocaleDateString('en-US', { month: 'long' });
        const day = date.getDate();
        const year = date.getFullYear();

        // Get suffix for day (1st, 2nd, 3rd, etc.)
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
            dayName,
            monthName,
            day,
            year,
            hours: totalHours,
            daySuffix: suffix(day)
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

            <div className="max-w-4xl w-full text-center space-y-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="space-y-3"
                >
                    <div className="inline-block px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                        <span className="text-xs font-minecraft-ten text-amber-400 tracking-wider">
                            MOST ADDICTED DAY
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-minecraft-ten text-foreground/80">
                        Your longest gaming session
                    </h2>
                </motion.div>

                {/* Date display - large and bold */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{
                        duration: 0.7,
                        delay: 0.2,
                        type: "spring",
                        stiffness: 120
                    }}
                    className="space-y-4"
                >
                    {/* Day of week */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.4 }}
                        className="text-lg md:text-xl font-minecraft-ten text-muted-foreground uppercase tracking-wider"
                    >
                        {stats.dayName}
                    </motion.p>

                    {/* Main date */}
                    <div className="relative inline-block">
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-2xl"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />

                        <h1 className="relative font-minecraft-seven text-6xl md:text-7xl lg:text-8xl">
                            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                                {stats.monthName} {stats.day}
                                <sup className="text-4xl md:text-5xl">{stats.daySuffix}</sup>
                            </span>
                        </h1>
                    </div>

                    {/* Year */}
                    <p className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground">
                        {stats.year}
                    </p>
                </motion.div>

                {/* Hours played */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="space-y-4 pt-4"
                >
                    <div className="inline-block px-6 py-4 bg-card/50 backdrop-blur-sm border border-amber-500/20 rounded-lg">
                        <div className="flex items-baseline gap-3">
                            <span className="text-5xl md:text-6xl font-minecraft-seven text-amber-400">
                                {stats.hours}
                            </span>
                            <span className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground uppercase">
                                hours
                            </span>
                        </div>
                    </div>

                    <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70">
                        {stats.hours >= 12
                            ? "A legendary marathon session! 🔥"
                            : stats.hours >= 8
                                ? "Now that's dedication!"
                                : stats.hours >= 5
                                    ? "Quality gaming time!"
                                    : "Every moment counts!"
                        }
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
