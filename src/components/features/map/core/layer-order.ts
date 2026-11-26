/**
 * Draw order of the live map's layers (OL `zIndex`). Matches the old Leaflet panes: tiles,
 * then shapes (overlay pane), then markers (marker pane). Labels and popups are DOM overlays and
 * always sit above every canvas layer, like Leaflet's tooltip/popup panes.
 */
export const MAP_LAYER_Z = {
    tiles: 0,
    regions: 10,
    outlines: 20,
    markers: 30,
    spider: 40,
    players: 50,
} as const;
