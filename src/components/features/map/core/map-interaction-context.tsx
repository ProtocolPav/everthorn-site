import React from "react";
import { useOL } from "rlayers";
import type { MapBrowserEvent } from "ol";
import type { FeatureLike } from "ol/Feature";
import type Layer from "ol/layer/Layer";

/**
 * Map-wide marker interaction.
 *
 * Markers are canvas features, so instead of per-marker DOM listeners (Leaflet) there is one hit
 * test per click/hover for the whole map:
 *  - A feature with a `markerId` property is a marker: clicking toggles its popup (only one popup is
 *    open at a time, like Leaflet), hovering shows its label.
 *  - A cluster feature (from `ol/source/Cluster`) with a single member counts as that member.
 *  - Anything else is passed to the handlers its layer registered (e.g. cluster click/hover).
 *  - Clicking empty map closes the popup (Leaflet `closePopupOnClick`).
 */

const MARKER_ID = "markerId";
const INTERACTIVE = "interactive";
const HIT_TOLERANCE = 3;

/** Layer properties that make a vector layer's features hit-testable. */
const INTERACTIVE_LAYER_PROPS = { [INTERACTIVE]: true } as const;

interface LayerHandlers {
    /** Return `true` if the click was handled. */
    click?: (feature: FeatureLike, event: MapBrowserEvent) => boolean;
    /** Called with the hovered feature, or `null` when the pointer leaves it. */
    hover?: (feature: FeatureLike | null) => void;
}

interface MapInteractionContextValue {
    selectedId: string | null;
    hoveredId: string | null;
    select: (id: string | null) => void;
    /** Closes the popup only if `id` is the one open. */
    deselect: (id: string) => void;
    registerLayer: (layer: Layer, handlers: LayerHandlers) => () => void;
}

const MapInteractionContext = React.createContext<MapInteractionContextValue | null>(null);

interface Hit {
    feature: FeatureLike;
    layer: Layer;
    markerId: string | null;
}

function resolveMarkerId(feature: FeatureLike): string | null {
    const members = feature.get("features") as FeatureLike[] | undefined;
    if (members) {
        return members.length === 1 ? (members[0].get(MARKER_ID) ?? null) : null;
    }
    return feature.get(MARKER_ID) ?? null;
}

function MapInteractionProvider({ children }: { children: React.ReactNode }) {
    const { map } = useOL();
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [hoveredId, setHoveredId] = React.useState<string | null>(null);
    const handlersRef = React.useRef(new Map<Layer, LayerHandlers>());

    const deselect = React.useCallback((id: string) => {
        setSelectedId((prev) => (prev === id ? null : prev));
    }, []);

    const registerLayer = React.useCallback((layer: Layer, handlers: LayerHandlers) => {
        handlersRef.current.set(layer, handlers);
        return () => {
            handlersRef.current.delete(layer);
        };
    }, []);

    React.useEffect(() => {
        function hitTest(pixel: number[]): Hit | null {
            let hit: Hit | null = null;
            map.forEachFeatureAtPixel(
                pixel,
                (feature, layer) => {
                    if (!layer) return false;
                    hit = { feature, layer, markerId: resolveMarkerId(feature) };
                    return true;
                },
                {
                    hitTolerance: HIT_TOLERANCE,
                    layerFilter: (layer) => layer.get(INTERACTIVE) === true,
                },
            );
            return hit;
        }

        let hovered: Hit | null = null;

        function setHovered(next: Hit | null) {
            if (hovered?.feature === next?.feature) return;
            if (hovered && !hovered.markerId) handlersRef.current.get(hovered.layer)?.hover?.(null);
            hovered = next;
            if (next && !next.markerId) handlersRef.current.get(next.layer)?.hover?.(next.feature);
            setHoveredId(next?.markerId ?? null);
            map.getTargetElement().style.cursor = next ? "pointer" : "";
        }

        function handlePointerMove(e: MapBrowserEvent) {
            // Touch "hover" would flash labels while panning
            if (e.dragging || (e.originalEvent as PointerEvent).pointerType !== "mouse") return;
            setHovered(hitTest(e.pixel));
        }

        function handleClick(e: MapBrowserEvent) {
            const hit = hitTest(e.pixel);

            if (hit?.markerId) {
                const id = hit.markerId;
                setSelectedId((prev) => (prev === id ? null : id));
                return;
            }

            if (hit && handlersRef.current.get(hit.layer)?.click?.(hit.feature, e)) {
                setSelectedId(null);
                return;
            }

            setSelectedId(null);
        }

        function handleLeave() {
            setHovered(null);
        }

        const viewport = map.getViewport();
        map.on("pointermove", handlePointerMove);
        map.on("click", handleClick);
        viewport.addEventListener("pointerleave", handleLeave);

        return () => {
            map.un("pointermove", handlePointerMove);
            map.un("click", handleClick);
            viewport.removeEventListener("pointerleave", handleLeave);
        };
    }, [map]);

    const value = React.useMemo(
        () => ({ selectedId, hoveredId, select: setSelectedId, deselect, registerLayer }),
        [selectedId, hoveredId, deselect, registerLayer],
    );

    return <MapInteractionContext.Provider value={value}>{children}</MapInteractionContext.Provider>;
}

function useMapInteraction(): MapInteractionContextValue {
    const context = React.useContext(MapInteractionContext);
    if (!context) throw new Error("useMapInteraction must be used inside <MapInteractionProvider>");
    return context;
}

export { MapInteractionProvider, useMapInteraction, MARKER_ID, INTERACTIVE_LAYER_PROPS };
export type { LayerHandlers };
