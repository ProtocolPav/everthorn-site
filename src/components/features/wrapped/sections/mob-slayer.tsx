// components/features/wrapped/sections/mob-slayer.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { KillCount } from '@/types/wrapped';

interface MobSlayerProps {
    killCounts: KillCount[];
}

export function MobSlayer({ killCounts }: MobSlayerProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Helper function to format mob names
    const formatMobName = (mobType: string): string => {
        // Split by colon and take the last part (after prefix)
        const parts = mobType.split(':');
        const name = parts.length > 1 ? parts[parts.length - 1] : mobType;

        // Remove underscores and capitalize each word
        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    };

    const stats = useMemo(() => {
        const topFive = killCounts.slice(0, 5);
        const totalKills = killCounts.reduce((sum, mob) => sum + mob.kill_count, 0);
        const topMob = killCounts[0];

        return {
            topFive,
            totalKills,
            topMob: topMob ? {
                ...topMob,
                formatted_name: formatMobName(topMob.mob_type)
            } : null,
        };
    }, [killCounts]);

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
                <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-red-400 tracking-[0.3em] uppercase mb-4">
                        Combat
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Mob Slayer
                    </h2>
                </motion.div>

                {/* Total kills */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center space-y-4"
                >
                    <p className="text-lg md:text-xl font-minecraft-seven text-muted-foreground">
                        You've slain a total of
                    </p>

                    <div className="relative inline-block">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-minecraft-seven bg-gradient-to-r from-red-400 via-orange-400 to-red-500 text-transparent bg-clip-text"
                        >
                            {stats.totalKills.toLocaleString()}
                        </motion.h1>

                        {/* Subtle glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <p className="text-xl md:text-2xl font-minecraft-ten text-red-400/80 uppercase tracking-wide">
                        Mobs
                    </p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic pt-2"
                    >
                        {stats.totalKills > 1000
                            ? "An absolute force of destruction!"
                            : stats.totalKills > 500
                                ? "The mobs fear your name!"
                                : stats.totalKills > 100
                                    ? "A skilled warrior indeed!"
                                    : "Every battle makes you stronger!"}
                    </motion.p>
                </motion.div>

                {/* Top 5 leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-px flex-1 max-w-24 bg-border" />
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                                Your Top 5
                            </p>
                            <div className="h-px flex-1 max-w-24 bg-border" />
                        </div>

                        {/* Leaderboard - bar chart style */}
                        <div className="space-y-3">
                            {stats.topFive.map((mob, index) => {
                                const maxKills = stats.topFive[0].kill_count;
                                const percentage = (mob.kill_count / maxKills) * 100;

                                return (
                                    <motion.div
                                        key={mob.mob_type}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                                        transition={{ delay: 0.9 + (index * 0.1) }}
                                        className="space-y-2"
                                    >
                                        {/* Mob name and count */}
                                        <div className="flex items-baseline justify-between">
                                            <div className="flex items-baseline gap-3">
                                <span className={`font-minecraft-seven text-sm ${
                                    index === 0 ? 'text-red-400' : 'text-muted-foreground/60'
                                }`}>
                                    #{index + 1}
                                </span>
                                                <span className={`font-minecraft-ten text-base md:text-lg ${
                                                    index === 0 ? 'text-red-400' : 'text-foreground/90'
                                                }`}>
                                    {formatMobName(mob.mob_type)}
                                </span>
                                            </div>
                                            <span className={`font-minecraft-seven text-xl md:text-2xl ${
                                                index === 0
                                                    ? 'bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text'
                                                    : 'text-muted-foreground'
                                            }`}>
                                {mob.kill_count.toLocaleString()}
                            </span>
                                        </div>

                                        {/* Progress bar */}
                                        <div className="h-2 bg-card/50 rounded-full overflow-hidden border border-border/30">
                                            <motion.div
                                                className={`h-full rounded-full ${
                                                    index === 0
                                                        ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                                        : 'bg-gradient-to-r from-muted to-muted-foreground/30'
                                                }`}
                                                initial={{ width: 0 }}
                                                animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
                                                transition={{ delay: 1 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                                            />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 1.5 }}
                            className="text-sm md:text-base font-minecraft-seven text-muted-foreground text-center pt-2"
                        >
                            {stats.topMob && stats.topMob.kill_count > 100
                                ? `You really have it out for ${stats.topMob.formatted_name}s!`
                                : "No mob is safe from your blade!"}
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
