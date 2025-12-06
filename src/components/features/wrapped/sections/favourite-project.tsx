// components/features/wrapped/sections/favorite-project.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';

interface FavoriteProjectProps {
    projectName: string;
    blocksPlaced: number;
}

export function FavoriteProject({ projectName, blocksPlaced }: FavoriteProjectProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    const story = useMemo(() => {
        if (blocksPlaced > 10000) {
            return "This project is your masterpiece!";
        } else if (blocksPlaced > 5000) {
            return "You poured your heart into this one!";
        } else if (blocksPlaced > 1000) {
            return "A true labor of love!";
        } else {
            return "Every block placed with purpose!";
        }
    }, [blocksPlaced]);

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
                <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-teal-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-teal-400 tracking-[0.3em] uppercase mb-4">
                        Projects
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your Favorite Build
                    </h2>
                </motion.div>

                {/* Main content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="text-center space-y-8"
                >
                    <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                        You spent the most time building in
                    </p>

                    {/* Project name - big hero */}
                    <div className="relative inline-block py-6">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-minecraft-seven bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 text-transparent bg-clip-text leading-tight px-4"
                        >
                            {projectName}
                        </motion.h1>

                        {/* Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 blur-2xl -z-10"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </div>

                    {/* Blocks placed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-3"
                    >
                        <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                            Where you placed
                        </p>

                        <div className="inline-block relative">
                            {/* Pixelated box */}
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-teal-500/30" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-teal-500/30" />
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-500/30" />
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500/30" />

                            <div
                                className="px-10 py-5 border-2 border-teal-500/30 bg-teal-500/5"
                                style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <div className="text-5xl md:text-6xl font-minecraft-seven bg-gradient-to-r from-teal-400 to-cyan-400 text-transparent bg-clip-text">
                                        {blocksPlaced.toLocaleString()}
                                    </div>
                                    <p className="text-base md:text-lg font-minecraft-ten text-teal-400/80 uppercase tracking-wide">
                                        Blocks
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Story */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.8 }}
                        className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic pt-4"
                    >
                        {story}
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
