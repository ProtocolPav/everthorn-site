import { motion } from "motion/react";

interface WikiHeroProps {
    totalArticles?: number;
}

const patterns = {
    quillSwirls: `<svg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='1.2' stroke-linecap='round'><path d='M0 40C10 30 18 20 25 20S38 30 40 40 48 60 55 60 68 50 80 40'/><path d='M40 0C30 10 20 18 20 25S30 38 40 40 60 48 60 55 50 68 40 80'/></g></svg>`,

    scrollwork: `<svg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='1.2' stroke-linecap='round'><path d='M0 0C10 0 20 5 20 15S10 30 0 30'/><path d='M80 0C70 0 60 5 60 15S70 30 80 30'/><path d='M0 80C10 80 20 75 20 65S10 50 0 50'/><path d='M80 80C70 80 60 75 60 65S70 50 80 50'/><circle cx='40' cy='40' r='4'/><path d='M20 40C25 35 35 35 40 40S55 45 60 40'/><path d='M40 20C35 25 35 35 40 40S45 55 40 60'/></g></svg>`,

    isometricCubes: `<svg width='60' height='52' viewBox='0 0 60 52' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8'><path d='M30 0L60 15V42L30 52L0 42V15Z'/><path d='M30 0L0 15'/><path d='M30 0L60 15'/><path d='M30 52L30 26'/><path d='M0 15L30 26L60 15'/></g></svg>`,

    diamondLattice: `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8'><path d='M30 0L60 30L30 60L0 30Z'/><path d='M30 10L50 30L30 50L10 30Z'/></g></svg>`,

    vineLattice: `<svg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='1.2' stroke-linecap='round'><path d='M0 40C15 30 25 20 40 20S65 30 80 40'/><path d='M0 40C15 50 25 60 40 60S65 50 80 40'/><path d='M40 0C30 15 20 25 20 40S30 65 40 80'/><path d='M40 0C50 15 60 25 60 40S50 65 40 80'/></g></svg>`,

    gothicTracery: `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8' stroke-linecap='round'><path d='M30 5C30 5 20 20 20 30S25 45 30 55'/><path d='M30 5C30 5 40 20 40 30S35 45 30 55'/><path d='M20 30C23 27 27 27 30 30S37 33 40 30'/><path d='M15 15C20 20 25 25 30 25S40 20 45 15'/><path d='M15 45C20 40 25 35 30 35S40 40 45 45'/></g></svg>`,

    zellige: `<svg width='56' height='56' viewBox='0 0 56 56' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.7'><path d='M28 0L35 7L28 14L21 7Z'/><path d='M28 14L35 21L28 28L21 21Z'/><path d='M28 28L35 35L28 42L21 35Z'/><path d='M28 42L35 49L28 56L21 49Z'/><path d='M0 28L7 21L14 28L7 35Z'/><path d='M14 28L21 21L28 28L21 35Z'/><path d='M28 28L35 21L42 28L35 35Z'/><path d='M42 28L49 21L56 28L49 35Z'/></g></svg>`,

    quillDrops: `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='#ffffff'><circle cx='10' cy='10' r='1.5'/><circle cx='30' cy='5' r='1'/><circle cx='50' cy='10' r='1.5'/><circle cx='5' cy='30' r='1'/><circle cx='25' cy='25' r='1.2'/><circle cx='35' cy='30' r='0.8'/><circle cx='55' cy='30' r='1'/><circle cx='10' cy='50' r='1.5'/><circle cx='30' cy='45' r='1'/><circle cx='50' cy='50' r='1.5'/><circle cx='20' cy='40' r='0.8'/><circle cx='40' cy='42' r='1.2'/><circle cx='15' cy='55' r='0.8'/><circle cx='45' cy='55' r='0.8'/></g></svg>`,
};

const PATTERN_KEY: keyof typeof patterns = "diamondLattice";
const PATTERN_OPACITY = "0.035";

export function WikiHero({ totalArticles }: WikiHeroProps) {
    const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(patterns[PATTERN_KEY])}")`;

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

            {/* SVG texture pattern */}
            <div
                className="absolute inset-0"
                style={{
                    opacity: parseFloat(PATTERN_OPACITY),
                    backgroundImage: encodedPattern,
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
