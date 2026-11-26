import { lazy, Suspense, useState, type ReactNode } from "react";
import { MapTrifoldIcon, SpinnerIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { DEFAULT_LAYERS } from "@/config/map-defaults.ts";
import { cn } from "@/lib/utils.ts";
import type { MapArea } from "@/components/features/map/location-picker-map.tsx";

// Leaflet touches `window` on import, so the map only loads in the browser once the dialog opens
const LocationPickerMap = lazy(() =>
    import("@/components/features/map/location-picker-map.tsx").then((m) => ({ default: m.LocationPickerMap })),
);

interface LocationMapPickerProps {
    x?: number;
    z?: number;
    radius?: number;
    /** Pick a single block instead of an area (e.g. waypoints). */
    pointOnly?: boolean;
    /** Map layer to open on: overworld, subway, nether or the_end. */
    layer?: string;
    /** Trigger size, to match the CoordinateInput it sits in. */
    size?: "default" | "sm";
    onSelect: (area: MapArea, layer: string) => void;
}

/** Frosted panel floating over the map, like the live map's control bar. */
function MapPanel({ className, children }: { className?: string; children: ReactNode }) {
    return (
        <div
            data-slot="map-panel"
            className={cn("pointer-events-auto rounded-lg border bg-background/85 shadow-lg backdrop-blur-md", className)}
        >
            {children}
        </div>
    );
}

function Readout({ axis, value, className }: { axis: string; value: number; className: string }) {
    return (
        <span className="inline-flex items-baseline gap-1.5">
            <span className={cn("text-xs font-semibold", className)}>{axis}</span>
            <span className="font-minecraft-seven tabular-nums">{value}</span>
        </span>
    );
}

/**
 * A "Map" button that opens the world map to pick a block, or a block and a
 * horizontal radius. Made to sit in a CoordinateInput's addon slot.
 */
function LocationMapPicker({ x, z, radius, pointOnly, layer: initialLayer = "overworld", size = "default", onSelect }: LocationMapPickerProps) {
    const [open, setOpen] = useState(false);
    const [layer, setLayer] = useState(initialLayer);
    const [area, setArea] = useState<MapArea | null>(null);

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (next) {
            const hasCurrent = Number.isFinite(x) && Number.isFinite(z);
            setLayer(initialLayer);
            setArea(hasCurrent ? { x: x!, z: z!, radius: !pointOnly && Number.isFinite(radius) ? radius! : 0 } : null);
        }
    }

    const canUse = !!area && (pointOnly || area.radius > 0);
    const hint = pointOnly
        ? "Click the block where the waypoint should appear."
        : "Click the centre, then click again where the area should end. Right-click to start over.";

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    type="button"
                    title="Pick on the world map"
                    className={cn(
                        "h-full gap-1.5 rounded-none text-muted-foreground hover:text-foreground",
                        size === "sm" ? "px-2 text-xs" : "px-3",
                    )}
                >
                    <MapTrifoldIcon className={size === "sm" ? "size-3.5" : "size-4"} />
                    Map
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false} className="h-[85vh] overflow-hidden p-0 sm:max-w-5xl">
                {open && (
                    <Suspense
                        fallback={
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                <DialogTitle className="sr-only">Loading the map</DialogTitle>
                                <SpinnerIcon className="animate-spin" />
                            </div>
                        }
                    >
                        <LocationPickerMap mode={pointOnly ? "point" : "circle"} layer={layer} value={area} onChange={setArea}>
                            {(hover) => (
                                <div className="pointer-events-none absolute inset-0 z-[1000] flex flex-col justify-between gap-3 p-3">
                                    {/* Top: what to do, and where you are */}
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <MapPanel className="max-w-sm px-3 py-2">
                                            <DialogTitle className="text-sm">
                                                {pointOnly ? "Place a waypoint" : "Choose an area"}
                                            </DialogTitle>
                                            <DialogDescription className="text-xs">{hint}</DialogDescription>
                                        </MapPanel>

                                        <div className="flex items-center gap-2">
                                            <MapPanel className="flex h-9 items-center gap-3 px-3 text-sm">
                                                {hover ? (
                                                    <>
                                                        <Readout axis="X" value={hover.x} className="text-red-500/80 dark:text-red-400/80" />
                                                        <Readout axis="Z" value={hover.z} className="text-sky-600/80 dark:text-sky-400/80" />
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">Hover the map</span>
                                                )}
                                            </MapPanel>
                                            <MapPanel>
                                                <Select value={layer} onValueChange={setLayer}>
                                                    <SelectTrigger className="w-36 border-0 bg-transparent shadow-none dark:bg-transparent">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="z-[1100]">
                                                        {DEFAULT_LAYERS.map((option) => (
                                                            <SelectItem key={option.id} value={option.id}>
                                                                <img src={option.image as string} alt="" className="size-4 [image-rendering:pixelated]" />
                                                                {option.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </MapPanel>
                                        </div>
                                    </div>

                                    {/* Bottom: the choice so far, and what to do with it */}
                                    <MapPanel className="flex flex-wrap items-center justify-between gap-3 py-2 pl-4 pr-2">
                                        {area ? (
                                            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                                                <Readout axis="X" value={area.x} className="text-red-500/80 dark:text-red-400/80" />
                                                <Readout axis="Z" value={area.z} className="text-sky-600/80 dark:text-sky-400/80" />
                                                {!pointOnly && area.radius > 0 && (
                                                    <span className="text-muted-foreground">
                                                        <span className="font-minecraft-seven tabular-nums text-foreground">{area.radius}</span> block radius
                                                    </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                {pointOnly ? "No block chosen yet" : "No area chosen yet"}
                                            </span>
                                        )}
                                        <div className="flex gap-2">
                                            <DialogClose asChild>
                                                <Button variant="ghost" type="button">Cancel</Button>
                                            </DialogClose>
                                            <Button
                                                type="button"
                                                disabled={!canUse}
                                                onClick={() => {
                                                    if (!area) return;
                                                    onSelect(area, layer);
                                                    setOpen(false);
                                                }}
                                            >
                                                {pointOnly ? "Use this block" : "Use this area"}
                                            </Button>
                                        </div>
                                    </MapPanel>
                                </div>
                            )}
                        </LocationPickerMap>
                    </Suspense>
                )}
            </DialogContent>
        </Dialog>
    );
}

export { LocationMapPicker };
