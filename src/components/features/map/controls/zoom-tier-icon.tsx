import { cn } from "@/lib/utils";
import type { ZoomTierId } from "@/components/features/map/core/edge-zoom.ts";

interface Sprite {
    /** One string per row, one character per pixel; `.` is transparent. */
    rows: string[];
    palette: Record<string, string>;
}

/** Artwork for each tier, served from `public/`. */
const IMAGES: Partial<Record<ZoomTierId, { src: string; pixelated?: boolean }>> = {
    phantom: { src: "/map/ui/zoom/phantom.webp" },
    // Flat pixel art, so keep the pixels hard-edged when scaled
    elytra: { src: "/map/ui/zoom/elytra.png", pixelated: true },
    parrot: { src: "/map/ui/zoom/parrot.webp" },
    bee: { src: "/map/ui/zoom/bee.webp" },
};

/** Warm the cache so the icon doesn't pop in the first time a tier is reached mid-drag. */
export function preloadZoomTierImages() {
    for (const image of Object.values(IMAGES)) new Image().src = image.src;
}

// Hand-drawn pixel art for tiers without artwork
const SPRITES: Partial<Record<ZoomTierId, Sprite>> = {
    // Facing right, segmented and low to the ground
    silverfish: {
        rows: [
            "...........a.",
            "....ssss..a..",
            "..ssLLssss...",
            ".sLLsLLsLLss.",
            "sLSSsSSsSSkSs",
            "sSSSsSSsSSSSs",
            ".ssssssssssss",
            "..d.d.d.d.d..",
        ],
        palette: { s: "#4f5661", S: "#9aa3ad", L: "#c9d0d8", k: "#111111", a: "#7a828c", d: "#3a3f47" },
    },
};

/** Indicator icon for a zoom tier: its artwork, or a pixel-art sprite drawn as crisp SVG squares. */
export function ZoomTierIcon({ tier, className }: { tier: ZoomTierId; className?: string }) {
    const image = IMAGES[tier];
    if (image) {
        return (
            <img
                src={image.src}
                alt=""
                draggable={false}
                className={cn("object-contain", image.pixelated && "[image-rendering:pixelated]", className)}
                aria-hidden="true"
            />
        );
    }

    const sprite = SPRITES[tier];
    if (!sprite) return null;
    const { rows, palette } = sprite;
    const width = Math.max(...rows.map((row) => row.length));
    const height = rows.length;
    // Square viewBox so every sprite sits centred at the same size
    const size = Math.max(width, height);
    const offsetX = (size - width) / 2;
    const offsetY = (size - height) / 2;

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            shapeRendering="crispEdges"
            className={className}
            aria-hidden="true"
        >
            {rows.flatMap((row, y) =>
                [...row].map((pixel, x) =>
                    pixel === "." || pixel === " " ? null : (
                        <rect
                            key={`${x}-${y}`}
                            x={x + offsetX}
                            y={y + offsetY}
                            width={1}
                            height={1}
                            fill={palette[pixel]}
                        />
                    ),
                ),
            )}
        </svg>
    );
}
