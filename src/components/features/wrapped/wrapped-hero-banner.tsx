// components/features/wrapped/wrapped-hero-banner.tsx
"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

const RELEASE_DATE = new Date("2025-12-12T00:00:00Z");

export function WrappedHeroBanner() {
    const now = new Date();
    const isBeforeRelease = now < RELEASE_DATE;

    const title = isBeforeRelease
        ? "Everthorn Wrapped Arrives Soon"
        : "Your Everthorn Wrapped";
    const subtitle = isBeforeRelease
        ? "Unlocks on December 12th. Get ready for your 2025 story"
        : "See your 2025 year in review";

    return (
        <Link href="/wrapped" className="group relative block">
            {/* Pixelated corners */}
            <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />

            <div
                className="relative p-4 md:p-6 border-2 border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 group-hover:border-purple-500/60 transition-all overflow-hidden"
                style={{
                    clipPath:
                        "polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)",
                }}
            >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
                            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-minecraft-seven text-lg md:text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">
                                {title}
                            </h3>
                            <p className="text-xs md:text-sm font-minecraft-ten text-muted-foreground">
                                {subtitle}
                            </p>
                        </div>
                    </div>

                    {!isBeforeRelease && (
                        <div className="flex-shrink-0 flex items-center gap-1 font-minecraft-ten text-xs md:text-sm text-purple-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">
                            View
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
