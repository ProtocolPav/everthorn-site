// components/features/wrapped/wrapped-login-screen.tsx
"use client"

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { DiscordButton } from "@/components/layout/discord/discord-button";
import Link from "next/link";

export function WrappedLoginScreen() {
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
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="w-full max-w-lg">
                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    {/* Pixelated corners */}
                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500/40" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500/40" />
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500/40" />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500/40" />

                    <div
                        className="p-8 md:p-12 border-2 border-purple-500/30 bg-card/90 backdrop-blur-sm text-center space-y-8"
                        style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}
                    >
                        {/* Sparkles icon */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-2 border-purple-500/30">
                                    <Sparkles className="w-10 h-10 text-purple-400" />
                                </div>

                                {/* Glow */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl -z-10"
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        </motion.div>

                        {/* Heading */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <h1 className="text-3xl md:text-4xl font-minecraft-seven bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                Hold Up!
                            </h1>
                            <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground leading-relaxed">
                                We need to know who you are to show you your personalized Wrapped!
                            </p>
                            <p className="text-sm font-minecraft-ten text-muted-foreground/70">
                                Sign in with Discord to see your epic 2025 year in review.
                            </p>
                        </motion.div>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="space-y-3"
                        >
                            <DiscordButton />

                            <Link
                                href="/home"
                                className="block"
                            >
                                <div className="relative group">
                                    {/* Pixel corners */}
                                    <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />
                                    <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-border/50 group-hover:bg-border transition-colors" />

                                    <div
                                        className="w-full px-4 py-3 border border-border/50 bg-card/50 group-hover:bg-card group-hover:border-border transition-all"
                                        style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
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
