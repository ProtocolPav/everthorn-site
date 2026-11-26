import React from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Coordinate } from "ol/coordinate";

import { MapOverlay } from "@/components/features/map/core/map-overlay.tsx";

interface MapPopupProps {
    open: boolean;
    /** Minecraft `[x, z]` of the marker. */
    position: Coordinate;
    /** Pixel offset of the popup's bottom-center from the marker point. */
    offset?: [number, number];
    children: React.ReactNode;
}

/** Leaflet used autoPanPadding [11, 60]; OL takes a single margin. */
const AUTO_PAN_MARGIN = 60;

/**
 * A card that pops out of a marker, the equivalent of a Leaflet `<Popup>`.
 * Opening/closing is driven by the map-wide selection (see `useMapInteraction`).
 */
function MapPopup({ open, position, offset = [0, -30], children }: MapPopupProps) {
    return (
        <AnimatePresence>
            {open && (
                <MapOverlay
                    position={position}
                    positioning="bottom-center"
                    offset={offset}
                    autoPan={AUTO_PAN_MARGIN}
                    stopEvent={true}
                    className="map-popup drop-shadow-2xl drop-shadow-black/50"
                >
                    <motion.div
                        data-slot="map-popup"
                        style={{ transformOrigin: "bottom center" }}
                        initial={{
                            opacity: 0,
                            scaleX: 0.2,
                            scaleY: 0.05,
                            y: 25,
                            filter: "blur(8px)",
                        }}
                        animate={{
                            opacity: 1,
                            scaleX: 1,
                            scaleY: 1,
                            y: 0,
                            filter: "blur(0px)",
                            transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                        }}
                        exit={{
                            opacity: 0,
                            scaleX: 0.05,
                            scaleY: 0.1,
                            y: 25,
                            filter: "blur(12px)",
                            transition: { duration: 0.22, ease: [0.7, 0, 0.84, 0] },
                        }}
                    >
                        {children}
                    </motion.div>
                </MapOverlay>
            )}
        </AnimatePresence>
    );
}

export { MapPopup };
