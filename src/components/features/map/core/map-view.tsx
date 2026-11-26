import React from "react";
import { useOL } from "rlayers";
import View from "ol/View";
import type { Coordinate } from "ol/coordinate";
import type { Extent } from "ol/extent";

import { MAP_ZOOM, VIEW_EXTENT, VIEW_RESOLUTIONS, minecraftViewProjection } from "@/lib/map-projections.ts";

interface MapViewSetupProps {
    /** Minecraft `[x, z]` to open on. */
    center: Coordinate;
    /** OL zoom to open on. */
    zoom: number;
    /** Minecraft `[minX, minZ, maxX, maxZ]` to fit instead of `center`/`zoom` (Leaflet `bounds`). */
    fit?: Extent;
}

/**
 * Installs the shared world-map view: Geode zoom levels, soft ±5000 pan bounds, no rotation.
 * rlayers' `<RMap>` can't pass `resolutions` or `constrainOnlyCenter`, so the view it creates is
 * swapped out in a layout effect, before any other effect reads it. Applied once, on mount.
 */
function MapViewSetup({ center, zoom, fit }: MapViewSetupProps) {
    const { map } = useOL();

    React.useLayoutEffect(() => {
        const view = new View({
            projection: minecraftViewProjection,
            center,
            zoom,
            resolutions: VIEW_RESOLUTIONS,
            minZoom: MAP_ZOOM.min,
            maxZoom: MAP_ZOOM.max,
            // Soft pan bounds (Leaflet maxBounds ±5000 with viscosity)
            extent: VIEW_EXTENT,
            constrainOnlyCenter: true,
            smoothExtentConstraint: true,
            // Leaflet maps don't rotate
            enableRotation: false,
        });
        map.setView(view);

        if (!fit) return;
        // Fitting needs the map's size; in a dialog that may only be known after it lays out
        const fitView = () => {
            const size = map.getSize();
            if (!size || size[0] === 0 || size[1] === 0) return false;
            view.fit(fit, { size });
            return true;
        };
        if (fitView()) return;
        const onResize = () => {
            if (fitView()) map.un("change:size", onResize);
        };
        map.on("change:size", onResize);
        return () => map.un("change:size", onResize);
        // Only on mount, like Leaflet's MapContainer `center`/`zoom`/`bounds`
    }, [map]);

    return null;
}

export { MapViewSetup };
