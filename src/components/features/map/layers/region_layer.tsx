import React from "react";
import { RFeature, RLayerVector } from "rlayers";
import { Polygon } from "ol/geom";

import { REGIONS } from "@/lib/map-regions";
import { createRegionPolygonStyle } from "@/lib/map-styles.tsx";
import type { Toggle } from "@/types/map-toggle";
import { MAP_LAYER_Z } from "@/components/features/map/core/layer-order.ts";

// Region polygons are static, so build their geometry and style once
const REGION_SHAPES = REGIONS.map((region) => ({
    id: region.id,
    geometry: new Polygon([region.polygon]),
    style: createRegionPolygonStyle(region.color),
}));

export const RegionLayer = React.memo(({ toggle }: { toggle: Toggle }) => {
    if (!toggle.visible || REGION_SHAPES.length === 0) return null;

    return (
        <RLayerVector zIndex={MAP_LAYER_Z.regions}>
            {REGION_SHAPES.map((region) => (
                <RFeature key={region.id} geometry={region.geometry} style={region.style} />
            ))}
        </RLayerVector>
    );
});

RegionLayer.displayName = "RegionLayer";
