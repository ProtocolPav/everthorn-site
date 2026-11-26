import { useState } from "react";
import { Circle, MapContainer, Rectangle, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { CustomTileLayerComponent } from "@/components/features/map/tile-layer.tsx";

export type PickerMode = "circle" | "rectangle";

/** A point on the map in Minecraft blocks, with a horizontal radius. */
export interface MapArea {
    x: number;
    z: number;
    radius: number;
}

interface Point {
    x: number;
    z: number;
}

// Leaflet's CRS.Simple maps one unit to one block: lat = -z, lng = x
function toPoint(latlng: L.LatLng): Point {
    return { x: latlng.lng, z: -latlng.lat };
}

function toLatLng(point: Point): L.LatLngExpression {
    return [-point.z, point.x];
}

function distance(a: Point, b: Point): number {
    return Math.hypot(a.x - b.x, a.z - b.z);
}

/** Turns the two clicks into the area that gets saved. */
function areaFromPoints(mode: PickerMode, a: Point, b: Point): MapArea {
    if (mode === "circle") {
        return { x: Math.round(a.x), z: Math.round(a.z), radius: Math.max(1, Math.round(distance(a, b))) };
    }

    // A rectangle is saved as the circle around its centre that covers every corner
    const centre = { x: (a.x + b.x) / 2, z: (a.z + b.z) / 2 };
    return { x: Math.round(centre.x), z: Math.round(centre.z), radius: Math.max(1, Math.ceil(distance(centre, a))) };
}

interface SelectionToolProps {
    mode: PickerMode;
    value: MapArea | null;
    onChange: (value: MapArea | null) => void;
    onHover: (point: Point | null) => void;
}

function SelectionTool({ mode, value, onChange, onHover }: SelectionToolProps) {
    const [anchor, setAnchor] = useState<Point | null>(null);
    const [hover, setHover] = useState<Point | null>(null);
    const [drawn, setDrawn] = useState<[Point, Point] | null>(null);

    useMapEvents({
        click(event) {
            const point = toPoint(event.latlng);
            if (!anchor) {
                setAnchor(point);
                setDrawn(null);
                onChange(null);
                return;
            }
            onChange(areaFromPoints(mode, anchor, point));
            setDrawn(mode === "rectangle" ? [anchor, point] : null);
            setAnchor(null);
        },
        contextmenu() {
            setAnchor(null);
        },
        mousemove(event) {
            const point = toPoint(event.latlng);
            setHover(point);
            onHover(point);
        },
        mouseout() {
            onHover(null);
        },
    });

    const previewStyle = { color: "#f0c534", weight: 2, dashArray: "6 4", fillOpacity: 0.1 };
    const savedStyle = { color: "#74a753", weight: 2, fillOpacity: 0.2 };

    return (
        <>
            {anchor && hover && mode === "circle" && (
                <Circle center={toLatLng(anchor)} radius={Math.max(1, distance(anchor, hover))} pathOptions={previewStyle} />
            )}
            {anchor && hover && mode === "rectangle" && (
                <Rectangle bounds={L.latLngBounds(toLatLng(anchor), toLatLng(hover))} pathOptions={previewStyle} />
            )}
            {drawn && (
                <Rectangle
                    bounds={L.latLngBounds(toLatLng(drawn[0]), toLatLng(drawn[1]))}
                    pathOptions={{ ...previewStyle, fillOpacity: 0 }}
                />
            )}
            {value && <Circle center={toLatLng(value)} radius={value.radius} pathOptions={savedStyle} />}
        </>
    );
}

interface LocationPickerMapProps {
    mode: PickerMode;
    layer: string;
    value: MapArea | null;
    onChange: (value: MapArea | null) => void;
}

function LocationPickerMap({ mode, layer, value, onChange }: LocationPickerMapProps) {
    const [hover, setHover] = useState<Point | null>(null);

    // Open centred on the current area, or on spawn when there is none yet
    const [initialBounds] = useState(() => {
        if (!value) return undefined;
        const r = Math.max(value.radius, 16) * 2;
        return L.latLngBounds([-value.z - r, value.x - r], [-value.z + r, value.x + r]);
    });

    return (
        <div data-slot="location-picker-map" className="relative h-full w-full">
            <MapContainer
                {...(initialBounds ? { bounds: initialBounds } : { center: [0, 0], zoom: -1 })}
                style={{ width: "100%", height: "100%" }}
                className="z-0 cursor-crosshair rounded-md"
                crs={L.CRS.Simple}
                zoomControl={false}
                doubleClickZoom={false}
                attributionControl={false}
                maxBounds={[[5000, 5000], [-5000, -5000]]}
                maxBoundsViscosity={0.03}
                minZoom={-5}
                maxZoom={6}
            >
                <CustomTileLayerComponent layer={layer} />
                <SelectionTool mode={mode} value={value} onChange={onChange} onHover={setHover} />
            </MapContainer>

            {hover && (
                <div className="pointer-events-none absolute bottom-2 left-2 z-[1000] rounded-md bg-background/80 px-2 py-1 font-mono text-xs tabular-nums">
                    {Math.floor(hover.x)}, {Math.floor(hover.z)}
                </div>
            )}
        </div>
    );
}

export { LocationPickerMap };
