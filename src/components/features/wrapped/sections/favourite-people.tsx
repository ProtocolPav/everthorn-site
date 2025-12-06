// components/features/wrapped/sections/favorite-people.tsx
"use client"

import { motion, useInView } from 'motion/react';
import { useRef, useMemo } from 'react';
import { FavouritePersonEnriched } from '@/types/wrapped';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface FavoritePeopleProps {
    people: FavouritePersonEnriched[];
}

export function FavoritePeople({ people }: FavoritePeopleProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });

    // Get Discord avatar using third-party API
    const getDiscordAvatar = (user: FavouritePersonEnriched['user']): string | undefined => {
        if (!user?.user_id) return undefined;
        return `https://discordpfp.vercel.app/api/avatar?id=${user.user_id}`;
    };

    // Generate gradient color based on username for fallback
    const getUserGradient = (username: string): string => {
        const gradients = [
            'from-pink-500 via-rose-500 to-red-500',
            'from-purple-500 via-violet-500 to-indigo-500',
            'from-blue-500 via-cyan-500 to-teal-500',
            'from-green-500 via-emerald-500 to-teal-500',
            'from-amber-500 via-orange-500 to-red-500',
            'from-fuchsia-500 via-pink-500 to-rose-500',
        ];

        const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return gradients[hash % gradients.length];
    };

    const stats = useMemo(() => {
        const topPerson = people[0];
        const topHours = topPerson ? Math.round(topPerson.seconds_played_together / 3600) : 0;

        return {
            topPerson,
            topHours,
            topThree: people.slice(0, 3),
        };
    }, [people]);

    // Format hours played together
    const formatTime = (seconds: number): string => {
        const hours = Math.round(seconds / 3600);
        if (hours < 1) {
            return `${Math.round(seconds / 60)} min`;
        }
        return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    };

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
                <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-pink-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-rose-500/8 rounded-full blur-3xl" />
            </motion.div>

            <div className="max-w-4xl w-full space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <p className="text-xs font-minecraft-ten text-pink-400 tracking-[0.3em] uppercase mb-4">
                        Community
                    </p>
                    <h2 className="text-3xl md:text-4xl font-minecraft-ten text-foreground/90">
                        Your Favorite People
                    </h2>
                </motion.div>

                {/* Top person highlight */}
                {stats.topPerson && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-center space-y-6"
                    >
                        <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                            You spent the most time with
                        </p>

                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 120 }}
                            className="flex justify-center"
                        >
                            <div className="relative">
                                <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-pink-400/30 shadow-2xl">
                                    <AvatarImage
                                        src={getDiscordAvatar(stats.topPerson.user)}
                                        alt={stats.topPerson.username}
                                    />
                                    <AvatarFallback className={`text-5xl md:text-6xl font-minecraft-seven bg-gradient-to-br ${getUserGradient(stats.topPerson.username)} text-white`}>
                                        {stats.topPerson.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                {/* Glow effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/30 to-rose-500/30 blur-xl -z-10"
                                    animate={{
                                        scale: [1, 1.15, 1],
                                        opacity: [0.3, 0.6, 0.3]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                        </motion.div>

                        {/* Username */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 0.6 }}
                        >
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-minecraft-seven bg-gradient-to-r from-pink-400 via-rose-400 to-red-400 text-transparent bg-clip-text">
                                {stats.topPerson.username}
                            </h1>
                        </motion.div>

                        {/* Time together */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            transition={{ delay: 0.8 }}
                            className="space-y-2"
                        >
                            <p className="text-base md:text-lg font-minecraft-seven text-muted-foreground">
                                You played together for
                            </p>
                            <div className="text-5xl md:text-6xl font-minecraft-seven bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
                                {stats.topHours}
                            </div>
                            <p className="text-xl md:text-2xl font-minecraft-ten text-pink-400/80 uppercase tracking-wide">
                                {stats.topHours === 1 ? 'Hour' : 'Hours'}
                            </p>
                            <p className="text-sm md:text-base font-minecraft-seven text-muted-foreground/70 italic pt-2">
                                {stats.topHours > 50
                                    ? "True companions on this journey!"
                                    : stats.topHours > 20
                                        ? "Partnership goals!"
                                        : stats.topHours > 10
                                            ? "Great adventures together!"
                                            : "Quality time well spent!"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {/* Runner ups */}
                {stats.topThree.length > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                        className="max-w-2xl mx-auto"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-center">
                                <div className="h-px flex-1 max-w-24 bg-border" />
                                <p className="text-xs font-minecraft-ten text-muted-foreground uppercase tracking-widest">
                                    Also Playing With
                                </p>
                                <div className="h-px flex-1 max-w-24 bg-border" />
                            </div>

                            {/* List of other players */}
                            <div className="space-y-3">
                                {stats.topThree.slice(1).map((person, index) => (
                                    <motion.div
                                        key={person.other_player_id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                        transition={{ delay: 1.1 + (index * 0.1) }}
                                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
                                    >
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-12 h-12 border-2 border-pink-400/20 shadow-lg">
                                                <AvatarImage
                                                    src={getDiscordAvatar(person.user)}
                                                    alt={person.username}
                                                />
                                                <AvatarFallback className={`text-lg font-minecraft-seven bg-gradient-to-br ${getUserGradient(person.username)} text-white`}>
                                                    {person.username.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-minecraft-ten text-base md:text-lg text-foreground/90">
                                                    {person.username}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl md:text-2xl font-minecraft-seven text-pink-400/70">
                                                {formatTime(person.seconds_played_together)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                                transition={{ delay: 1.4 }}
                                className="text-center text-sm font-minecraft-seven text-muted-foreground/60 pt-2"
                            >
                                Your trusted crew!
                            </motion.p>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
