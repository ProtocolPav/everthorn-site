import {
    Projection,
    addProjection,
    addCoordinateTransforms,
    setUserProjection,
} from 'ol/proj';
import TileGrid from 'ol/tilegrid/TileGrid';

// Minecraft world bounds (matches your current maxBounds of ±2200)
const EXTENT: [number, number, number, number] = [-2200, -2200, 2200, 2200];

// 1. View Projection: standard Cartesian space where +Y renders UP on the canvas
export const minecraftViewProjection = new Projection({
    code: 'MINECRAFT_VIEW',
    units: 'pixels',
    extent: EXTENT,
});

// 2. Data Projection: Minecraft coordinates where -Z is North (UP) and +Z is South (DOWN)
export const minecraftProjection = new Projection({
    code: 'MINECRAFT',
    units: 'pixels',
    extent: EXTENT,
});

// 3. Register both projections with OpenLayers
addProjection(minecraftViewProjection);
addProjection(minecraftProjection);

// 4. Register the bidirectional axis transformation:
//    - Forward: Minecraft [x, z] -> View [x, -z] (negative Z becomes positive Y = UP)
//    - Inverse: View [x, y]      -> Minecraft [x, -y]
addCoordinateTransforms(
    'MINECRAFT',
    'MINECRAFT_VIEW',
    ([x, z]) => [x, -z],
    ([x, y]) => [x, -y]
);

// 5. Set 'MINECRAFT' as the global user projection.
//    OpenLayers will automatically transform all Point([x, z]) geometries and overlays.
setUserProjection(minecraftProjection);

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
    tileSize: 256,
});