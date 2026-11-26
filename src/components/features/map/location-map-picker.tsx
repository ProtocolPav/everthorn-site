import { lazy, Suspense, useState } from "react";
import { CircleIcon, MapTrifoldIcon, RectangleIcon, SpinnerIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { DEFAULT_LAYERS } from "@/config/map-defaults.ts";
import type { MapArea, PickerMode } from "@/components/features/map/location-picker-map.tsx";

// Leaflet touches `window` on import, so the map only loads in the browser once the dialog opens
const LocationPickerMap = lazy(() =>
    import("@/components/features/map/location-picker-map.tsx").then((m) => ({ default: m.LocationPickerMap })),
);

interface LocationMapPickerProps {
    x?: number;
    z?: number;
    radius?: number;
    onSelect: (area: MapArea) => void;
}

const MODE_HINTS: Record<PickerMode, string> = {
    circle: "Click the centre, then click again to set the radius. Right-click to start over.",
    rectangle: "Click one corner, then the opposite corner. Right-click to start over.",
};

/** A button that opens the world map to pick a point and horizontal radius. */
function LocationMapPicker({ x, z, radius, onSelect }: LocationMapPickerProps) {
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<PickerMode>("circle");
    const [layer, setLayer] = useState("overworld");
    const [area, setArea] = useState<MapArea | null>(null);

    function handleOpenChange(next: boolean) {
        setOpen(next);
        if (next) {
            const hasCurrent = Number.isFinite(x) && Number.isFinite(z);
            setArea(hasCurrent ? { x: x!, z: z!, radius: Number.isFinite(radius) ? radius! : 0 } : null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" type="button" className="w-fit gap-2">
                    <MapTrifoldIcon size={14} />
                    Pick on map
                </Button>
            </DialogTrigger>

            <DialogContent className="flex h-[85vh] flex-col gap-3 p-3 sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Pick an area</DialogTitle>
                    <DialogDescription>{MODE_HINTS[mode]}</DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2">
                    <ToggleGroup
                        variant="outline"
                        size="sm"
                        type="single"
                        value={mode}
                        onValueChange={(value) => value && setMode(value as PickerMode)}
                    >
                        <ToggleGroupItem value="circle" className="flex gap-2 text-xs">
                            <CircleIcon size={14} />
                            Centre + radius
                        </ToggleGroupItem>
                        <ToggleGroupItem value="rectangle" className="flex gap-2 text-xs">
                            <RectangleIcon size={14} />
                            Corner to corner
                        </ToggleGroupItem>
                    </ToggleGroup>

                    <Select value={layer} onValueChange={setLayer}>
                        <SelectTrigger size="sm" className="w-36">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {DEFAULT_LAYERS.map((option) => (
                                <SelectItem key={option.id} value={option.id}>
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
                    {open && (
                        <Suspense
                            fallback={
                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                    <SpinnerIcon className="animate-spin" />
                                </div>
                            }
                        >
                            <LocationPickerMap mode={mode} layer={layer} value={area} onChange={setArea} />
                        </Suspense>
                    )}
                </div>

                <DialogFooter className="items-center sm:justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                        {area ? `X ${area.x}, Z ${area.z} · ↔ ${area.radius} blocks` : "Nothing selected yet"}
                    </span>
                    <div className="flex gap-2">
                        <DialogClose asChild>
                            <Button variant="ghost" type="button">Cancel</Button>
                        </DialogClose>
                        <Button
                            type="button"
                            disabled={!area || area.radius <= 0}
                            onClick={() => {
                                if (!area) return;
                                onSelect(area);
                                setOpen(false);
                            }}
                        >
                            Use this area
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export { LocationMapPicker };
