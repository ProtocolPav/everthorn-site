import type * as React from "react";

import { cn } from "@/lib/utils.ts";

/** Frosted panel floating over the map, like the live map's control bar. */
function MapPanel({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="map-panel"
            className={cn("pointer-events-auto rounded-lg border bg-background/85 shadow-lg backdrop-blur-md", className)}
            {...props}
        />
    );
}

interface MapReadoutProps extends React.ComponentProps<"span"> {
    axis: "X" | "Y" | "Z";
    value: number;
}

const AXIS_CLASS: Record<MapReadoutProps["axis"], string> = {
    X: "text-red-500/80 dark:text-red-400/80",
    Y: "text-emerald-600/80 dark:text-emerald-400/80",
    Z: "text-sky-600/80 dark:text-sky-400/80",
};

/** One labelled coordinate, coloured by axis (X red, Y green, Z blue). */
function MapReadout({ axis, value, className, ...props }: MapReadoutProps) {
    return (
        <span data-slot="map-readout" className={cn("inline-flex items-baseline gap-1.5", className)} {...props}>
            <span data-slot="map-readout-axis" className={cn("text-xs font-semibold", AXIS_CLASS[axis])}>
                {axis}
            </span>
            <span data-slot="map-readout-value" className="font-minecraft-seven tabular-nums">
                {value}
            </span>
        </span>
    );
}

export { MapPanel, MapReadout };
