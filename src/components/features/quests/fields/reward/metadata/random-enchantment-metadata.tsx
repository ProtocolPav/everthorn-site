import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { RandomEnchantmentModel } from "@/types/quests";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { CheckIcon, XIcon } from "@phosphor-icons/react";

interface RandomEnchantmentMetadataProps {
    value: RandomEnchantmentModel;
    onChange: (value: RandomEnchantmentModel) => void;
}

export function RandomEnchantmentMetadata({ value, onChange }: RandomEnchantmentMetadataProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <Field className="flex-1">
                    <FieldLabel className="text-xs text-muted-foreground">Min Level</FieldLabel>
                    <Input
                        type="number"
                        min={1}
                        value={value.level_min}
                        onChange={(e) => onChange({ ...value, level_min: Number(e.target.value) || 1 })}
                    />
                </Field>
                <Field className="flex-1">
                    <FieldLabel className="text-xs text-muted-foreground">Max Level</FieldLabel>
                    <Input
                        type="number"
                        min={1}
                        value={value.level_max}
                        onChange={(e) => onChange({ ...value, level_max: Number(e.target.value) || 1 })}
                    />
                </Field>
            </div>
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Treasure Enchantments</FieldLabel>
                <ToggleGroup
                    variant="outline"
                    size="sm"
                    type="single"
                    value={value.treasure ? "yes" : "no"}
                    onValueChange={(val) => {
                        if (!val) return;
                        onChange({ ...value, treasure: val === "yes" });
                    }}
                    className="w-full"
                >
                    <ToggleGroupItem value="no" className="flex gap-1.5 text-xs">
                        <XIcon size={12} />
                        Exclude
                    </ToggleGroupItem>
                    <ToggleGroupItem value="yes" className="flex gap-1.5 text-xs">
                        <CheckIcon size={12} />
                        Include
                    </ToggleGroupItem>
                </ToggleGroup>
            </Field>
        </div>
    );
}
