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
        // Convert UTC hour to local hour
        const utcDate = new Date();
        utcDate.setUTCHours(data.most_active_hour, 0, 0, 0);
        const localHour = utcDate.getHours();

        // Format time
        const period = localHour >= 12 ? 'PM' : 'AM';
        const hour12 = localHour % 12 || 12;
        const formattedTime = `${hour12}:00`;

        // Determine time of day category
        let timeCategory = '';
        let emoji = '';
        let description = '';

        if (localHour >= 5 && localHour < 12) {
            timeCategory = 'Early Bird';
            emoji = '🌅';
            description = 'Those morning gaming sessions just hit different';
        } else if (localHour >= 12 && localHour < 17) {
            timeCategory = 'Afternoon Player';
            emoji = '☀️';
            description = "It's 5pm somewhere...";
        } else if (localHour >= 17 && localHour < 21) {
            timeCategory = 'Evening Gamer';
            emoji = '🌆';
            description = 'Unwinding after a long day';
        } else {
            timeCategory = 'Night Owl';
            emoji = '🌙';
            description = 'Human by day, Everthornian by night';
        }

        return {
            localHour,
            formattedTime,
            period,
            timeCategory,
            emoji,
            description,
            sessionCount: data.most_active_hour_sessions,
            totalHours: Math.round(data.most_active_hour_seconds / 3600)
        };
    }, [data.most_active_hour, data.most_active_hour_sessions, data.most_active_hour_seconds]);

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

            <div className="max-w-4xl w-full text-center space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="space-y-3"
                >
                    <div className="inline-block px-4 py-2 bg-violet-500/15 border border-violet-500/30 rounded-md">
                        <span className="text-xs font-minecraft-ten text-violet-300 tracking-wider">
                            PRIME TIME
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-minecraft-ten text-foreground/90">
                        You're most active at
                    </h2>
                </motion.div>

                {/* Main time display */}
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
                    {/* Time */}
                    <div className="flex items-center justify-center gap-3">
                        <h1 className="font-minecraft-seven text-7xl md:text-8xl lg:text-9xl text-violet-400">
                            {stats.formattedTime}
                        </h1>
                        <span className="text-4xl md:text-5xl font-minecraft-ten text-violet-400/80 mt-4">
                            {stats.period}
                        </span>
                    </div>

                    {/* Time category */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-3xl md:text-4xl font-minecraft-seven text-foreground/90">
                            {stats.emoji} {stats.timeCategory}
                        </p>
                    </motion.div>
                </motion.div>

                {/* Description */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.7 }}
                    className="text-base md:text-lg font-minecraft-seven text-muted-foreground italic"
                >
                    {stats.description}
                </motion.p>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="pt-4 px-3"
                >
                    <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                        You've played at this hour{" "}
                        <span className="text-2xl md:text-3xl font-minecraft-seven text-violet-400">{stats.sessionCount}</span>
                        {" "}times this year!
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
