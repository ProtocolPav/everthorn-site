import React from "react";
import { RFeature } from "rlayers";
import { Point } from "ol/geom";
import type { Style } from "ol/style";

import { MARKER_ID, useMapInteraction } from "@/components/features/map/core/map-interaction-context.tsx";
import { useClusterPosition } from "@/components/features/map/core/cluster-layer.tsx";
import { MapTooltip } from "@/components/features/map/core/tooltip.tsx";
import type { MapTooltipProps } from "@/components/features/map/core/tooltip.tsx";
import { MapPopup } from "@/components/features/map/core/map-popup.tsx";

interface MapMarkerProps {
    /** Unique across the map, e.g. `project:<id>`. */
    id: string;
    /** Minecraft X. */
    x: number;
    /** Minecraft Z. */
    z: number;
    style: Style;
    label: React.ReactNode;
    /** Permanent label (Leaflet `permanent`). Otherwise the label shows on hover. */
    labelVisible: boolean;
    labelOffset?: MapTooltipProps["offset"];
    labelPositioning?: MapTooltipProps["positioning"];
    /** Content of the popup opened by clicking the marker. */
    popup?: React.ReactNode;
    popupOffset?: [number, number];
}

/**
 * A clickable map marker with a label and an optional popup, the equivalent of a Leaflet
 * `<Marker>` with `<Tooltip>` and `<Popup>`. Must be inside a vector or cluster layer.
 */
function MapMarker({
    id,
    x,
    z,
    style,
    label,
    labelVisible,
    labelOffset,
    labelPositioning,
    popup,
    popupOffset,
}: MapMarkerProps) {
    // Stable geometry/properties: a new object would make the cluster source re-cluster
    const geometry = React.useMemo(() => new Point([x, z]), [x, z]);
    const properties = React.useMemo(() => ({ [MARKER_ID]: id }), [id]);
    const coordinate = React.useMemo(() => [x, z], [x, z]);

    const { selectedId, hoveredId, deselect } = useMapInteraction();
    const position = useClusterPosition(id, coordinate);
    const isSelected = selectedId === id;

    // Leaflet closes a popup when its marker is absorbed into a cluster or removed from the map
    React.useEffect(() => {
        if (isSelected && position === null) deselect(id);
    }, [isSelected, position, deselect, id]);
    React.useEffect(() => () => deselect(id), [deselect, id]);

    return (
        <>
            <RFeature geometry={geometry} style={style} properties={properties} />

            {position && (
                <MapTooltip
                    visible={labelVisible || hoveredId === id}
                    position={position.coordinate}
                    follow={position.follow}
                    offset={labelOffset}
                    positioning={labelPositioning}
                >
                    {label}
                </MapTooltip>
            )}

            {popup && (
                <MapPopup open={isSelected && position !== null} position={position?.coordinate ?? coordinate} offset={popupOffset}>
                    {popup}
                </MapPopup>
            )}
        </>
    );
}

export { MapMarker };
export type { MapMarkerProps };
