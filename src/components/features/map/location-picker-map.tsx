import { useState, type ReactNode } from "react";
import { Circle, MapContainer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

import { CustomTileLayerComponent } from "@/components/features/map/tile-layer.tsx";

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

// Same palette as the map's cluster icons: diamond for the chosen area, gold while drawing
const DIAMOND = { fill: "#64efff", edge: "#005954", light: "rgba(255,255,255,0.5)", dark: "rgba(0,0,0,0.2)" };
const GOLD = { fill: "#f0c534", edge: "#594A00", light: "rgba(255,255,255,0.4)", dark: "rgba(0,0,0,0.2)" };

function blockIcon(c: typeof DIAMOND, size = 14): L.DivIcon {
    const style = [
        `width:${size}px`,
        `height:${size}px`,
        `background:${c.fill}`,
        `border:2px solid ${c.edge}`,
        "box-sizing:border-box",
        `box-shadow:inset 2px 2px 0 ${c.light}, inset -2px -2px 0 ${c.dark}, 0 0 0 2px rgba(0,0,0,0.35)`,
    ].join(";");
    return L.divIcon({ html: `<div style="${style}"></div>`, className: "", iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

const CENTRE_ICON = blockIcon(DIAMOND);
const ANCHOR_ICON = blockIcon(GOLD, 12);

// Leaflet's CRS.Simple maps one unit to one block: lat = -z, lng = x
function toPoint(latlng: L.LatLng): MapPoint {
    return { x: latlng.lng, z: -latlng.lat };
}

function toBlock(point: MapPoint): MapPoint {
    return { x: Math.floor(point.x), z: Math.floor(point.z) };
}

/** The middle of a block, where markers and circles are drawn. */
function blockCentre(point: MapPoint): L.LatLngExpression {
    return [-(point.z + 0.5), point.x + 0.5];
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
    const [anchor, setAnchor] = useState<MapPoint | null>(null);
    const [hover, setHover] = useState<MapPoint | null>(null);

    useMapEvents({
        click(event) {
            const block = toBlock(toPoint(event.latlng));
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

    return (
        <>
            {anchor && (
                <>
                    {hover && (
                        <Circle
                            center={blockCentre(anchor)}
                            radius={Math.max(1, distance(anchor, toBlock(hover)))}
                            pathOptions={{ color: GOLD.fill, weight: 2, dashArray: "6 5", fillColor: GOLD.fill, fillOpacity: 0.12 }}
                        />
                    )}
                    <Marker position={blockCentre(anchor)} icon={ANCHOR_ICON} interactive={false} />
                </>
            )}
            {value && !anchor && (
                <>
                    {value.radius > 0 && (
                        <Circle
                            center={blockCentre(value)}
                            radius={value.radius}
                            pathOptions={{ color: DIAMOND.fill, weight: 2.5, fillColor: DIAMOND.fill, fillOpacity: 0.16 }}
                        />
                    )}
                    <Marker position={blockCentre(value)} icon={CENTRE_ICON} interactive={false} />
                </>
            )}
        </>
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
    const [initialBounds] = useState(() => {
        if (!value) return undefined;
        const r = Math.max(value.radius, 24) * 2;
        return L.latLngBounds([-value.z - r, value.x - r], [-value.z + r, value.x + r]);
    });

    return (
        <div data-slot="location-picker-map" className="relative h-full w-full">
            <MapContainer
                {...(initialBounds ? { bounds: initialBounds } : { center: [0, 0], zoom: -1 })}
                style={{ width: "100%", height: "100%" }}
                className="z-0 cursor-crosshair"
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
            {children?.(hover && toBlock(hover))}
        </div>
    );
}

export { LocationPickerMap };
