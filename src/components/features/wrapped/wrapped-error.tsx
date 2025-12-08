// components/features/wrapped/wrapped-error-screen.tsx
"use client";

import { motion } from "motion/react";
import Link from "next/link";

export function WrappedErrorScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <motion.div
                className="absolute inset-0 -z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
            >
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="w-full max-w-lg">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Pixelated corners */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500/40" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500/40" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-red-500/40" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-red-500/40" />

                    <div
                        className="p-8 md:p-12 border-2 border-red-500/30 bg-card/90 backdrop-blur-sm text-center space-y-8"
                        style={{
                            clipPath:
                                "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
                        }}
                    >
                        {/* Icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30">
                                    <span className="text-5xl">⚠️</span>
                                </div>

                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 blur-xl -z-10"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                            </div>
                        </motion.div>

                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h2 className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 text-transparent bg-clip-text">
                                Error Loading Wrapped
                            </h2>
                            <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground leading-relaxed">
                                Failed to fetch your Wrapped data.
                            </p>
                            <p className="text-sm font-minecraft-ten text-muted-foreground/70">
                                Try again in a bit, or head back home.
                            </p>
                        </motion.div>

                        {/* Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <Link href="/home" className="block">
                                <div className="relative group">
                                    <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />

                                    <div
                                        className="w-full px-4 py-3 border border-border/50 bg-card/50 group-hover:bg-card group-hover:border-border transition-all"
                                        style={{
                                            clipPath:
                                                "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)",
                                        }}
                                    >
                    <span className="font-minecraft-ten text-xs uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground transition-colors">
                      Back to Home
                    </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
