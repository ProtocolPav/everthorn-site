import { PlusIcon, TrashSimpleIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button.tsx";
import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { CoordinateInput } from "@/components/common/coordinate-input.tsx";
import { SeamlessSelect } from "@/components/common/seamless-select.tsx";
import { LocationMapPicker } from "@/components/features/map/location-map-picker.tsx";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { DIMENSION_OPTIONS } from "@/config/project-form-options.ts";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import { WAYPOINT_TYPE_OPTIONS } from "@/config/quests/waypoint-type-options.ts";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { useFieldValidity } from "@/hooks/use-field-validity.ts";
import type { Coordinates } from "@/lib/coordinates.ts";
import type { Waypoint, WaypointCustomization } from "@/api/nexuscore/model";
import type { WaypointWaypointType } from "@/api/nexuscore/model/waypointWaypointType.ts";

// The map's layers and the dimensions waypoints are shown in. The subway is in the overworld.
const DIMENSION_TO_LAYER: Record<string, string> = {
    "minecraft:overworld": "overworld",
    "minecraft:nether": "nether",
    "minecraft:the_end": "the_end",
};
const LAYER_TO_DIMENSION: Record<string, string> = {
    overworld: "minecraft:overworld",
    subway: "minecraft:overworld",
    nether: "minecraft:nether",
    the_end: "minecraft:the_end",
};

/** Star or question mark, shown as the texture players see in-game. */
function WaypointTypeToggle({ value, onChange }: { value: WaypointWaypointType; onChange: (value: WaypointWaypointType) => void }) {
    return (
        <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={value}
            onValueChange={(next) => next && onChange(next as WaypointWaypointType)}
            aria-label="Waypoint icon"
        >
            {WAYPOINT_TYPE_OPTIONS.map((option) => (
                <Tooltip key={option.value}>
                    <TooltipTrigger asChild>
                        <ToggleGroupItem
                            value={option.value}
                            aria-label={option.label}
                            className="h-7 w-8 px-0 opacity-50 data-[state=on]:opacity-100"
                        >
                            <img src={option.iconUrl} alt="" className="size-4 [image-rendering:pixelated]" />
                        </ToggleGroupItem>
                    </TooltipTrigger>
                    <TooltipContent>{option.label}</TooltipContent>
                </Tooltip>
            ))}
        </ToggleGroup>
    );
}

interface WaypointRowProps {
    waypoint: Waypoint;
    isInvalid: boolean;
    onUpdate: (updates: Partial<Waypoint>) => void;
    onRemove: () => void;
}

function WaypointRow({ waypoint, isInvalid, onUpdate, onRemove }: WaypointRowProps) {
    return (
        <div data-slot="waypoint-row" className="flex items-start gap-2 rounded-lg border bg-muted/20 p-2">
            <WaypointTypeToggle value={waypoint.waypoint_type} onChange={(waypoint_type) => onUpdate({ waypoint_type })} />

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <CoordinateInput
                    size="sm"
                    value={waypoint.coordinates}
                    isInvalid={isInvalid}
                    onChange={(coordinates) => onUpdate({ coordinates })}
                    addon={
                        <LocationMapPicker
                            pointOnly
                            size="sm"
                            x={waypoint.coordinates?.[0]}
                            z={waypoint.coordinates?.[2]}
                            layer={DIMENSION_TO_LAYER[waypoint.dimension ?? ""] ?? "overworld"}
                            onSelect={(point, layer) =>
                                onUpdate({
                                    coordinates: [point.x, waypoint.coordinates?.[1] as number, point.z],
                                    dimension: LAYER_TO_DIMENSION[layer] ?? waypoint.dimension,
                                })
                            }
                        />
                    }
                />
                <SeamlessSelect
                    value={waypoint.dimension ?? null}
                    onValueChange={(dimension) => onUpdate({ dimension })}
                    options={DIMENSION_OPTIONS}
                    placeholder="Dimension"
                    className="w-fit justify-start"
                />
            </div>

            <Button
                variant="ghost"
                size="icon-sm"
                type="button"
                aria-label="Remove waypoint"
                className="size-7 text-muted-foreground/60 hover:text-destructive"
                onClick={onRemove}
            >
                <TrashSimpleIcon size={14} />
            </Button>
        </div>
    );
}

function summarise(waypoints: Waypoint[]): string {
    if (waypoints.length === 0) return "No waypoints yet";
    if (waypoints.length > 1) return `${waypoints.length} waypoints`;
    const [x, y, z] = waypoints[0].coordinates ?? [];
    return `At (${x ?? "?"}, ${y ?? "?"}, ${z ?? "?"})`;
}

export function WaypointField() {
    const field = useFieldContext<WaypointCustomization>();
    const { isInvalid } = useFieldValidity();

    const waypoints = field.state.value?.waypoints ?? [];
    const HeaderIcon = CUSTOMIZATIONS.waypoint!.icon;

    function setWaypoints(next: Waypoint[]) {
        field.handleChange({ ...field.state.value, waypoints: next });
    }

    function addWaypoint() {
        // Start blank, but keep the icon and dimension of the last waypoint
        const last = waypoints[waypoints.length - 1];
        setWaypoints([
            ...waypoints,
            {
                coordinates: [undefined, undefined, undefined] as unknown as Coordinates,
                waypoint_type: last?.waypoint_type ?? "star",
                dimension: last?.dimension ?? "minecraft:overworld",
            },
        ]);
    }

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Waypoint</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.waypoint!.display}
                icon={CUSTOMIZATIONS.waypoint!.icon}
                hint={summarise(waypoints)}
                onRemove={() => field.setValue(null as any)}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <HeaderIcon weight="fill" className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Show players where to go</span>
                    </div>

                    {waypoints.length > 0 ? (
                        <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                            {waypoints.map((waypoint, index) => (
                                <WaypointRow
                                    key={index}
                                    waypoint={waypoint}
                                    isInvalid={isInvalid}
                                    onUpdate={(updates) => setWaypoints(waypoints.map((wp, i) => (i === index ? { ...wp, ...updates } : wp)))}
                                    onRemove={() => setWaypoints(waypoints.filter((_, i) => i !== index))}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="rounded-lg border border-dashed p-3 text-center text-sm text-muted-foreground">
                            Add a waypoint to mark a spot on players' screens.
                        </p>
                    )}

                    <Button variant="outline" size="sm" type="button" className="w-fit gap-1.5" onClick={addWaypoint}>
                        <PlusIcon size={12} />
                        Add waypoint
                    </Button>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
