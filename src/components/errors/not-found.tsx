import { HouseIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function NotFoundScreen() {
    return (
        <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
            {/* Repeated 404s in background - responsive visibility and positioning */}
            <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
                {/* Show fewer/smaller 404s on mobile */}
                <span className="hidden md:block absolute -top-20 -left-32 text-[20rem] lg:text-[28rem] font-black text-foreground/[0.02] leading-none">
                    404
                </span>
                <span className="absolute top-1/4 -right-20 md:-right-40 text-[14rem] md:text-[20rem] lg:text-[24rem] font-black text-foreground/[0.025] md:text-foreground/[0.03] leading-none rotate-12">
                    404
                </span>
                <span className="hidden sm:block absolute -bottom-20 md:-bottom-32 left-1/4 text-[18rem] md:text-[24rem] lg:text-[30rem] font-black text-foreground/[0.02] leading-none -rotate-6">
                    404
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12rem] md:text-[16rem] lg:text-[20rem] font-black text-foreground/[0.03] md:text-foreground/[0.04] leading-none">
                    404
                </span>
            </div>

            {/* Main content - with better contrast on mobile */}
            <div className="relative z-10 w-full max-w-4xl space-y-6 sm:space-y-8">
                {/* Giant bold 404 */}
                <div className="space-y-4 sm:space-y-6">
                    <h1 className="text-[8rem] sm:text-[12rem] md:text-[16rem] lg:text-[18rem] xl:text-[20rem] font-black leading-[0.85] tracking-tighter">
                        <span className="block bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent drop-shadow-sm">
                            404
                        </span>
                    </h1>

                    <div className="space-y-2 sm:space-y-3">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-none">
                            Page Not
                            <br />
                            Found
                        </h2>
                        <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed">
                            The page you're looking for doesn't exist or has been moved to another location.
                        </p>
                    </div>
                </div>

                {/* Action buttons - mobile optimized */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sm:pt-4">
                    <Link to="/" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <HouseIcon className="mr-2 h-5 w-5" weight="bold" />
                            Return Home
                        </Button>
                    </Link>

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeftIcon className="mr-2 h-5 w-5" weight="bold" />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
