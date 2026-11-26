import * as React from "react";
import { RFeature, RLayerVector, RMap, useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";
import type Feature from "ol/Feature";
import { Point } from "ol/geom";
import DoubleClickZoom from "ol/interaction/DoubleClickZoom";
import Translate from "ol/interaction/Translate";
import type { TranslateEvent } from "ol/interaction/Translate";
import type VectorLayer from "ol/layer/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";

import { WorldTileLayer } from "@/components/features/map/tile-layer.tsx";
import { MapViewSetup } from "@/components/features/map/core/map-view.tsx";
import ContextMenu from "@/components/features/map/context-menu.tsx";
import { getPinStyle } from "@/components/features/map/layers/pin_layer.tsx";
import { getProjectStyle } from "@/components/features/map/layers/project_layer.tsx";
import { MAP_LAYER_Z } from "@/components/features/map/core/layer-order.ts";
import { MAP_ZOOM, fromLegacyZoom, minecraftViewProjection } from "@/lib/map-projections.ts";
import { ensureMapFonts } from "@/lib/map-styles.tsx";
import type { PinOut, ProjectOut } from "@/api/nexuscore/model";
import type { MapEditorItem, MapEditorKey, MapEditorPlacing } from "@/types/map-editor";

const EDITOR_KEY = "editorKey";
const EDITOR_LAYER = "mapEditor";
const HIT_TOLERANCE = 4;
/** How close the map zooms in when jumping to an item. */
const FOCUS_ZOOM = fromLegacyZoom(2);

interface MapPoint {
    x: number;
    z: number;
}

/** A request to centre the map on a spot. `id` changes for every request, even to the same spot. */
interface MapFocus extends MapPoint {
    id: number;
}

// --- Styles ------------------------------------------------------------------------------------

const SELECTED_RING = new Style({
    image: new CircleStyle({
        radius: 9,
        fill: new Fill({ color: "rgba(100, 239, 255, 0.25)" }),
        stroke: new Stroke({ color: "#64efff", width: 2.5 }),
    }),
    zIndex: -1,
});

const DIRTY_DOT = new Style({
    image: new CircleStyle({
        radius: 4,
        fill: new Fill({ color: "#f0c534" }),
        stroke: new Stroke({ color: "#594A00", width: 1.5 }),
    }),
});

function labelStyle(text: string, selected: boolean): Style {
    return new Style({
        text: new Text({
            text,
            font: `12px 'Minecraft Seven', monospace`,
            offsetY: 14,
            fill: new Fill({ color: selected ? "#64efff" : "#ffffff" }),
            stroke: new Stroke({ color: "rgba(0, 0, 0, 0.85)", width: 3 }),
            overflow: true,
        }),
        zIndex: selected ? 2 : 1,
    });
}

function iconStyle(item: MapEditorItem): Style {
    if (item.kind === "pin") return getPinStyle({ pin_type: item.pin_type ?? "relic" } as PinOut);
    return getProjectStyle({ status: item.status } as ProjectOut);
}

// --- Markers -----------------------------------------------------------------------------------

interface EditorMarkerProps {
    item: MapEditorItem;
    selected: boolean;
    /** Bumped once the Minecraft font loads, to redraw labels with it. */
    fontsVersion: number;
}

const EditorMarker = React.memo(function EditorMarker({ item, selected, fontsVersion }: EditorMarkerProps) {
    const x = item.coordinates[0];
    const z = item.coordinates[2];

    // Stable geometry: dragging moves this point, then the saved draft re-renders it in place
    const geometry = React.useMemo(() => new Point([x + 0.5, z + 0.5]), [x, z]);
    const properties = React.useMemo(() => ({ [EDITOR_KEY]: item.key }), [item.key]);

    const style = React.useMemo(() => {
        const styles = [iconStyle(item), labelStyle(item.name || "New pin", selected)];
        if (selected) styles.unshift(SELECTED_RING);
        if (item.isDirty) styles.push(DIRTY_DOT);
        return styles;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item.kind, item.pin_type, item.status, item.name, item.isDirty, selected, fontsVersion]);

    if (!Number.isFinite(x) || !Number.isFinite(z)) return null;

    return <RFeature geometry={geometry} style={style} properties={properties} />;
});

// --- Tools -------------------------------------------------------------------------------------

interface EditorToolsProps {
    selectedKey: MapEditorKey | null;
    placing: MapEditorPlacing;
    onSelect: (key: MapEditorKey | null) => void;
    onPlace: (point: MapPoint) => void;
    onMove: (key: MapEditorKey, point: MapPoint) => void;
    onHover: (point: MapPoint | null) => void;
    focus: MapFocus | null;
}

function toBlock([x, z]: number[]): MapPoint {
    return { x: Math.floor(x), z: Math.floor(z) };
}

function isEditorLayer(layer: unknown): boolean {
    return !!layer && (layer as VectorLayer).get(EDITOR_LAYER) === true;
}

/**
 * The editor's map interactions: click a marker to select it, drag the selected marker to move it,
 * and, while placing, click the map to drop the new pin (or the selected item) there.
 */
function EditorTools({ selectedKey, placing, onSelect, onPlace, onMove, onHover, focus }: EditorToolsProps) {
    const { map } = useOL();

    // Listeners read the latest props without re-subscribing
    const latest = React.useRef({ selectedKey, placing, onSelect, onPlace, onMove, onHover });
    latest.current = { selectedKey, placing, onSelect, onPlace, onMove, onHover };

    React.useEffect(() => {
        // Clicks place and select things, so double clicks shouldn't zoom
        const doubleClick = map
            .getInteractions()
            .getArray()
            .filter((interaction) => interaction instanceof DoubleClickZoom);
        doubleClick.forEach((interaction) => interaction.setActive(false));

        // Only the selected marker can be dragged, so a stray drag pans the map instead
        const translate = new Translate({
            hitTolerance: HIT_TOLERANCE,
            layers: isEditorLayer,
            filter: (feature) =>
                !latest.current.placing && feature.get(EDITOR_KEY) === latest.current.selectedKey,
        });
        const handleTranslateEnd = (event: TranslateEvent) => {
            const feature = event.features.item(0) as Feature<Point> | undefined;
            const key = feature?.get(EDITOR_KEY) as MapEditorKey | undefined;
            const point = feature?.getGeometry()?.getCoordinates();
            if (!feature || !key || !point) return;
            // Snap to the block, so the marker sits where it will be saved even if the block didn't change
            const block = toBlock(point);
            feature.getGeometry()?.setCoordinates([block.x + 0.5, block.z + 0.5]);
            latest.current.onMove(key, block);
        };
        translate.on("translateend", handleTranslateEnd);
        map.addInteraction(translate);

        const markerAt = (pixel: number[]): MapEditorKey | null => {
            let key: MapEditorKey | null = null;
            map.forEachFeatureAtPixel(
                pixel,
                (feature) => {
                    key = (feature.get(EDITOR_KEY) as MapEditorKey | undefined) ?? null;
                    return !!key;
                },
                { hitTolerance: HIT_TOLERANCE, layerFilter: isEditorLayer },
            );
            return key;
        };

        const handleClick = (event: MapBrowserEvent) => {
            const { placing, onPlace, onSelect } = latest.current;
            if (placing) {
                onPlace(toBlock(event.coordinate));
                return;
            }
            onSelect(markerAt(event.pixel));
        };

        const handleMove = (event: MapBrowserEvent) => {
            latest.current.onHover(toBlock(event.coordinate));
            if (event.dragging) return;
            const target = map.getTargetElement();
            if (!target) return;
            const { placing, selectedKey } = latest.current;
            const key = placing ? null : markerAt(event.pixel);
            target.style.cursor = placing ? "crosshair" : key ? (key === selectedKey ? "move" : "pointer") : "";
        };

        const handleLeave = () => latest.current.onHover(null);

        const viewport = map.getViewport();
        map.on("click", handleClick);
        map.on("pointermove", handleMove);
        viewport?.addEventListener("pointerleave", handleLeave);

        return () => {
            doubleClick.forEach((interaction) => interaction.setActive(true));
            translate.un("translateend", handleTranslateEnd);
            map.removeInteraction(translate);
            map.un("click", handleClick);
            map.un("pointermove", handleMove);
            viewport?.removeEventListener("pointerleave", handleLeave);
        };
    }, [map]);

    // The crosshair should show as soon as placing starts, not on the next mouse move
    React.useEffect(() => {
        const target = map.getTargetElement();
        if (target) target.style.cursor = placing ? "crosshair" : "";
    }, [map, placing]);

    React.useEffect(() => {
        if (!focus) return;
        const view = map.getView();
        view.animate({
            center: [focus.x + 0.5, focus.z + 0.5],
            zoom: Math.max(view.getZoom() ?? MAP_ZOOM.default, FOCUS_ZOOM),
            duration: 600,
        });
    }, [map, focus]);

    return null;
}

// --- Map ---------------------------------------------------------------------------------------

interface EditorMapProps extends Omit<EditorToolsProps, "onHover"> {
    /** Map layer id: overworld, subway, nether or the_end. */
    layer: string;
    /** The items on this layer. */
    items: MapEditorItem[];
    /** Rendered above the map, e.g. floating controls. Gets the block under the cursor. */
    children?: (hover: MapPoint | null) => React.ReactNode;
}

function EditorMap({ layer, items, selectedKey, children, ...tools }: EditorMapProps) {
    const [hover, setHover] = React.useState<MapPoint | null>(null);
    const [fontsVersion, setFontsVersion] = React.useState(0);

    React.useEffect(() => {
        let cancelled = false;
        ensureMapFonts().then(() => {
            if (!cancelled) setFontsVersion((v) => v + 1);
        });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div data-slot="map-editor-map" className="relative h-full w-full">
            <RMap
                initial={{ center: [0, 0], zoom: MAP_ZOOM.default }}
                projection={minecraftViewProjection}
                noDefaultControls={true}
                className="relative z-0 h-full w-full select-none bg-gray-950"
            >
                <MapViewSetup center={[0, 0]} zoom={MAP_ZOOM.default} />
                <WorldTileLayer layer={layer} />
                <RLayerVector zIndex={MAP_LAYER_Z.markers} properties={{ [EDITOR_LAYER]: true }}>
                    {items.map((item) => (
                        <EditorMarker
                            key={item.key}
                            item={item}
                            selected={item.key === selectedKey}
                            fontsVersion={fontsVersion}
                        />
                    ))}
                </RLayerVector>
                <EditorTools selectedKey={selectedKey} onHover={setHover} {...tools} />
                <ContextMenu />
            </RMap>
            {children?.(hover)}
        </div>
    );
}

export { EditorMap };
export type { MapPoint, MapFocus };
