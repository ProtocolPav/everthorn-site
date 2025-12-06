// components/features/wrapped/sections/outro-section.tsx
"use client"

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { EverthornWrappedEnriched } from '@/types/wrapped';

interface OutroSectionProps {
    username: string;
    wrapped: EverthornWrappedEnriched;
    year?: number;
}

export function OutroSection({ username, wrapped, year = 2025 }: OutroSectionProps) {
    const totalHours = wrapped.playtime ? Math.round(wrapped.playtime.total_seconds / 3600) : 0;
    const questsCompleted = wrapped.quests?.total_completed || 0;
    const topPerson = wrapped.social?.favourite_people[0];

    return (
        <div className="space-y-0">
            {/* Main outro section */}
            <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 py-12">
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

                <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
                    {/* Main message */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="space-y-6"
                    >
                        <p className="text-xs font-minecraft-ten text-purple-400 tracking-[0.3em] uppercase">
                            That's A Wrap
                        </p>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-minecraft-seven text-foreground/90 leading-tight">
                            What a year, {username}!
                        </h1>

                        <p className="text-lg md:text-xl font-minecraft-seven text-muted-foreground max-w-2xl mx-auto">
                            You've built, explored, battled, and created memories that will last forever.
                        </p>
                    </motion.div>

                    {/* Year badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 120 }}
                        className="relative inline-block"
                    >
                        <div className="text-8xl md:text-9xl font-minecraft-seven bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                            {year}
                        </div>

                        {/* Glow */}
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-2xl -z-10"
                            animate={{
                                scale: [1, 1.15, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>

                    {/* Thank you message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-4"
                    >
                        <p className="text-base md:text-lg font-minecraft-ten text-foreground/80">
                            Thanks for being part of Everthorn
                        </p>
                        <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground/60">
                            Here's to another amazing year ahead!
                        </p>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
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
                            Scroll to Share
                        </span>
                        <ChevronDown className="w-6 h-6 text-primary/60" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Share card section - super compact, screenshot-friendly */}
            {/* Share card section - super compact, screenshot-friendly */}
            <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-background to-muted/20">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-md"
                >
                    {/* Share card - pixelated theme */}
                    <div className="relative">
                        {/* Pixelated corners */}
                        <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary/30" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/30" />
                        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-primary/30" />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary/30" />

                        <div
                            className="p-6 border-2 border-primary/30 bg-card/90 backdrop-blur-sm shadow-2xl"
                            style={{ clipPath: 'polygon(8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px), 0 8px)' }}
                        >
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="text-center space-y-1 pb-3">
                                    <h2 className="text-2xl font-minecraft-seven bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                        {username}
                                    </h2>
                                    <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-wider">
                                        Everthorn {year}
                                    </p>
                                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                                </div>

                                {/* Compact stats grid - 2x2 */}
                                <div className="grid grid-cols-2 gap-2">
                                    {/* Hours */}
                                    <div className="relative p-3 border border-blue-500/30 bg-blue-500/5">
                                        <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-blue-500/40" />
                                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500/40" />
                                        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-blue-500/40" />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-blue-500/40" />

                                        <p className="font-minecraft-seven text-xl text-blue-400">{totalHours}h</p>
                                        <p className="font-minecraft-ten text-[10px] text-muted-foreground uppercase">Played</p>
                                    </div>

                                    {/* Quests */}
                                    <div className="relative p-3 border border-emerald-500/30 bg-emerald-500/5">
                                        <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-emerald-500/40" />
                                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500/40" />
                                        <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-emerald-500/40" />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500/40" />

                                        <p className="font-minecraft-seven text-xl text-emerald-400">{questsCompleted}</p>
                                        <p className="font-minecraft-ten text-[10px] text-muted-foreground uppercase">Quests</p>
                                    </div>

                                    {/* Kills */}
                                    {wrapped.interactions && (
                                        <div className="relative p-3 border border-red-500/30 bg-red-500/5">
                                            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-red-500/40" />
                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500/40" />
                                            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-red-500/40" />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500/40" />

                                            <p className="font-minecraft-seven text-xl text-red-400">
                                                {wrapped.interactions.kill_counts.reduce((sum, k) => sum + k.kill_count, 0)}
                                            </p>
                                            <p className="font-minecraft-ten text-[10px] text-muted-foreground uppercase">Kills</p>
                                        </div>
                                    )}

                                    {/* Blocks */}
                                    {wrapped.interactions && (
                                        <div className="relative p-3 border border-amber-500/30 bg-amber-500/5">
                                            <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-amber-500/40" />
                                            <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500/40" />
                                            <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-amber-500/40" />
                                            <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-amber-500/40" />

                                            <p className="font-minecraft-seven text-xl text-amber-400">
                                                {Math.floor((wrapped.interactions.blocks_placed + wrapped.interactions.blocks_mined) / 1000)}k
                                            </p>
                                            <p className="font-minecraft-ten text-[10px] text-muted-foreground uppercase">Blocks</p>
                                        </div>
                                    )}
                                </div>

                                {/* Player type - pixelated box */}
                                {wrapped.interactions?.player_type && (
                                    <div className="relative inline-block w-full">
                                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-purple-500/30" />
                                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500/30" />
                                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500/30" />
                                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-500/30" />

                                        <div
                                            className="px-4 py-2 border border-purple-500/30 bg-purple-500/5 text-center"
                                            style={{ clipPath: 'polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)' }}
                                        >
                                            <p className="text-xs font-minecraft-seven text-purple-400">
                                                {wrapped.interactions.player_type === 'Creator' ? 'ARCHITECT' :
                                                    wrapped.interactions.player_type === 'Destroyer' ? 'MINER' :
                                                        'ARTISAN'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Project + Person - stacked */}
                                <div className="space-y-2">
                                    {wrapped.projects && (
                                        <div className="border-l-2 border-teal-500/40 pl-3">
                                            <p className="font-minecraft-ten text-[10px] text-teal-400 uppercase mb-1">Favorite Project</p>
                                            <p className="font-minecraft-seven text-sm text-foreground/80 truncate">
                                                {wrapped.projects.favourite_project_name}
                                            </p>
                                        </div>
                                    )}

                                    {topPerson && (
                                        <div className="border-l-2 border-pink-500/40 pl-3">
                                            <p className="font-minecraft-ten text-[10px] text-pink-400 uppercase mb-1">Partner In Crime</p>
                                            <p className="font-minecraft-seven text-sm text-foreground/80 truncate">
                                                {topPerson.username}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="text-center pt-2">
                                    <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-2" />
                                    <p className="text-[10px] font-minecraft-seven text-muted-foreground/50 uppercase tracking-wider">
                                        everthorn.net/wrapped
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Screenshot instruction */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-4 text-xs font-minecraft-seven text-muted-foreground/70"
                    >
                        Screenshot to share!
                    </motion.p>
                </motion.div>
            </section>

        </div>
    );
}
