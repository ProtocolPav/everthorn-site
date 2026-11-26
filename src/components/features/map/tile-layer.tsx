import { RLayerTile } from "rlayers";

import { minecraftViewProjection, tileGrid } from "@/lib/map-projections.ts";

function buildTileUrl(layer: string): string {
    // Tiles go through the /api/geode proxy route. In dev, use the production proxy.
    const base = import.meta.env.DEV ? "https://everthorn.net/api/geode" : "/api/geode";
    return `${base}/maps/${layer}/{z}/{x}/{y}`;
}

interface WorldTileLayerProps {
    layer: string;
}

function WorldTileLayer({ layer }: WorldTileLayerProps) {
    return (
        <RLayerTile
            // Re-mount on layer change so the old dimension's tiles never flash under the new one
            key={layer}
            url={buildTileUrl(layer)}
            tileGrid={tileGrid}
            projection={minecraftViewProjection}
            // Crisp block pixels when upscaling past the native tile zoom
            noIterpolation={true}
        />
    );
}

export { WorldTileLayer };
