import { FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import {LoreModel} from "@/api/nexuscore/model";

interface LoreMetadataProps {
    value: LoreModel;
    onChange: (value: LoreModel) => void;
}

export function LoreMetadata({ value, onChange }: LoreMetadataProps) {
    function updateLine(index: number, text: string) {
        const lines = [...value.item_lore];
        lines[index] = text;
        onChange({ ...value, item_lore: lines });
    }

    function addLine() {
        onChange({ ...value, item_lore: [...value.item_lore, ""] });
    }

    function removeLine(index: number) {
        const lines = value.item_lore.filter((_, i) => i !== index);
        onChange({ ...value, item_lore: lines });
    }

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel className="text-xs text-muted-foreground">Lore Lines</FieldLabel>
            {value.item_lore.map((line, i) => (
                <div key={i} className="flex gap-1 items-center">
                    <Input
                        value={line}
                        placeholder={`Line ${i + 1}...`}
                        onChange={(e) => updateLine(i, e.target.value)}
                    />
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        type="button"
                        className="text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => removeLine(i)}
                    >
                        <XIcon size={14} />
                    </Button>
                </div>
            ))}
            <Button
                variant="ghost"
                size="sm"
                type="button"
                className="w-fit text-muted-foreground"
                onClick={addLine}
            >
                <PlusIcon size={14} />
                Add Line
            </Button>
        </div>
    );
}
