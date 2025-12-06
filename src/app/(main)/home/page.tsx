import Hero from "./_sections/hero";
import Feature from "./_sections/feature";
import History from "./_sections/history";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

export default function IndexPage() {
    return (
        <section className="mx-5 grid items-center gap-6 pb-8 pt-6 md:mx-10 md:py-10 xl:mx-20">

            <Hero/>

            {/* Wrapped Banner */}
            {/*<Link href="/wrapped" className="group relative block">*/}
            {/*    /!* Pixelated corners *!/*/}
            {/*    <div className="absolute -top-1 -left-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />*/}
            {/*    <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />*/}
            {/*    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />*/}
            {/*    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors" />*/}

            {/*    <div*/}
            {/*        className="relative p-4 md:p-6 border-2 border-purple-500/40 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 group-hover:border-purple-500/60 transition-all overflow-hidden"*/}
            {/*        style={{ clipPath: 'polygon(12px 0, calc(100% - 12px) 0, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 12px), 0 12px)' }}*/}
            {/*    >*/}
            {/*        /!* Animated background gradient *!/*/}
            {/*        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />*/}

            {/*        <div className="relative flex items-center justify-between gap-4">*/}
            {/*            <div className="flex items-center gap-3 md:gap-4">*/}
            {/*                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">*/}
            {/*                    <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />*/}
            {/*                </div>*/}
            {/*                <div>*/}
            {/*                    <h3 className="font-minecraft-seven text-lg md:text-xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 text-transparent bg-clip-text">*/}
            {/*                        Your Everthorn Wrapped*/}
            {/*                    </h3>*/}
            {/*                    <p className="text-xs md:text-sm font-minecraft-ten text-muted-foreground">*/}
            {/*                        See your 2025 year in review*/}
            {/*                    </p>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className="flex-shrink-0 flex items-center gap-1 font-minecraft-ten text-xs md:text-sm text-purple-400 group-hover:text-purple-300 transition-colors uppercase tracking-wider">*/}
            {/*                View*/}
            {/*                <ChevronRight className="w-4 h-4" />*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Link>*/}

            <Feature className={'pt-16'}/>

            <History className={'mx-0 pt-16 md:mx-24'}/>

        </section>
    )
}
