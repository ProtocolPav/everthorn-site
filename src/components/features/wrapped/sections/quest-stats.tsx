// components/features/wrapped/sections/quest-stats.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { QuestMetrics } from '@/types/wrapped';

interface QuestStatsProps {
    data: QuestMetrics;
}

export function QuestStats({ data }: QuestStatsProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const completionRate = Math.round(data.completion_rate);
        const fastestMinutes = Math.round(data.fastest_quest_duration_seconds / 60);
        const fastestHours = (data.fastest_quest_duration_seconds / 3600).toFixed(1);

        const fastestDisplay = fastestMinutes < 60
            ? { value: fastestMinutes, unit: 'minutes', text: `${fastestMinutes} ${fastestMinutes === 1 ? 'minute' : 'minutes'}` }
            : { value: parseFloat(fastestHours), unit: 'hours', text: `${parseFloat(fastestHours)} ${parseFloat(fastestHours) === 1 ? 'hour' : 'hours'}` };

        // Generate completion comment
        let completionComment = '';
        if (completionRate >= 90) {
            completionComment = 'Incredible dedication!';
        } else if (completionRate >= 75) {
            completionComment = 'Impressive commitment!';
        } else if (completionRate >= 50) {
            completionComment = 'Not bad at all!';
        } else if (completionRate >= 25) {
            completionComment = 'Every quest counts!';
        } else {
            completionComment = 'Quality over quantity!';
        }

        return {
            completionRate,
            fastestDisplay,
            fastestTitle: data.fastest_quest_title,
            completed: data.total_completed,
            completionComment
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
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-green-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-16">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-emerald-400 tracking-[0.3em] uppercase mb-4">
                        Quests
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Mission Accomplished
                    </h2>
                </motion.div>

                {/* Main stat - Large completed number */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center space-y-6"
                >
                    <div className="relative inline-block">
                        {/* Massive number background */}
                        <h1 className="font-minecraft-seven text-[10rem] md:text-[14rem] lg:text-[18rem] leading-none text-emerald-500/10 select-none">
                            {stats.completed}
                        </h1>

                        {/* Overlaid actual number with gradient */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <motion.span
                                className="text-7xl md:text-8xl lg:text-9xl font-minecraft-seven bg-gradient-to-br from-emerald-400 via-green-400 to-emerald-500 text-transparent bg-clip-text"
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.5 }}
                            >
                                {stats.completed}
                            </motion.span>
                        </div>

                        {/* Subtle glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-xl -z-10"
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
                        transition={{ delay: 0.7 }}
                        className="text-xl md:text-2xl font-minecraft-ten text-muted-foreground"
                    >
                        COMPLETED QUESTS
                    </motion.p>

                    {/* Completion rate with pixelated box */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.9 }}
                        className="inline-block relative"
                    >
                        {/* Pixelated corners */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-emerald-500/30" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500/30" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-emerald-500/30" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500/30" />

                        <div
                            className="px-8 py-4 border-2 border-emerald-500/30 bg-emerald-500/5"
                            style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                        >
                            <div className="space-y-1">
                                <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground">
                                    You completed{" "}
                                    <span className="text-2xl md:text-3xl font-minecraft-seven bg-gradient-to-r from-emerald-400 to-green-400 text-transparent bg-clip-text">
                                        {stats.completionRate}%
                                    </span>
                                    {" "}of the quests you started
                                </p>
                                <p className="text-xs md:text-sm font-minecraft-seven text-emerald-400/80">
                                    {stats.completionComment}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Fastest quest */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="space-y-6">
                        {/* Label */}
                        <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-border" />
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                                Speed Runner
                            </p>
                            <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Quest info */}
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl md:text-3xl font-minecraft-ten text-foreground/90 leading-tight">
                                {stats.fastestTitle}
                            </h3>

                            <div className="relative inline-block space-y-2">
                                <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                                    You took a whopping{" "}
                                    <span className="text-4xl md:text-5xl font-minecraft-seven bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-transparent bg-clip-text">
                                        {stats.fastestDisplay.text}
                                    </span>
                                    {" "}to complete this quest!
                                </p>
                                <p className="text-sm md:text-base font-minecraft-seven text-amber-400/80 italic">
                                    That's your fastest yet!
                                </p>

                                {/* Subtle glow */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-amber-500/15 to-orange-500/15 blur-xl -z-10"
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        opacity: [0.2, 0.4, 0.2]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
