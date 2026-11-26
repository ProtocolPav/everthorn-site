import {
    Projection,
    addProjection,
    addCoordinateTransforms,
    setUserProjection,
} from "ol/proj";
import TileGrid from "ol/tilegrid/TileGrid";
import type { Extent } from "ol/extent";

/**
 * Coordinate system
 * -----------------
 * Everything the app hands to OpenLayers (feature geometries, overlay positions, view centers,
 * event coordinates) is in plain Minecraft `[x, z]`. OpenLayers renders in a "view" projection
 * where +Y is up, so the only difference is the sign of Z (north = -Z = up).
 *
 * Zoom levels
 * -----------
 * The OL zoom level is the same as the Geode tile zoom (`/maps/{layer}/{z}/{x}/{y}`).
 * At zoom 6 one block is one screen pixel. The old Leaflet map (and the `?zoom=` URL param)
 * used `L.CRS.Simple` zoom levels, which are offset by 6: `olZoom = legacyZoom + LEGACY_ZOOM_OFFSET`.
 */

/** Soft pan bounds, in blocks (was Leaflet `maxBounds` ±5000). */
export const WORLD_BOUNDS = 5000;
const EXTENT: Extent = [-WORLD_BOUNDS, -WORLD_BOUNDS, WORLD_BOUNDS, WORLD_BOUNDS];

/** View projection: Cartesian, +Y renders up. */
export const minecraftViewProjection = new Projection({
    code: "MINECRAFT_VIEW",
    units: "pixels",
    extent: EXTENT,
});

/** Data projection: Minecraft `[x, z]`, where -Z is north (up). */
export const minecraftProjection = new Projection({
    code: "MINECRAFT",
    units: "pixels",
    extent: EXTENT,
});

addProjection(minecraftViewProjection);
addProjection(minecraftProjection);

addCoordinateTransforms(
    minecraftProjection,
    minecraftViewProjection,
    ([x, z]) => [x, -z],
    ([x, y]) => [x, -y],
);

// All OL API calls (geometries, overlays, view.animate/fit, event.coordinate) now take Minecraft [x, z].
setUserProjection(minecraftProjection);

export const LEGACY_ZOOM_OFFSET = 6;

export const MAP_ZOOM = {
    /** Leaflet minZoom -5 */
    min: 1,
    /** Leaflet maxZoom 6 */
    max: 12,
    /** Leaflet zoom 0: 1 block = 1px */
    default: 6,
    /** Highest zoom Geode serves tiles for (Leaflet maxNativeZoom 2). Beyond this tiles are upscaled. */
    maxNative: 8,
} as const;

/** Converts a legacy Leaflet zoom (used by the `?zoom=` URL param) to an OL zoom. */
export function fromLegacyZoom(zoom: number): number {
    return zoom + LEGACY_ZOOM_OFFSET;
}

/** Converts an OL zoom to a legacy Leaflet zoom (used by the `?zoom=` URL param). */
export function toLegacyZoom(zoom: number): number {
    return zoom - LEGACY_ZOOM_OFFSET;
}

function resolutionForZoom(zoom: number): number {
    return 2 ** (LEGACY_ZOOM_OFFSET - zoom);
}

/** View resolutions, index = OL zoom. Zoom 0 = 64 blocks/px … zoom 12 = 1/64 block/px. */
export const VIEW_RESOLUTIONS = Array.from({ length: MAP_ZOOM.max + 1 }, (_, z) => resolutionForZoom(z));

/** Tile levels Geode serves (0…8). OpenLayers upscales level 8 when zoomed in further. */
export const tileGrid = new TileGrid({
    origin: [0, 0],
    resolutions: VIEW_RESOLUTIONS.slice(0, MAP_ZOOM.maxNative + 1),
    tileSize: 256,
});

/** Soft pan constraint, the OL equivalent of Leaflet `maxBounds` + `maxBoundsViscosity`. */
export const VIEW_EXTENT = EXTENT;
