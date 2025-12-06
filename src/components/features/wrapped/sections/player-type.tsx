// components/features/wrapped/sections/player-type.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';

interface PlayerTypeProps {
    playerType: 'Creator' | 'Destroyer' | 'Balanced Builder';
    blocksPlaced: number;
    blocksMined: number;
}

export function PlayerType({ playerType, blocksPlaced, blocksMined }: PlayerTypeProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const stats = useMemo(() => {
        const total = blocksPlaced + blocksMined;
        const placedPercentage = Math.round((blocksPlaced / total) * 100);
        const minedPercentage = Math.round((blocksMined / total) * 100);

        // Get theme colors, creative name, and story based on type
        let theme, displayName, story, subtitle;

        if (playerType === 'Creator') {
            theme = {
                gradient: 'from-sky-400 via-blue-400 to-indigo-400',
                bg1: 'bg-sky-500/8',
                bg2: 'bg-blue-500/8',
                badge: 'text-sky-400',
            };
            displayName = "ARCHITECT";
            subtitle = "Visionary Builder";
            story = "You don't just place blocks... You craft worlds. Every structure tells a story!";
        } else if (playerType === 'Destroyer') {
            theme = {
                gradient: 'from-amber-400 via-orange-400 to-red-400',
                bg1: 'bg-amber-500/8',
                bg2: 'bg-orange-500/8',
                badge: 'text-amber-400',
            };
            displayName = "EXCAVATIONIST";
            subtitle = "Deep Delver";
            story = "Beneath the surface lies fortune. You carve through stone like it's nothing!";
        } else {
            theme = {
                gradient: 'from-purple-400 via-fuchsia-400 to-pink-400',
                bg1: 'bg-purple-500/8',
                bg2: 'bg-fuchsia-500/8',
                badge: 'text-purple-400',
            };
            displayName = "ARTISAN";
            subtitle = "Master of Both Worlds";
            story = "Why choose? You mine what you need, then build what you dream!";
        }

        return {
            theme,
            displayName,
            story,
            subtitle,
            total,
            placedPercentage,
            minedPercentage,
        };
    }, [playerType, blocksPlaced, blocksMined]);

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
                <div className={`absolute top-1/4 left-1/3 w-96 h-96 ${stats.theme.bg1} rounded-full blur-3xl`} />
                <div className={`absolute bottom-1/3 right-1/3 w-96 h-96 ${stats.theme.bg2} rounded-full blur-3xl`} />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className={`text-xs font-minecraft-ten ${stats.theme.badge} tracking-[0.3em] uppercase mb-4`}>
                        Your Style
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        You are a...
                    </h2>
                </motion.div>

                {/* Player Type Reveal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
                    className="text-center space-y-6"
                >
                    {/* The type - huge and bold */}
                    <div className="relative inline-block py-6">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                            transition={{ delay: 0.5, type: "spring" }}
                            className={`text-6xl md:text-7xl lg:text-8xl font-minecraft-seven bg-gradient-to-r ${stats.theme.gradient} text-transparent bg-clip-text leading-tight`}
                        >
                            {stats.displayName}
                        </motion.h1>

                        {/* Glow */}
                        <motion.div
                            className={`absolute inset-0 bg-gradient-to-r ${stats.theme.gradient.replace(/text-/g, 'from-').replace(/via-/g, 'via-').replace(/to-/g, 'to-')}/20 blur-2xl -z-10`}
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-lg md:text-xl font-minecraft-ten text-muted-foreground"
                    >
                        {stats.subtitle}
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.9 }}
                        className="text-sm md:text-base font-minecraft-seven text-muted-foreground/80 italic max-w-2xl mx-auto"
                    >
                        {stats.story}
                    </motion.p>
                </motion.div>

                {/* Stats breakdown */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="max-w-2xl mx-auto space-y-6"
                >
                    <div className="flex items-center gap-3 justify-center">
                        <div className="h-px flex-1 max-w-32 bg-border" />
                        <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                            The Split
                        </p>
                        <div className="h-px flex-1 max-w-32 bg-border" />
                    </div>

                    {/* Dual-color bar */}
                    <div className="space-y-4">
                        {/* Labels above bar */}
                        <div className="flex items-center justify-between text-sm font-minecraft-seven">
                            <span className="text-emerald-400">Placed {stats.placedPercentage}%</span>
                            <span className="text-orange-400">Mined {stats.minedPercentage}%</span>
                        </div>

                        {/* The bar */}
                        <div className="h-12 rounded-lg overflow-hidden border-2 border-border/50 bg-card/30 flex">
                            <motion.div
                                className="bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-end pr-4"
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${stats.placedPercentage}%` } : { width: 0 }}
                                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                            >
                                {stats.placedPercentage > 15 && (
                                    <span className="text-white font-minecraft-seven text-lg">
                                        {blocksPlaced.toLocaleString()}
                                    </span>
                                )}
                            </motion.div>
                            <motion.div
                                className="bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-start pl-4"
                                initial={{ width: 0 }}
                                animate={isInView ? { width: `${stats.minedPercentage}%` } : { width: 0 }}
                                transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                            >
                                {stats.minedPercentage > 15 && (
                                    <span className="text-white font-minecraft-seven text-lg">
                                        {blocksMined.toLocaleString()}
                                    </span>
                                )}
                            </motion.div>
                        </div>

                        {/* Total below */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 1.4 }}
                            className="text-center text-sm font-minecraft-seven text-muted-foreground/60"
                        >
                            {stats.total.toLocaleString()} total blocks interacted with
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
