import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { EnchantmentModel } from "@/types/quests";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";

interface EnchantmentMetadataProps {
    value: EnchantmentModel;
    onChange: (value: EnchantmentModel) => void;
}

export function EnchantmentMetadata({ value, onChange }: EnchantmentMetadataProps) {
    return (
        <div className="flex flex-col gap-2">
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Enchantment</FieldLabel>
                <VirtualizedCombobox
                    value={value.enchantment_id}
                    onValueChange={(id) => onChange({ ...value, enchantment_id: id as EnchantmentModel["enchantment_id"] })}
                    options={[]}
                    placeholder="Select enchantment..."
                    searchPlaceholder="Search enchantments..."
                    allowCustom={true}
                />
            </Field>
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Level</FieldLabel>
                <Input
                    type="number"
                    min={1}
                    value={value.enchantment_level}
                    onChange={(e) => onChange({ ...value, enchantment_level: Number(e.target.value) || 1 })}
                />
            </Field>
        </div>
    );
}
