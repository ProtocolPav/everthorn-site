import { useEffect, useState } from "react";
import { CylinderIcon, SphereIcon } from "@phosphor-icons/react";

import { Input } from "@/components/ui/input.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { cn } from "@/lib/utils.ts";

const label = "text-sm text-muted-foreground";

type Shape = "cylinder" | "sphere";

export interface RadiusValue {
    horizontal_radius: number | undefined;
    vertical_radius: number | undefined;
}

interface RadiusShapeInputProps {
    value: RadiusValue;
    onChange: (value: RadiusValue) => void;
    /** When true, a cylinder may leave the height blank to mean "any height". */
    allowAnyHeight?: boolean;
    isInvalid?: boolean;
    className?: string;
}

function toNumber(raw: string): number | undefined {
    return raw === "" ? undefined : parseFloat(raw);
}

function guessShape({ horizontal_radius: h, vertical_radius: v }: RadiusValue): Shape {
    return h !== undefined && h !== null && h === v ? "sphere" : "cylinder";
}

/**
 * Picks the shape of the area around a point.
 * Cylinder: a horizontal radius plus a height limit above and below.
 * Sphere: one radius used for both directions.
 */
function RadiusShapeInput({ value, onChange, allowAnyHeight, isInvalid, className }: RadiusShapeInputProps) {
    const [shape, setShape] = useState<Shape>(() => guessShape(value));

    // Keep a sphere's radii equal when the horizontal radius is set from elsewhere (e.g. the map picker)
    useEffect(() => {
        if (shape === "sphere" && value.vertical_radius !== value.horizontal_radius) {
            onChange({ horizontal_radius: value.horizontal_radius, vertical_radius: value.horizontal_radius });
        }
    }, [shape, value.horizontal_radius, value.vertical_radius, onChange]);

    function handleShapeChange(next: string) {
        if (!next) return;
        setShape(next as Shape);
        if (next === "sphere") {
            onChange({ horizontal_radius: value.horizontal_radius, vertical_radius: value.horizontal_radius });
        }
    }

    const inputProps = {
        type: "number",
        step: "any",
        min: 0,
        className: "w-16",
        "data-invalid": isInvalid,
        "aria-invalid": isInvalid,
    } as const;

    return (
        <div data-slot="radius-shape-input" className={cn("flex flex-col gap-2", className)}>
            <ToggleGroup
                variant="outline"
                size="sm"
                type="single"
                value={shape}
                onValueChange={handleShapeChange}
                className="w-full"
            >
                <ToggleGroupItem value="cylinder" className="flex gap-2 text-xs">
                    <CylinderIcon size={14} />
                    Cylinder
                </ToggleGroupItem>
                <ToggleGroupItem value="sphere" className="flex gap-2 text-xs">
                    <SphereIcon size={14} />
                    Sphere
                </ToggleGroupItem>
            </ToggleGroup>

            {shape === "sphere" ? (
                <div data-slot="radius-shape-input-sphere" className="flex items-center flex-wrap gap-2">
                    <span className={label}>within</span>
                    <Input
                        {...inputProps}
                        aria-label="Radius"
                        value={value.horizontal_radius ?? ""}
                        onChange={(e) => {
                            const radius = toNumber(e.target.value);
                            onChange({ horizontal_radius: radius, vertical_radius: radius });
                        }}
                    />
                    <span className={label}>blocks in any direction</span>
                </div>
            ) : (
                <div data-slot="radius-shape-input-cylinder" className="flex flex-col gap-2">
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>↔ within</span>
                        <Input
                            {...inputProps}
                            aria-label="Horizontal radius"
                            value={value.horizontal_radius ?? ""}
                            onChange={(e) => onChange({ ...value, horizontal_radius: toNumber(e.target.value) })}
                        />
                        <span className={label}>blocks horizontally</span>
                    </div>
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>↕ within</span>
                        <Input
                            {...inputProps}
                            aria-label="Vertical radius"
                            placeholder={allowAnyHeight ? "any" : undefined}
                            value={value.vertical_radius ?? ""}
                            onChange={(e) => onChange({ ...value, vertical_radius: toNumber(e.target.value) })}
                        />
                        <span className={label}>
                            blocks up and down{allowAnyHeight ? " (blank for any height)" : ""}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

export { RadiusShapeInput };
