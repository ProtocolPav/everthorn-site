import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { CoordinateInput } from "@/components/common/coordinate-input.tsx";
import { LocationMapPicker } from "@/components/features/map/location-map-picker.tsx";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import type { WaypointWaypointType } from "@/api/nexuscore/model/waypointWaypointType.ts";
import { SeamlessSelect, SeamlessSelectOption } from "@/components/common/seamless-select.tsx";
import { DIMENSION_OPTIONS } from "@/config/project-form-options.ts";
import { useFieldValidity } from "@/hooks/use-field-validity.ts";
import { WAYPOINT_TYPE_OPTIONS } from "@/config/quests/waypoint-type-options.ts";
import { WaypointCustomization } from "@/api/nexuscore/model";
import { cn } from "@/lib/utils.ts";
import { useMemo } from "react";

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

function useWaypointTypeOptions(): SeamlessSelectOption[] {
    return useMemo(() =>
        WAYPOINT_TYPE_OPTIONS.map((opt) => ({
            value: opt.value,
            label: opt.label,
            triggerClassName: opt.triggerClassName,
            iconClassName: opt.iconClassName,
            renderIcon: () => {
                if (opt.iconUrl) {
                    return (
                        <img
                            src={opt.iconUrl}
                            alt={opt.label}
                            className="w-3.5 h-3.5 object-contain"
                        />
                    );
                }
                return (
                    <div className={cn(
                        "w-3.5 h-3.5 rounded-sm opacity-30",
                        opt.value === 'star' ? "bg-amber-500" : "bg-sky-500"
                    )} />
                );
            },
        })),
    []);
}

function WaypointRow({
    waypoint,
    index,
    isInvalid,
    onUpdate,
    onRemove,
    typeOptions,
}: {
    waypoint: { coordinates: [number, number, number]; waypoint_type: WaypointWaypointType; dimension?: string };
    index: number;
    isInvalid: boolean;
    onUpdate: (updates: Partial<{ coordinates: [number, number, number]; waypoint_type: WaypointWaypointType; dimension: string }>) => void;
    onRemove: () => void;
    typeOptions: SeamlessSelectOption[];
}) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-muted text-[9px] font-bold text-muted-foreground">
                        {index + 1}
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground">Waypoint</span>
                </div>
                <Button
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    className="text-muted-foreground/30 hover:text-destructive h-5 w-5"
                    onClick={onRemove}
                >
                    <XIcon size={11} />
                </Button>
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/50 tracking-wide">Position</span>
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
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/50 tracking-wide">Type</span>
                <SeamlessSelect
                    value={waypoint.waypoint_type}
                    onValueChange={(val) => onUpdate({ waypoint_type: val as WaypointWaypointType })}
                    options={typeOptions}
                    placeholder="Type"
                    className="justify-start h-7"
                />
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-semibold text-muted-foreground/50 tracking-wide">Dimension</span>
                <SeamlessSelect
                    value={waypoint.dimension ?? null}
                    onValueChange={(val) => onUpdate({ dimension: val })}
                    options={DIMENSION_OPTIONS}
                    placeholder="Dimension"
                    className="justify-start h-7"
                />
            </div>
        </div>
    );
}

export function WaypointField() {
    const field = useFieldContext<WaypointCustomization>();
    const { isInvalid } = useFieldValidity();
    const typeOptions = useWaypointTypeOptions();

    const waypoints = field.state.value?.waypoints ?? [];

    function updateWaypoint(index: number, updates: Partial<typeof waypoints[number]>) {
        const newWaypoints = waypoints.map((wp, i) =>
            i === index ? { ...wp, ...updates } : wp
        );
        field.handleChange({ ...field.state.value, waypoints: newWaypoints });
    }

    function addWaypoint() {
        const newWaypoint = { coordinates: [0, 0, 0] as [number, number, number], waypoint_type: "star" as WaypointWaypointType, dimension: "minecraft:overworld" };
        field.handleChange({ ...field.state.value, waypoints: [...waypoints, newWaypoint] });
    }

    function removeWaypoint(index: number) {
        const newWaypoints = waypoints.filter((_, i) => i !== index);
        field.handleChange({ ...field.state.value, waypoints: newWaypoints });
    }

    const waypointCount = waypoints.length;
    const hint = waypointCount === 1
        ? "1 waypoint"
        : `${waypointCount} waypoints`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Waypoint</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.waypoint!.display}
                icon={CUSTOMIZATIONS.waypoint!.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">
                    <div className="max-h-80 overflow-y-auto flex flex-col gap-3 pr-1">
                        {waypoints.map((waypoint, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "relative flex flex-col",
                                    index !== waypoints.length - 1 && "pb-3 border-b border-border/30"
                                )}
                            >
                                <WaypointRow
                                    waypoint={waypoint}
                                    index={index}
                                    isInvalid={isInvalid}
                                    onUpdate={(updates) => updateWaypoint(index, updates)}
                                    onRemove={() => removeWaypoint(index)}
                                    typeOptions={typeOptions}
                                />
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="gap-1.5 text-muted-foreground w-fit"
                        onClick={addWaypoint}
                    >
                        <PlusIcon size={12} />
                        Add waypoint
                    </Button>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
