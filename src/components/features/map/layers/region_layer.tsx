import { Polygon } from "react-leaflet";
import React from "react";
import { REGIONS } from "@/lib/map-regions";
import { Toggle } from "@/types/map-toggle";

export const RegionLayer = React.memo(({ toggle }: { toggle: Toggle }) => {
    if (!toggle.visible) return null;

    return (
        <>
            {REGIONS.map((region) => {
                // Convert Minecraft [x, z] to Leaflet [-z, x]
                const positions = region.polygon.map(([x, z]) => [-z, x] as [number, number]);

                return (
                    <Polygon
                        key={region.id}
                        positions={positions}
                        pathOptions={{
                            color: region.color,
                            weight: 2,
                            opacity: 1,
                            fill: true,
                            fillColor: region.color,
                            fillOpacity: 0.2,
                        }}
                    />
                );
            })}
        </>
    );
});

RegionLayer.displayName = "RegionLayer";
