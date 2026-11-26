import React from "react";

import { cn } from "@/lib/utils.ts";
import { MapOverlay } from "@/components/features/map/core/map-overlay.tsx";
import type { MapOverlayProps } from "@/components/features/map/core/map-overlay.tsx";

interface MapTooltipProps extends Pick<MapOverlayProps, "position" | "follow"> {
    /** Show the label. Permanent labels pass `true`; hover labels pass whether the marker is hovered. */
    visible: boolean;
    children: React.ReactNode;
    /** Which side of the label touches the marker point. Defaults to `"center-right"` (label on the left). */
    positioning?: MapOverlayProps["positioning"];
    /** Pixel offset `[x, y]`. Defaults to `[-3, -9]`. */
    offset?: [number, number];
    className?: string;
}

/** A small marker label, the equivalent of a Leaflet `<Tooltip>`. Never captures pointer events. */
function MapTooltip({
    visible,
    children,
    position,
    follow,
    positioning = "center-right",
    offset = [-3, -9],
    className,
}: MapTooltipProps) {
    if (!visible) return null;

    return (
        <MapOverlay
            position={position}
            follow={follow}
            positioning={positioning}
            offset={offset}
            className="map-tooltip pointer-events-none"
        >
            <div
                data-slot="map-tooltip"
                className={cn(
                    "bg-background/70 rounded-sm text-foreground text-xs font-minecraft-seven py-1 px-1.5 whitespace-nowrap shadow-[0_1px_3px_rgba(0,0,0,0.4)] leading-none select-none",
                    className,
                )}
            >
                {children}
            </div>
        </MapOverlay>
    );
}

export { MapTooltip };
export type { MapTooltipProps };
