import React, { useState, type ReactNode } from "react";
import { RFeature, RLayerVector, RMap, useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";
import { Circle, Point } from "ol/geom";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
import type { Coordinate } from "ol/coordinate";
import type { Extent } from "ol/extent";

import { WorldTileLayer } from "@/components/features/map/tile-layer.tsx";
import { MapViewSetup } from "@/components/features/map/core/map-view.tsx";
import { fromLegacyZoom, minecraftViewProjection } from "@/lib/map-projections.ts";
import { PICKER_PALETTES, createPickerBlockStyle, createPickerCircleStyle } from "@/lib/map-styles.tsx";

export type PickerMode = "point" | "circle";

/** A block on the map, with a horizontal radius (0 when only a point is picked). */
export interface MapArea {
    x: number;
    z: number;
    radius: number;
}

export interface MapPoint {
    x: number;
    z: number;
}

const CENTRE_STYLE = createPickerBlockStyle(PICKER_PALETTES.diamond, 14);
const ANCHOR_STYLE = createPickerBlockStyle(PICKER_PALETTES.gold, 12);
const AREA_STYLE = createPickerCircleStyle(PICKER_PALETTES.diamond, false);
const DRAWING_STYLE = createPickerCircleStyle(PICKER_PALETTES.gold, true);

/** Leaflet `zoom: -1` when there's nothing picked yet. */
const EMPTY_ZOOM = fromLegacyZoom(-1);

// Map coordinates are Minecraft [x, z]; one unit is one block
function toPoint([x, z]: Coordinate): MapPoint {
    return { x, z };
}

function toBlock(point: MapPoint): MapPoint {
    return { x: Math.floor(point.x), z: Math.floor(point.z) };
}

/** The middle of a block, where markers and circles are drawn. */
function blockCentre(point: MapPoint): Coordinate {
    return [point.x + 0.5, point.z + 0.5];
}

function distance(a: MapPoint, b: MapPoint): number {
    return Math.hypot(a.x - b.x, a.z - b.z);
}

interface SelectionToolProps {
    mode: PickerMode;
    value: MapArea | null;
    onChange: (value: MapArea | null) => void;
    onHover: (point: MapPoint | null) => void;
}

function SelectionTool({ mode, value, onChange, onHover }: SelectionToolProps) {
    const { map } = useOL();
    const [anchor, setAnchor] = useState<MapPoint | null>(null);
    const [hover, setHover] = useState<MapPoint | null>(null);

    // Map listeners read the latest props/state without re-subscribing
    const latest = React.useRef({ mode, anchor, onChange, onHover });
    latest.current = { mode, anchor, onChange, onHover };

    React.useEffect(() => {
        // Double clicks place blocks, so they shouldn't zoom (Leaflet `doubleClickZoom={false}`)
        const doubleClick = map
            .getInteractions()
            .getArray()
            .filter((interaction) => interaction instanceof DoubleClickZoom);
        doubleClick.forEach((interaction) => interaction.setActive(false));

        const handleClick = (event: MapBrowserEvent) => {
            const { mode, anchor, onChange } = latest.current;
            const block = toBlock(toPoint(event.coordinate));
            if (mode === "point") {
                onChange({ ...block, radius: 0 });
                return;
            }
            if (!anchor) {
                setAnchor(block);
                onChange(null);
                return;
            }
            onChange({ ...anchor, radius: Math.max(1, Math.round(distance(anchor, block))) });
            setAnchor(null);
        };

        const handleMove = (event: MapBrowserEvent) => {
            const point = toPoint(event.coordinate);
            setHover(point);
            latest.current.onHover(point);
        };

        // Right-click starts over
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault();
            setAnchor(null);
        };

        const handleLeave = () => latest.current.onHover(null);

        const viewport = map.getViewport();
        map.on("click", handleClick);
        map.on("pointermove", handleMove);
        viewport?.addEventListener("contextmenu", handleContextMenu);
        viewport?.addEventListener("pointerleave", handleLeave);

        return () => {
            doubleClick.forEach((interaction) => interaction.setActive(true));
            map.un("click", handleClick);
            map.un("pointermove", handleMove);
            viewport?.removeEventListener("contextmenu", handleContextMenu);
            viewport?.removeEventListener("pointerleave", handleLeave);
        };
    }, [map]);

    const drawingRadius = anchor && hover ? Math.max(1, distance(anchor, toBlock(hover))) : 0;

    return (
        <RLayerVector zIndex={10}>
            {anchor && (
                <>
                    {hover && (
                        <RFeature geometry={new Circle(blockCentre(anchor), drawingRadius)} style={DRAWING_STYLE} />
                    )}
                    <RFeature geometry={new Point(blockCentre(anchor))} style={ANCHOR_STYLE} />
                </>
            )}
            {value && !anchor && (
                <>
                    {value.radius > 0 && (
                        <RFeature geometry={new Circle(blockCentre(value), value.radius)} style={AREA_STYLE} />
                    )}
                    <RFeature geometry={new Point(blockCentre(value))} style={CENTRE_STYLE} />
                </>
            )}
        </RLayerVector>
    );
}

interface LocationPickerMapProps {
    mode: PickerMode;
    layer: string;
    value: MapArea | null;
    onChange: (value: MapArea | null) => void;
    /** Rendered above the map, e.g. the dialog's floating controls. Gets the block under the cursor. */
    children?: (hover: MapPoint | null) => ReactNode;
}

function LocationPickerMap({ mode, layer, value, onChange, children }: LocationPickerMapProps) {
    const [hover, setHover] = useState<MapPoint | null>(null);

    // Open centred on the current area, or on spawn when there is none yet
    const [initialFit] = useState<Extent | undefined>(() => {
        if (!value) return undefined;
        const r = Math.max(value.radius, 24) * 2;
        return [value.x - r, value.z - r, value.x + r, value.z + r];
    });

    return (
        <div data-slot="location-picker-map" className="relative h-full w-full">
            <RMap
                initial={{ center: [0, 0], zoom: EMPTY_ZOOM }}
                projection={minecraftViewProjection}
                noDefaultControls={true}
                className="relative z-0 h-full w-full cursor-crosshair bg-gray-950"
            >
                <MapViewSetup center={[0, 0]} zoom={EMPTY_ZOOM} fit={initialFit} />
                <WorldTileLayer layer={layer} />
                <SelectionTool mode={mode} value={value} onChange={onChange} onHover={setHover} />
            </RMap>
            {children?.(hover && toBlock(hover))}
        </div>
    );
}

export { LocationPickerMap };
