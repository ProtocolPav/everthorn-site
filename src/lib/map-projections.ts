import { Projection } from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';

// Minecraft world bounds (matches your current maxBounds of ±2200)
const EXTENT: [number, number, number, number] = [-2200, -2200, 2200, 2200];

export const minecraftProjection = new Projection({
    code: 'MINECRAFT',
    units: 'pixels',
    extent: EXTENT,
    axisOrientation: 'eds', // X = East, Z = South (down) — matches Minecraft
});

// Resolutions matching your current minZoom: -5, maxZoom: 6
// Each zoom step halves the resolution. At zoom 0, 1 unit = 1 pixel.
export const RESOLUTIONS = [
    64,   // zoom -5
    16,   // zoom -4
    8,    // zoom -3
    4,    // zoom -2
    2,    // zoom -1
    1,    // zoom  0
    0.5,  // zoom  1
    0.25, // zoom  2
    0.125,// zoom  3
    0.0625,   // zoom  4
    0.03125,  // zoom  5
    0.015625, // zoom  6
];

export const tileGrid = new TileGrid({
    origin: [0, 0],
    resolutions: RESOLUTIONS,
    tileSize: 256
});