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

export const RESOLUTIONS = [
    64,         // OL  0 → API -6
    32,         // OL  1 → API -5
    16,         // OL  2 → API -4
    8,          // OL  3 → API -3
    4,          // OL  4 → API -2
    2,          // OL  5 → API -1
    1,          // OL  6 → API  0
    0.5,        // OL  7 → API  1
    0.25,       // OL  8 → API  2  ← last real tile zoom
    0.125,      // OL  9 → image zoom only
    0.0625,     // OL 10 → image zoom only
    0.03125,    // OL 11 → image zoom only
];

export const tileGrid = new TileGrid({
    origin: [0, 0],
    resolutions: RESOLUTIONS,
    tileSize: 512
});