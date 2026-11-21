import { motion } from "motion/react";

const DIAMOND_LATTICE_SVG = `<svg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'><g fill='none' stroke='#ffffff' stroke-width='0.8'><path d='M30 0L60 30L30 60L0 30Z'/><path d='M30 10L50 30L30 50L10 30Z'/></g></svg>`;
const PATTERN_OPACITY = "0.035";

export function WikiHero() {
    const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(DIAMOND_LATTICE_SVG)}")`;

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
                <div className="max-w-4xl">
                    <h1 className="flex flex-col font-normal leading-none mb-1">
                        <motion.span
                            className="font-minecraft-ten text-[clamp(3rem,2rem+3.33vw,5rem)] text-foreground relative z-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            Everthorn
                        </motion.span>

                        <motion.span
                            className="font-jacquard text-[clamp(3.75rem,2rem+5.83vw,6.25rem)] tracking-[0.01em] text-[oklch(0.44_0.14_52)] dark:text-[oklch(0.72_0.12_60)] [text-shadow:0_2px_3px_oklch(0.36_0.10_48/0.15),0_0_16px_oklch(0.62_0.06_56/0.08)] dark:[text-shadow:0_2px_4px_oklch(0.18_0.04_48/0.35),0_0_22px_oklch(0.65_0.10_55/0.15)] -mt-3.5 relative z-20 py-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                        >
                            Chronicles
                        </motion.span>
                    </h1>

                    <motion.p
                        className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mt-4 mb-6 relative z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                    >
                        The community-maintained encyclopedia of Everthorn. Dive into server history, explore player lore, or start writing pages to document your own adventures.
                    </motion.p>
                </div>
            </div>
        </section>
    );
}
