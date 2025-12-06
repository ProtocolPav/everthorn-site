// components/features/wrapped/sections/grind-day.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { GrindDayMetrics } from '@/types/wrapped';

interface GrindDayProps {
    data: GrindDayMetrics;
}

export function GrindDay({ data }: GrindDayProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const date = new Date(data.grind_date);
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

        const hours = Math.round(data.hours_played);
        const totalActions = data.total_combined_actions;

        return {
            monthName,
            day,
            year,
            daySuffix: suffix(day),
            hours,
            sessions: data.sessions,
            blocks: data.blocks,
            mobKills: data.mob_kills,
            questsCompleted: data.quests_completed,
            totalActions,
        };
    }, [data]);

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
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-yellow-400 tracking-[0.3em] uppercase mb-4">
                        Your Masterpiece
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        The Ultimate Grind
                    </h2>
                </motion.div>

                {/* Intro */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center text-base md:text-lg font-minecraft-seven text-muted-foreground"
                >
                    One day stood above all others...
                </motion.p>

                {/* The date - big reveal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 120 }}
                    className="text-center space-y-6"
                >
                    <div className="relative inline-block">
                        {/* Background date */}
                        <div className="font-minecraft-seven text-[8rem] md:text-[12rem] lg:text-[16rem] leading-none text-yellow-500/10 select-none whitespace-nowrap">
                            {stats.day}
                        </div>

                        {/* Overlaid gradient date */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="font-minecraft-seven text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 text-transparent bg-clip-text whitespace-nowrap">
                                    {stats.monthName} {stats.day}<sup className="text-3xl md:text-4xl">{stats.daySuffix}</sup>
                                </div>
                            </motion.div>
                        </div>

                        {/* Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 blur-xl -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground"
                    >
                        {stats.year}
                    </motion.p>
                </motion.div>

                {/* What made it special */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.9 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px flex-1 max-w-32 bg-border" />
                        <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                            What You Achieved
                        </p>
                        <div className="h-px flex-1 max-w-32 bg-border" />
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                        {/* Hours played */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 1.1 }}
                            className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-center space-y-1"
                        >
                            <div className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-yellow-400 to-amber-400 text-transparent bg-clip-text">
                                {stats.hours}
                            </div>
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-wide">
                                Hours
                            </p>
                        </motion.div>

                        {/* Blocks */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 1.2 }}
                            className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-center space-y-1"
                        >
                            <div className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-emerald-400 to-green-400 text-transparent bg-clip-text">
                                {stats.blocks.toLocaleString()}
                            </div>
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-wide">
                                Blocks
                            </p>
                        </motion.div>

                        {/* Mob Kills */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 1.3 }}
                            className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 text-center space-y-1"
                        >
                            <div className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">
                                {stats.mobKills.toLocaleString()}
                            </div>
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-wide">
                                Kills
                            </p>
                        </motion.div>

                        {/* Quests */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                            transition={{ delay: 1.4 }}
                            className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5 text-center space-y-1"
                        >
                            <div className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                {stats.questsCompleted}
                            </div>
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-wide">
                                Quests
                            </p>
                        </motion.div>
                    </div>

                    {/* Total actions highlight */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 1.5 }}
                        className="text-center space-y-2 pt-4"
                    >
                        <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground">
                            A total of
                        </p>
                        <div className="text-4xl md:text-5xl font-minecraft-seven bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
                            {stats.totalActions.toLocaleString()}
                        </div>
                        <p className="text-base md:text-lg font-minecraft-ten text-yellow-400/80 uppercase tracking-wide">
                            Combined Actions
                        </p>
                    </motion.div>
                </motion.div>

                {/* Epic conclusion */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.7 }}
                    className="text-center text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic"
                >
                    {stats.hours >= 10
                        ? "An absolutely legendary day of grinding!"
                        : stats.hours >= 6
                            ? "This was peak dedication right here!"
                            : stats.hours >= 4
                                ? "You went all out on this one!"
                                : "A day to remember!"}
                </motion.p>
            </div>
        </section>
    );
}
