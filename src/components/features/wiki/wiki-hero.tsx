import { motion } from "motion/react";

interface WikiHeroProps {
    totalArticles?: number;
}

export function WikiHero({ totalArticles }: WikiHeroProps) {
    return (
        <section className="relative overflow-hidden border-b">
            {/* Warm parchment wash — light */}
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    background:
                        "linear-gradient(155deg, oklch(0.975 0.012 80) 0%, oklch(0.96 0.018 70) 35%, oklch(0.945 0.022 60) 65%, oklch(0.965 0.015 75) 100%)",
                }}
            />
            {/* Warm parchment wash — dark */}
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    background:
                        "linear-gradient(155deg, oklch(0.18 0.012 60) 0%, oklch(0.16 0.015 50) 35%, oklch(0.145 0.018 45) 65%, oklch(0.17 0.012 55) 100%)",
                }}
            />

            {/* Warm radial glow — light */}
            <div
                className="absolute inset-0 dark:hidden"
                style={{
                    background:
                        "radial-gradient(ellipse 65% 60% at 35% 55%, oklch(0.91 0.035 65 / 0.55) 0%, transparent 70%)",
                }}
            />
            {/* Warm radial glow — dark */}
            <div
                className="absolute inset-0 hidden dark:block"
                style={{
                    background:
                        "radial-gradient(ellipse 65% 60% at 35% 55%, oklch(0.26 0.03 55 / 0.5) 0%, transparent 70%)",
                }}
            />

            {/* Texture overlay */}
            <div
                className="absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            <div className="relative px-5 md:px-10 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <div className="flex items-center gap-3 mb-5">
                        <div className="h-px w-8 bg-foreground/30" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                            The Archives
                        </span>
                    </div>

                    <h1 className="wiki-title">
                        <span className="wiki-title-pixel">Everthorn</span>
                        <span className="wiki-title-calligraphy">Chronicles</span>
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-6 mt-6">
                        Every story begins with a single block. Browse the histories, legends, and tales
                        written by the people who lived them — the community of Everthorn.
                    </p>

                    {totalArticles !== undefined && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                            <span className="font-mono tabular-nums">{totalArticles} articles</span>
                            <div className="h-3 w-px bg-border" />
                            <span>Written by the community</span>
                        </div>
                    )}
                </motion.div>
            </div>

            <style>{`
                .wiki-title {
                    display: flex;
                    flex-direction: column;
                    font-weight: normal;
                    line-height: 1;
                    margin-bottom: 0.25rem;
                }

                .wiki-title-pixel {
                    font-family: var(--font-minecraft-ten);
                    font-size: clamp(3rem, 2rem + 3.33vw, 5rem);
                    font-weight: normal;
                    color: var(--foreground);
                    position: relative;
                    z-index: 2;
                    animation: wiki-pixel-in 0.7s ease-out both;
                    animation-delay: 0.35s;
                }

                .wiki-title-calligraphy {
                    font-family: var(--font-jacquard);
                    font-size: clamp(3.75rem, 2rem + 5.83vw, 6.25rem);
                    font-weight: normal;
                    letter-spacing: 0.01em;
                    color: oklch(0.44 0.14 52);
                    text-shadow:
                        0 2px 3px oklch(0.36 0.10 48 / 0.15),
                        0 0 16px oklch(0.62 0.06 56 / 0.08);
                    margin-top: -0.875rem;
                    position: relative;
                    z-index: 3;
                    animation: wiki-calligraphy-in 0.8s ease-out both;
                    animation-delay: 0.55s;
                }

                @keyframes wiki-pixel-in {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes wiki-calligraphy-in {
                    from {
                        opacity: 0;
                        transform: translateY(12px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .dark .wiki-title-calligraphy {
                    color: oklch(0.72 0.12 60);
                    text-shadow:
                        0 2px 4px oklch(0.18 0.04 48 / 0.35),
                        0 0 22px oklch(0.65 0.10 55 / 0.15);
                }

                @media (prefers-reduced-motion: reduce) {
                    .wiki-title-pixel,
                    .wiki-title-calligraphy {
                        animation: none;
                    }
                }
            `}</style>
        </section>
    );
}
