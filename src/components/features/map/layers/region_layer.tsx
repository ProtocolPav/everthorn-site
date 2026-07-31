import React, { useEffect, useRef } from "react";
import { useRLayersComponent } from "rlayers";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Style, Fill, Stroke } from "ol/style";
import { REGIONS } from "@/lib/map-regions";
import type { Toggle } from "@/types/map-toggle";

interface RegionLayerProps {
    toggle: Toggle;
}

export const RegionLayer = React.memo(({ toggle }: RegionLayerProps) => {
    const { map } = useRLayersComponent();
    const layerRef = useRef<VectorLayer<VectorSource> | null>(null);

    useEffect(() => {
        if (!map) return;

        const source = new VectorSource();

        REGIONS.forEach((region) => {
            // Minecraft [x, z] → OL [x, -z] for the MINECRAFT projection (x east, y north)
            const coords = region.polygon.map(([x, z]) => [x, -z]);
            // close the ring
            coords.push(coords[0]);

            const feature = new Feature({
                geometry: new Polygon([coords]),
                regionId: region.id,
            });

            feature.setStyle(
                new Style({
                    stroke: new Stroke({ color: region.color, width: 2 }),
                    fill: new Fill({ color: hexToRgba(region.color, 0.2) }),
                })
            );

            source.addFeature(feature);
        });

        const layer = new VectorLayer({ source, visible: toggle.visible, zIndex: 1 });
        map.addLayer(layer);
        layerRef.current = layer;

        return () => {
            map.removeLayer(layer);
        };
    }, [map]);

    useEffect(() => {
        if (layerRef.current) {
            layerRef.current.setVisible(toggle.visible);
        }
    }, [toggle.visible]);

    return null;
});

RegionLayer.displayName = "RegionLayer";

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}
