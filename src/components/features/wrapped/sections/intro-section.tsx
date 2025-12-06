// components/features/wrapped/sections/intro-section.tsx
"use client"

import { motion } from 'motion/react';

interface IntroSectionProps {
    username: string;
}

export function IntroSection({ username }: IntroSectionProps) {
    return (
        <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
            {/* Subtle background orbs */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <motion.div
                    className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="text-center relative max-w-5xl z-10">
                {/* Large 2025 in background */}
                <motion.div
                    initial={{ opacity: 0, scale: 1.2 }}
                    animate={{ opacity: 0.08, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ top: '-10%' }}
                >
                    <span className="text-[16rem] md:text-[30rem] lg:text-[35rem] font-minecraft-ten leading-none text-foreground select-none">
                        '25
                    </span>
                </motion.div>

                {/* Main content in foreground */}
                <div className="relative space-y-8">
                    {/* Small year badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 15
                        }}
                    >
                        <p className="text-xs font-minecraft-ten text-emerald-400 tracking-[0.3em] uppercase">
                            Year in Review
                        </p>
                    </motion.div>

                    {/* Your Everthorn */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.3,
                            type: "spring",
                            stiffness: 100
                        }}
                        className="text-4xl md:text-6xl lg:text-7xl font-minecraft-ten text-foreground/90"
                    >
                        Your Everthorn
                    </motion.h1>

                    {/* WRAPPED - main focus */}
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.5,
                            type: "spring",
                            stiffness: 120
                        }}
                        className="text-7xl md:text-9xl lg:text-[12rem] font-minecraft-seven leading-none"
                    >
                        <span className="inline-block bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-transparent bg-clip-text">
                            WRAPPED
                        </span>
                    </motion.h2>

                    {/* Username */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="pt-4"
                    >
                        <p className="text-xl md:text-2xl font-minecraft-seven text-muted-foreground">
                            Welcome back,{" "}
                            <motion.span
                                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                                animate={{
                                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                style={{ backgroundSize: "200% 200%" }}
                            >
                                {username}
                            </motion.span>
                        </p>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.2 }}
                        className="pt-16"
                    >
                        <motion.div
                            animate={{
                                y: [0, 12, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-xs font-minecraft-ten text-muted-foreground/60 tracking-[0.2em] uppercase">
                                Scroll to Explore
                            </span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-primary/60"
                            >
                                <path d="M12 5v14M19 12l-7 7-7-7" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
