import { Polygon } from "react-leaflet";
import React from "react";
import { REGIONS } from "@/lib/map-regions";
import { Toggle } from "@/types/map-toggle";
import { EditablePolygon } from "@/components/features/map/ediatable-polygon";

interface RegionLayerProps {
    toggle: Toggle;
    isEditing?: boolean;
    onRegionUpdate?: (regionId: string, newPolygon: [number, number][]) => void;
}

export const RegionLayer = React.memo(({ toggle, isEditing = false, onRegionUpdate }: RegionLayerProps) => {
    if (!toggle.visible) return null;

    return (
        <>
            {REGIONS.map((region) => {
                // Convert Minecraft [x, z] to Leaflet [-z, x]
                const positions = region.polygon.map(([x, z]) => [-z, x] as [number, number]);

                if (isEditing) {
                    return (
                        <EditablePolygon
                            key={region.id}
                            id={region.id}
                            initialPositions={positions}
                            color={region.color}
                            onUpdate={(id, newPositions) => {
                                // Convert Leaflet [-z, x] back to Minecraft [x, z]
                                const minecraftPositions = newPositions.map(([lat, lng]) => [lng, -lat] as [number, number]);
                                if (onRegionUpdate) {
                                    onRegionUpdate(id, minecraftPositions);
                                }
                            }}
                        />
                    );
                }

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
