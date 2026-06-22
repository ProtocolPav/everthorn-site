import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import {MINECRAFT_POTION_DELIVERY_OPTIONS, MINECRAFT_POTION_EFFECT_OPTIONS} from "@/config/minecraft-options.ts";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import {ExclamationMarkIcon} from "@phosphor-icons/react";
import {PotionModel} from "@/api/nexuscore/model";

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
                    options={MINECRAFT_POTION_EFFECT_OPTIONS}
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
                    options={MINECRAFT_POTION_DELIVERY_OPTIONS}
                    placeholder="Select delivery..."
                    searchPlaceholder="Search delivery types..."
                    allowCustom={true}
                />
            </Field>

            <Alert variant={'red'}>
                <ExclamationMarkIcon weight={'fill'}/>
                <AlertDescription>
                    Adding this Reward Customization will override ANY item you have set to be a potion bottle.
                </AlertDescription>
            </Alert>
        </div>
    );
}
