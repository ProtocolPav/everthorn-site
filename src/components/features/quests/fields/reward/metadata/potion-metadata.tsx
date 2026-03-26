import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { PotionModel } from "@/types/quests";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";

interface PotionMetadataProps {
    value: PotionModel;
    onChange: (value: PotionModel) => void;
}

export function PotionMetadata({ value, onChange }: PotionMetadataProps) {
    return (
        <div className="flex flex-col gap-2">
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Potion Effect</FieldLabel>
                <VirtualizedCombobox
                    value={value.potion_effect}
                    onValueChange={(id) => onChange({ ...value, potion_effect: id as PotionModel["potion_effect"] })}
                    options={[]}
                    placeholder="Select potion effect..."
                    searchPlaceholder="Search effects..."
                    allowCustom={true}
                />
            </Field>
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Delivery Method</FieldLabel>
                <VirtualizedCombobox
                    value={value.potion_delivery}
                    onValueChange={(id) => onChange({ ...value, potion_delivery: id as PotionModel["potion_delivery"] })}
                    options={[]}
                    placeholder="Select delivery..."
                    searchPlaceholder="Search delivery types..."
                    allowCustom={true}
                />
            </Field>
        </div>
    );
}
