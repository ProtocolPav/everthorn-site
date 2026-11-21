import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { ArrowBendDoubleUpRightIcon, ProhibitIcon } from "@phosphor-icons/react";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";

interface ConsequenceToggleProps {
    value: boolean;
    onChange: (fail: boolean) => void;
    label?: string;
}

export function ConsequenceToggle({ value, onChange, label = "Otherwise..." }: ConsequenceToggleProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
                <span className="text-sm text-muted-foreground">{label}</span>
                <FieldInfoTooltip>
                    Skip: moves to the next objective. Fail: the entire quest ends.
                </FieldInfoTooltip>
            </div>
            <ToggleGroup
                variant="outline"
                size="sm"
                type="single"
                value={value ? 'fail' : 'skip'}
                onValueChange={(val) => {
                    if (!val) return;
                    onChange(val === 'fail');
                }}
                className="w-full"
            >
                <ToggleGroupItem value="skip" className="flex gap-2 text-xs">
                    <ArrowBendDoubleUpRightIcon size={14} />
                    Skip objective
                </ToggleGroupItem>
                <ToggleGroupItem
                    value="fail"
                    className="flex gap-2 text-xs data-[state=on]:text-amber-500 data-[state=on]:bg-amber-800/30"
                >
                    <ProhibitIcon size={14} />
                    Fail entire quest
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    );
}
