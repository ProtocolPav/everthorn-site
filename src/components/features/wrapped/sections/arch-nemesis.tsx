// components/features/wrapped/sections/arch-nemesis.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';

interface ArchNemesisProps {
    archNemesis: string;
    deathCount: number;
}

export function ArchNemesis({ archNemesis, deathCount }: ArchNemesisProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Helper function to format mob names
    const formatMobName = (mobType: string): string => {
        const parts = mobType.split(':');
        const name = parts.length > 1 ? parts[parts.length - 1] : mobType;

        return name
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    };

    const formattedNemesis = useMemo(() => formatMobName(archNemesis), [archNemesis]);

    // Generate dramatic story
    const story = useMemo(() => {
        if (deathCount > 50) {
            return "This is getting embarrassing...";
        } else if (deathCount > 20) {
            return "They seem to have your number!";
        } else if (deathCount > 10) {
            return "A worthy adversary indeed!";
        } else {
            return "Everyone has at least one weakness...";
        }
    }, [deathCount]);

    return (
        <section
            ref={ref}
            className="min-h-[70vh] flex items-center justify-center relative overflow-hidden px-4 py-12"
        >
            {/* Background - darker, more ominous */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1 }}
            >
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-red-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-purple-400 tracking-[0.3em] uppercase mb-4">
                        Defeated By
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your Arch Nemesis
                    </h2>
                </motion.div>

                {/* Dramatic reveal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center space-y-8"
                >
                    {/* The nemesis name - big and dramatic */}
                    <div className="space-y-4">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-base md:text-lg font-minecraft-seven text-muted-foreground"
                        >
                            This year, you couldn't for the life of you escape from...
                        </motion.p>

                        <div className="relative inline-block py-8">
                            {/* Massive background text */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                                <span className="text-[8rem] md:text-[12rem] font-minecraft-seven text-foreground select-none whitespace-nowrap">
                                    {formattedNemesis.split(' ')[0]}
                                </span>
                            </div>

                            {/* Main nemesis name */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                                transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                                className="relative text-5xl md:text-6xl lg:text-7xl font-minecraft-seven bg-gradient-to-r from-purple-400 via-red-400 to-orange-400 text-transparent bg-clip-text"
                            >
                                {formattedNemesis}
                            </motion.h1>

                            {/* Glow effect */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-red-500/20 to-orange-500/20 blur-2xl -z-10"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Death count - dramatic presentation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-3"
                    >
                        <div className="inline-block relative">
                            {/* Pixelated skull box */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500/30" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500/30" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500/30" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500/30" />

                            <div
                                className="px-10 py-5 border-2 border-red-500/30 bg-red-500/5"
                                style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <p className="text-sm font-minecraft-seven text-muted-foreground uppercase tracking-wide">
                                        You got got
                                    </p>
                                    <div className="text-6xl md:text-7xl font-minecraft-seven bg-gradient-to-r from-red-400 to-orange-400 text-transparent bg-clip-text">
                                        {deathCount}
                                    </div>
                                    <p className="text-sm font-minecraft-seven text-muted-foreground uppercase tracking-wide">
                                        {deathCount === 1 ? 'Time' : 'Times'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 1.1 }}
                            className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic pt-2"
                        >
                            {story}
                        </motion.p>
                    </motion.div>

                    {/* Motivation */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.3 }}
                        className="text-base md:text-lg font-minecraft-ten text-foreground/60 pt-4"
                    >
                        Time for revenge in 2026?
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
