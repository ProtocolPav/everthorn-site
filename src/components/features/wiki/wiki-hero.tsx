import { motion } from "motion/react";

interface WikiHeroProps {
    totalArticles?: number;
}

export function WikiHero({ totalArticles }: WikiHeroProps) {
    return (
        <section className="relative overflow-hidden border-b">
            {/* Background texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/30 to-background" />
            <div
                className="absolute inset-0 opacity-[0.03]"
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
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-foreground/30" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
                            The Archives
                        </span>
                    </div>

                    <h1 className="font-minecraft-ten text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-4">
                        Everthorn
                        <br />
                        <span className="text-muted-foreground font-almendra">Chronicles</span>
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed mb-6">
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
        </section>
    );
}
