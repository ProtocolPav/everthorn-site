import React from "react";
import { createPortal } from "react-dom";
import { useOL } from "rlayers";
import Overlay from "ol/Overlay";
import type { Positioning } from "ol/Overlay";
import type { Coordinate } from "ol/coordinate";
import type Point from "ol/geom/Point";

interface MapOverlayProps {
    /** Minecraft `[x, z]` the overlay is anchored to. Ignored when `follow` is set. */
    position?: Coordinate;
    /** A live point geometry to track (e.g. an animated player). Updates without re-rendering React. */
    follow?: Point;
    positioning?: Positioning;
    /** Pixel offset `[x, y]`. */
    offset?: [number, number];
    /** Pan the map so the overlay is fully visible when it opens, keeping this margin in px. */
    autoPan?: number | false;
    /**
     * Whether pointer events on the overlay stay out of the map.
     * Leave `false` for labels so hover, drag and wheel pass through to the map.
     */
    stopEvent?: boolean;
    className?: string;
    children: React.ReactNode;
}

/**
 * Renders React content at a map coordinate using an OpenLayers `Overlay`.
 * Works anywhere inside `<RMap>`; unlike rlayers' `ROverlay` it doesn't need an `RFeature` parent.
 */
function MapOverlay({
    position,
    follow,
    positioning = "top-left",
    offset = [0, 0],
    autoPan = false,
    stopEvent = false,
    className,
    children,
}: MapOverlayProps) {
    const { map } = useOL();

    // Element and overlay are created as a pair: StrictMode runs initializers twice, and an
    // Overlay built around another call's element would steal it into its own container.
    const [{ element, overlay }] = React.useState(() => {
        const el = document.createElement("div");
        el.dataset.slot = "map-overlay";
        return {
            element: el,
            overlay: new Overlay({
                element: el,
                positioning,
                offset,
                stopEvent,
                autoPan: autoPan === false ? false : { margin: autoPan, animation: { duration: 250 } },
            }),
        };
    });

    React.useEffect(() => {
        map.addOverlay(overlay);
        return () => {
            map.removeOverlay(overlay);
        };
    }, [map, overlay]);

    React.useEffect(() => {
        element.className = className ?? "";
    }, [element, className]);

    React.useEffect(() => {
        overlay.setPositioning(positioning);
    }, [overlay, positioning]);

    const [offsetX, offsetY] = offset;
    React.useEffect(() => {
        overlay.setOffset([offsetX, offsetY]);
    }, [overlay, offsetX, offsetY]);

    const [x, z] = position ?? [];
    React.useEffect(() => {
        if (follow) {
            const update = () => overlay.setPosition(follow.getCoordinates());
            update();
            follow.on("change", update);
            return () => follow.un("change", update);
        }
        overlay.setPosition(x === undefined || z === undefined ? undefined : [x, z]);
    }, [overlay, follow, x, z]);

    return createPortal(children, element);
}

export { MapOverlay };
export type { MapOverlayProps };
