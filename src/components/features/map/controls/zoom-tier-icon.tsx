import { cn } from "@/lib/utils";
import type { ZoomTierId } from "@/components/features/map/core/edge-zoom.ts";

interface TierImage {
    src: string;
    /** Flat pixel art that should keep hard pixel edges when scaled. */
    pixelated?: boolean;
}

const IMAGES: Record<ZoomTierId, TierImage> = {
    phantom: { src: "/map/ui/zoom/phantom.webp" },
    elytra: { src: "/map/ui/zoom/elytra.png", pixelated: true },
    parrot: { src: "/map/ui/zoom/parrot.webp" },
    bee: { src: "/map/ui/zoom/bee.webp" },
    silverfish: { src: "/map/ui/zoom/silverfish.webp" },
};

/** Warm the cache so an icon doesn't pop in the first time its tier is reached mid-drag. */
export function preloadZoomTierImages() {
    for (const image of Object.values(IMAGES)) new Image().src = image.src;
}

/** Artwork for a zoom tier: what's flying (or crawling) at this height. */
export function ZoomTierIcon({ tier, className }: { tier: ZoomTierId; className?: string }) {
    const image = IMAGES[tier];
    return (
        <img
            src={image.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={cn(
                "object-contain drop-shadow-[0_2px_3px_rgba(0,0,0,0.45)]",
                image.pixelated && "[image-rendering:pixelated]",
                className,
            )}
        />
    );
}
