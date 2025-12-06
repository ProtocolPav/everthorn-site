// components/features/wrapped/sections/prime-time.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { PlaytimeMetrics } from '@/types/wrapped';

interface PrimeTimeProps {
    data: PlaytimeMetrics;
}

export function PrimeTime({ data }: PrimeTimeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const utcDate = new Date();
        utcDate.setUTCHours(data.most_active_hour, 0, 0, 0);
        const localHour = utcDate.getHours();

        const period = localHour >= 12 ? 'PM' : 'AM';
        const hour12 = localHour % 12 || 12;
        const formattedTime = `${hour12}:00`;

        let timeCategory = '';
        let description = '';

        if (localHour >= 5 && localHour < 12) {
            timeCategory = 'Early Bird';
            description = 'Morning gaming sessions';
        } else if (localHour >= 12 && localHour < 17) {
            timeCategory = 'Afternoon Player';
            description = 'Perfect afternoon vibes';
        } else if (localHour >= 17 && localHour < 21) {
            timeCategory = 'Evening Gamer';
            description = 'Unwinding after the day';
        } else {
            timeCategory = 'Night Owl';
            description = 'Late night adventures';
        }

        return {
            localHour,
            formattedTime,
            period,
            timeCategory,
            description,
            sessionCount: data.most_active_hour_sessions,
        };
    }, [data.most_active_hour, data.most_active_hour_sessions]);

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
                <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-violet-400 tracking-[0.3em] uppercase mb-4">
                        Prime Time
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your peak hour
                    </h2>
                </motion.div>

                {/* Main time display */}
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
                        {/* Background time */}
                        <div className="font-minecraft-seven text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none text-violet-500/10 select-none flex items-center gap-4">
                            <span>{stats.formattedTime.split(':')[0]}</span>
                        </div>

                        {/* Overlaid gradient time */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 }}
                                className="flex items-baseline gap-3"
                            >
                                <span className="font-minecraft-seven text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 text-transparent bg-clip-text">
                                    {stats.formattedTime}
                                </span>
                                <span className="text-3xl md:text-4xl font-minecraft-ten text-violet-400/80">
                                    {stats.period}
                                </span>
                            </motion.div>
                        </div>

                        {/* Subtle glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-purple-500/20 blur-xl -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Time category */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.6 }}
                    >
                        <p className="text-2xl md:text-3xl font-minecraft-seven bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text">
                            {stats.timeCategory}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Description and stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="text-center space-y-6"
                >
                    <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground italic">
                        {stats.description}
                    </p>

                    {/* Pixelated/blocky container */}
                    <div className="inline-block relative">
                        {/* Pixelated corners effect */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-violet-500/30" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-violet-500/30" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-violet-500/30" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-violet-500/30" />

                        <div className="px-8 py-4 border-2 border-violet-500/30 bg-violet-500/5" style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}>
                            <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground">
                                You logged on at this hour{" "}
                                <span className="text-2xl md:text-3xl font-minecraft-seven bg-gradient-to-r from-violet-400 to-purple-400 text-transparent bg-clip-text">
                    {stats.sessionCount}
                </span>
                                {" "}times
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
