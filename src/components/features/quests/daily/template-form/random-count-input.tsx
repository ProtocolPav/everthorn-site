import { useEffect, useState } from "react";
import { DiceFiveIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { formatRandomCount } from "@/lib/random-count.ts";
import { cn } from "@/lib/utils.ts";
import type { RandomCount } from "@/api/nexuscore/model";

/**
 * Parses what an admin types into a RandomCount:
 * "7" → choices [7], "5-8" → range 5–8, "5, 10, 20" or "5 / 10 / 20" → choices.
 */
export function parseRandomCount(text: string): RandomCount | null {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const range = trimmed.match(/^(-?\d+)\s*[-–—]\s*(-?\d+)$/);
    if (range) return { min: Number(range[1]), max: Number(range[2]) };

    const parts = trimmed.split(/[,/\s]+/).filter(Boolean);
    if (parts.length > 0 && parts.every((part) => /^-?\d+$/.test(part))) {
        return { choices: parts.map(Number) };
    }
    return null;
}

function isRange(value: RandomCount | null | undefined): boolean {
    return value != null && value.choices == null && (value.min != null || value.max != null);
}

function toNumber(raw: string): number | null {
    return raw === "" ? null : Math.trunc(Number(raw));
}

interface RandomCountInputProps {
    value: RandomCount | null | undefined;
    onChange: (value: RandomCount | null) => void;
    onBlur?: () => void;
    invalid?: boolean;
    /** Lowest value it may roll; used for the inputs' `min`. */
    minimum?: number;
    placeholder?: string;
    "aria-label"?: string;
    className?: string;
}

/**
 * A randomised number: type "7", "5-8" or "5, 10, 20" directly, or open the
 * dice popover to switch between a range and a list of choices. Same size
 * as the quest editor's count input.
 */
export function RandomCountInput({
    value,
    onChange,
    onBlur,
    invalid,
    minimum = 1,
    placeholder = "e.g. 5-8",
    "aria-label": ariaLabel = "Random count",
    className,
}: RandomCountInputProps) {
    const formatted = value ? formatRandomCount(value) : "";
    const [text, setText] = useState(formatted);
    const [choiceDraft, setChoiceDraft] = useState("");

    // Follow outside changes (popover edits, loaded JSON) unless the text already means the same.
    useEffect(() => {
        setText((current) => {
            const parsed = parseRandomCount(current);
            return parsed && formatRandomCount(parsed) === formatted ? current : formatted;
        });
    }, [formatted]);

    function commitText() {
        const parsed = parseRandomCount(text);
        if (parsed) {
            onChange(parsed);
            setText(formatRandomCount(parsed));
        } else if (!text.trim()) {
            onChange(null);
        } else {
            setText(formatted);
        }
        onBlur?.();
    }

    function setMode(mode: string) {
        if (mode === "range" && !isRange(value)) {
            const choices = value?.choices ?? [];
            const low = choices.length ? Math.min(...choices) : minimum;
            const high = choices.length ? Math.max(...choices) : minimum;
            onChange({ min: low, max: high });
        } else if (mode === "choices" && isRange(value)) {
            const values = [value?.min, value?.max].filter((n): n is number => n != null);
            onChange({ choices: [...new Set(values.length ? values : [minimum])] });
        }
    }

    function addChoice() {
        const next = toNumber(choiceDraft);
        if (next == null || Number.isNaN(next)) return;
        const choices = value?.choices ?? [];
        if (!choices.includes(next)) onChange({ choices: [...choices, next].sort((a, b) => a - b) });
        setChoiceDraft("");
    }

    const mode = isRange(value) ? "range" : "choices";

    return (
        <div className={cn("relative w-24 shrink-0", className)}>
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onBlur={commitText}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        commitText();
                    }
                }}
                placeholder={placeholder}
                aria-label={ariaLabel}
                aria-invalid={invalid}
                className={cn("pr-8 placeholder:text-muted-foreground/30", invalid && "ring-2 ring-destructive")}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="absolute right-1 top-1/2 size-7 -translate-y-1/2 text-muted-foreground"
                        aria-label="Edit range or choices"
                    >
                        <DiceFiveIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                    <div className="flex flex-col gap-3">
                        <ToggleGroup
                            type="single"
                            variant="outline"
                            size="sm"
                            value={mode}
                            onValueChange={(next) => next && setMode(next)}
                            className="w-full"
                        >
                            <ToggleGroupItem value="range" className="text-xs">Range</ToggleGroupItem>
                            <ToggleGroupItem value="choices" className="text-xs">Choices</ToggleGroupItem>
                        </ToggleGroup>

                        {mode === "range" ? (
                            <div className="flex items-end gap-2">
                                <div className="flex flex-1 flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Min</Label>
                                    <Input
                                        type="number"
                                        min={minimum}
                                        value={value?.min ?? ""}
                                        onChange={(e) => onChange({ min: toNumber(e.target.value), max: value?.max ?? null })}
                                    />
                                </div>
                                <span className="pb-2 text-muted-foreground">–</span>
                                <div className="flex flex-1 flex-col gap-1">
                                    <Label className="text-xs text-muted-foreground">Max</Label>
                                    <Input
                                        type="number"
                                        min={minimum}
                                        value={value?.max ?? ""}
                                        onChange={(e) => onChange({ min: value?.min ?? null, max: toNumber(e.target.value) })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <div className="flex min-h-7 flex-wrap gap-1">
                                    {(value?.choices ?? []).map((choice) => (
                                        <span
                                            key={choice}
                                            className="inline-flex h-6 items-center gap-1 rounded-md bg-secondary pl-2 pr-1 text-xs tabular-nums"
                                        >
                                            {choice}
                                            <button
                                                type="button"
                                                className="rounded text-muted-foreground hover:text-destructive"
                                                aria-label={`Remove ${choice}`}
                                                onClick={() =>
                                                    onChange({ choices: (value?.choices ?? []).filter((c) => c !== choice) })
                                                }
                                            >
                                                <XIcon size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <Input
                                    type="number"
                                    min={minimum}
                                    value={choiceDraft}
                                    placeholder="Add a value, then Enter"
                                    onChange={(e) => setChoiceDraft(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addChoice();
                                        }
                                    }}
                                    onBlur={addChoice}
                                />
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground">Rolled each time a day is generated.</p>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}
