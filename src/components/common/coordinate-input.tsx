import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { applyPastedCoordinates, type Coordinates } from "@/lib/coordinates.ts";
import { cn } from "@/lib/utils.ts";

// Axis colours follow the usual 3D convention: X red, Y green, Z blue
const AXES = [
    { label: "X", className: "text-red-500/80 dark:text-red-400/80" },
    { label: "Y", className: "text-emerald-600/80 dark:text-emerald-400/80" },
    { label: "Z", className: "text-sky-600/80 dark:text-sky-400/80" },
] as const;

const coordinateInputVariants = cva(
    [
        "flex w-fit max-w-full items-stretch overflow-hidden rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "data-[invalid=true]:border-destructive data-[invalid=true]:ring-destructive/20 dark:data-[invalid=true]:ring-destructive/40",
    ],
    {
        variants: {
            size: {
                default: "h-9 text-sm",
                sm: "h-7 text-xs",
            },
        },
        defaultVariants: { size: "default" },
    },
);

const segmentVariants = cva("flex items-center gap-1.5 border-l border-input first:border-l-0", {
    variants: {
        size: {
            default: "pl-2.5",
            sm: "pl-1.5",
        },
    },
    defaultVariants: { size: "default" },
});

const fieldVariants = cva(
    [
        "h-full min-w-0 bg-transparent font-mono tabular-nums outline-none placeholder:text-muted-foreground/40",
        // hide the number spinners so the values get the room
        "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
    ],
    {
        variants: {
            size: {
                default: "w-16 pr-2.5",
                sm: "w-12 pr-1.5",
            },
        },
        defaultVariants: { size: "default" },
    },
);

interface CoordinateInputProps
    extends Omit<React.ComponentProps<"div">, "onChange">,
        VariantProps<typeof coordinateInputVariants> {
    value: Partial<Coordinates> | undefined;
    onChange: (value: Coordinates) => void;
    isInvalid?: boolean;
    /** Rendered at the end of the group, e.g. a map picker button. */
    addon?: React.ReactNode;
}

/**
 * One grouped X / Y / Z control. Pasting "12 64 -30", "XYZ: 12 / 64 / -30",
 * "/tp @s 12 64 -30" or "12, -30" into any box fills the right boxes.
 */
function CoordinateInput({ value, onChange, isInvalid, addon, size, className, ...props }: CoordinateInputProps) {
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
        <div
            data-slot="coordinate-input"
            data-invalid={isInvalid}
            title="Tip: paste coordinates like 12 64 -30 into any box"
            className={cn(coordinateInputVariants({ size }), className)}
            {...props}
        >
            {AXES.map((axis, i) => (
                <label key={axis.label} data-slot="coordinate-input-axis" className={segmentVariants({ size })}>
                    <span className={cn("select-none font-semibold", axis.className)}>{axis.label}</span>
                    <input
                        type="number"
                        step="any"
                        inputMode="decimal"
                        placeholder="~"
                        aria-label={`${axis.label} coordinate`}
                        aria-invalid={isInvalid}
                        className={fieldVariants({ size })}
                        value={value?.[i] ?? ""}
                        onChange={(e) => handleChange(i as 0 | 1 | 2, e.target.value)}
                        onPaste={handlePaste}
                    />
                </label>
            ))}
            {addon && (
                <div data-slot="coordinate-input-addon" className="flex items-center border-l border-input">
                    {addon}
                </div>
            )}
        </div>
    );
}

export { CoordinateInput };
