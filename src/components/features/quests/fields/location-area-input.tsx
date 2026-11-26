import { CoordinateInput } from "@/components/common/coordinate-input.tsx";
import { LocationMapPicker } from "@/components/features/map/location-map-picker.tsx";
import { RadiusShapeInput } from "@/components/features/quests/fields/radius-shape-input.tsx";
import { applyMapArea, type Coordinates } from "@/lib/coordinates.ts";
import { cn } from "@/lib/utils.ts";

export interface LocationAreaValue {
    coordinates: Coordinates;
    horizontal_radius: number;
    vertical_radius?: number | null;
}

interface LocationAreaInputProps {
    value: Partial<LocationAreaValue> | undefined;
    onChange: (value: LocationAreaValue) => void;
    /** Allow a cylinder with no height limit (visit targets). */
    allowAnyHeight?: boolean;
    isInvalid?: boolean;
    className?: string;
}

/**
 * Coordinates, a "Pick on map" button and the cylinder / sphere radius,
 * shared by every place a quest asks for an area in the world.
 */
function LocationAreaInput({ value, onChange, allowAnyHeight, isInvalid, className }: LocationAreaInputProps) {
    const current = (value ?? {}) as LocationAreaValue;

    return (
        <div data-slot="location-area-input" className={cn("flex flex-col gap-3", className)}>
            <CoordinateInput
                value={current.coordinates}
                isInvalid={isInvalid}
                onChange={(coordinates) => onChange({ ...current, coordinates })}
            />

            <LocationMapPicker
                x={current.coordinates?.[0]}
                z={current.coordinates?.[2]}
                radius={current.horizontal_radius}
                onSelect={(area) => onChange(applyMapArea(current, area))}
            />

            <RadiusShapeInput
                value={{
                    horizontal_radius: current.horizontal_radius,
                    vertical_radius: current.vertical_radius ?? undefined,
                }}
                allowAnyHeight={allowAnyHeight}
                isInvalid={isInvalid}
                onChange={(radius) =>
                    onChange({
                        ...current,
                        horizontal_radius: radius.horizontal_radius as number,
                        vertical_radius: radius.vertical_radius,
                    })
                }
            />
        </div>
    );
}

export { LocationAreaInput };
