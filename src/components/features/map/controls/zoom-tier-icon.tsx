import type { ZoomTierId } from "@/components/features/map/core/edge-zoom.ts";

interface Sprite {
    /** One string per row, one character per pixel; `.` is transparent. */
    rows: string[];
    palette: Record<string, string>;
}

// Hand-drawn pixel art in a blocky, Minecraft-ish style
const SPRITES: Record<ZoomTierId, Sprite> = {
    // Seen from below, wings spread, high up in the night sky
    phantom: {
        rows: [
            "b............b",
            "bb..........bb",
            ".bbb..dd..bbb.",
            "..bbbbddbbbb..",
            "...bbgddgbb...",
            "....bddddb....",
            ".....dddd.....",
            "......dd......",
            "......d.......",
        ],
        palette: { b: "#5a6f9e", d: "#34416a", g: "#8cff6b" },
    },
    elytra: {
        rows: [
            "...oooooo...",
            "..oGGoOGGo..",
            ".oGGGooGGGo.",
            ".oGGo..oGGo.",
            "oGGGo..oGGGo",
            "oGGo....oGGo",
            "oGGo....oGGo",
            "oGo......oGo",
            "oo........oo",
        ],
        palette: { o: "#5b5468", G: "#a99fbe", O: "#7d7590" },
    },
    // Facing right, perched mid-flight
    parrot: {
        rows: [
            "....RRRR...",
            "...RRRRRYY.",
            "...RRwkRYYY",
            "...RRRRR.YY",
            "..BBRRRR...",
            ".BBBBRRR...",
            "BBBByRRR...",
            "BBB.yyRR...",
            "BB...RR....",
            "B....R.....",
        ],
        palette: { R: "#d8342c", B: "#2f6bd9", Y: "#f2c230", y: "#f2c230", w: "#ffffff", k: "#1b1b1b" },
    },
    // Facing right, little stinger at the back
    bee: {
        rows: [
            "....ww.ww...",
            "....wwwww...",
            "..yykyykyyy.",
            "tyykyykyywk.",
            ".yykyykyykk.",
            "..yykyykyyy.",
            "...k...k....",
        ],
        palette: { y: "#f4c531", k: "#2b2116", w: "#d8f1ff", t: "#9a9a9a" },
    },
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

/** Pixel-art indicator for a zoom tier, drawn as crisp SVG squares. */
export function ZoomTierIcon({ tier, className }: { tier: ZoomTierId; className?: string }) {
    const { rows, palette } = SPRITES[tier];
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
