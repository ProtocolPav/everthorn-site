import { MAP_ZOOM } from "../../../../lib/map-projections.ts";

/** Screen pixels of vertical thumb travel per zoom level. */
export const PX_PER_ZOOM_LEVEL = 60;

/**
 * Zoom for an edge-strip drag. Dragging up (`dy < 0`) zooms in, down zooms out, like Snapchat's
 * record-button zoom. Clamped to the map's zoom range.
 */
export function dragZoom(startZoom: number, dy: number): number {
    const zoom = startZoom - dy / PX_PER_ZOOM_LEVEL;
    return Math.min(MAP_ZOOM.max, Math.max(MAP_ZOOM.min, zoom));
}

export type ZoomTierId = "phantom" | "elytra" | "parrot" | "bee" | "silverfish";

export interface ZoomTier {
    id: ZoomTierId;
    label: string;
    /** Highest rounded OL zoom that still shows this tier. */
    maxZoom: number;
}

/** From the sky down to the ground: what's flying (or crawling) at this height. */
export const ZOOM_TIERS: readonly ZoomTier[] = [
    { id: "phantom", label: "Phantom", maxZoom: 3 },
    { id: "elytra", label: "Elytra", maxZoom: 5 },
    { id: "parrot", label: "Parrot", maxZoom: 7 },
    { id: "bee", label: "Bee", maxZoom: 9 },
    { id: "silverfish", label: "Silverfish", maxZoom: MAP_ZOOM.max },
];

export function zoomTier(zoom: number): ZoomTier {
    const level = Math.round(zoom);
    return ZOOM_TIERS.find((tier) => level <= tier.maxZoom) ?? ZOOM_TIERS[ZOOM_TIERS.length - 1];
}
