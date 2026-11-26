import * as React from "react";

import { Input } from "@/components/ui/input.tsx";
import { applyPastedCoordinates, type Coordinates } from "@/lib/coordinates.ts";
import { cn } from "@/lib/utils.ts";

const AXES = ["X", "Y", "Z"] as const;

interface CoordinateInputProps extends Omit<React.ComponentProps<"div">, "onChange"> {
    value: Partial<Coordinates> | undefined;
    onChange: (value: Coordinates) => void;
    isInvalid?: boolean;
    inputClassName?: string;
}

/**
 * Three X / Y / Z number inputs. Pasting "12 64 -30", "XYZ: 12 / 64 / -30",
 * "/tp @s 12 64 -30" or "12, -30" into any of them fills the right boxes.
 */
function CoordinateInput({ value, onChange, isInvalid, inputClassName, className, ...props }: CoordinateInputProps) {
    function handleChange(index: 0 | 1 | 2, raw: string) {
        const next = [value?.[0], value?.[1], value?.[2]] as Coordinates;
        next[index] = raw === "" ? (undefined as unknown as number) : parseFloat(raw);
        onChange(next);
    }

    function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
        const next = applyPastedCoordinates(event.clipboardData.getData("text"), value);
        if (!next) return;
        event.preventDefault();
        onChange(next);
    }

    return (
        <div data-slot="coordinate-input" className={cn("flex items-center flex-wrap gap-2", className)} {...props}>
            {AXES.map((axis, i) => (
                <span key={axis} data-slot="coordinate-input-axis" className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">{axis}:</span>
                    <Input
                        type="number"
                        step="any"
                        aria-label={`${axis} coordinate`}
                        className={cn("w-16", inputClassName)}
                        data-invalid={isInvalid}
                        aria-invalid={isInvalid}
                        value={value?.[i] ?? ""}
                        onChange={(e) => handleChange(i as 0 | 1 | 2, e.target.value)}
                        onPaste={handlePaste}
                    />
                </span>
            ))}
        </div>
    );
}

export { CoordinateInput };
