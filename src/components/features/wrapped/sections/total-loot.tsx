// components/features/wrapped/sections/total-loot.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { RewardMetrics } from '@/types/wrapped';

interface TotalLootProps {
    data: RewardMetrics;
}

export function TotalLoot({ data }: TotalLootProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        return {
            balance: Math.round(data.total_balance_earned || 0),
            items: Math.round(data.total_items_earned || 0),
            unique: data.unique_items || 0,
        };
    }, [data.total_balance_earned, data.total_items_earned, data.unique_items]);

    // Generate fun story based on stats
    const story = useMemo(() => {
        if (stats.balance > 10000) {
            return "You're practically swimming in treasure!";
        } else if (stats.balance > 5000) {
            return "Your vault is looking mighty impressive!";
        } else if (stats.balance > 1000) {
            return "That's a solid haul right there!";
        } else {
            return "Every nug tells a story of adventure!";
        }
    }, [stats.balance]);

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
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-amber-400 tracking-[0.3em] uppercase mb-4">
                        Rewards
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        The Spoils of Adventure
                    </h2>
                </motion.div>

                {/* Main balance earned */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center space-y-4"
                >
                    <p className="text-lg md:text-xl font-minecraft-seven text-muted-foreground">
                        You earned a grand total of
                    </p>

                    <div className="relative inline-block">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="text-6xl md:text-7xl lg:text-8xl font-minecraft-seven bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-transparent bg-clip-text"
                        >
                            {stats.balance.toLocaleString()}
                        </motion.h1>

                        {/* Subtle glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl -z-10"
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <p className="text-xl md:text-2xl font-minecraft-ten text-amber-400/80 uppercase tracking-wide">
                        Nugs
                    </p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic pt-2"
                    >
                        {story}
                    </motion.p>
                </motion.div>

                {/* Items section - side by side layout */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 justify-center">
                            <div className="h-px flex-1 max-w-32 bg-border" />
                            <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                                Rewardsss...
                            </p>
                            <div className="h-px flex-1 max-w-32 bg-border" />
                        </div>

                        {/* Two column item stats - Minecraft stacks */}
                        <div className="grid grid-cols-2 gap-6 md:gap-8">
                            {/* Total items - in stacks */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: 0.9 }}
                                className="text-center space-y-3"
                            >
                                <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground">
                                    You collected
                                </p>
                                <div className="text-5xl md:text-6xl font-minecraft-seven bg-gradient-to-r from-amber-400 to-orange-400 text-transparent bg-clip-text">
                                    {Math.floor(stats.items / 64)}
                                </div>
                                <div className="text-base md:text-lg font-minecraft-ten text-amber-400/80 uppercase tracking-wide">
                                    Stacks of Rewards
                                </div>
                            </motion.div>

                            {/* Unique items */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                                transition={{ delay: 0.9 }}
                                className="text-center space-y-3"
                            >
                                <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground">
                                    Including
                                </p>
                                <div className="text-5xl md:text-6xl font-minecraft-seven bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                                    {stats.unique}
                                </div>
                                <div className="text-base md:text-lg font-minecraft-ten text-purple-400/80 uppercase tracking-wide">
                                    Different Items
                                </div>
                            </motion.div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 1.1 }}
                            className="text-sm md:text-base font-minecraft-seven text-muted-foreground text-center pt-2"
                        >
                            {stats.unique > 20
                                ? "Quite the collector, aren't you?"
                                : stats.unique > 10
                                    ? "Building an impressive arsenal!"
                                    : "Every item has its purpose!"}
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
