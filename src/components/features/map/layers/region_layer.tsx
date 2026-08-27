import React from "react";
import { Polygon } from "ol/geom";
import { RLayerVector, RFeature, RStyle } from "rlayers";
import { REGIONS } from "@/lib/map-regions";
import { Toggle } from "@/types/map-toggle";

export const RegionLayer = React.memo(({ toggle }: { toggle: Toggle }) => {
    if (!toggle.visible) return null;

    return (
        <RLayerVector zIndex={5}>
            {REGIONS.map((region) => {
                const ring = region.polygon.map(([x, z]) => [x, z] as [number, number]);
                // close ring if needed
                if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
                    ring.push([ring[0][0], ring[0][1]]);
                }
                return (
                    <RFeature key={region.id} geometry={new Polygon([ring])}>
                        <RStyle.RStyle>
                            <RStyle.RStroke color={region.color} width={2} />
                            <RStyle.RFill color={`${region.color}33`} />
                        </RStyle.RStyle>
                    </RFeature>
                );
            })}
        </RLayerVector>
    );
});

RegionLayer.displayName = "RegionLayer";
