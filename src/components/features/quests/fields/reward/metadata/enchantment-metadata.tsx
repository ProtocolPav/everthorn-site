import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { EnchantmentModel } from "@/types/quests";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import {MINECRAFT_ENCHANTMENT_OPTIONS} from "@/config/minecraft-options.ts";
import {Alert, AlertDescription} from "@/components/ui/alert.tsx";
import { InfoIcon } from "@phosphor-icons/react";

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
                    options={MINECRAFT_ENCHANTMENT_OPTIONS}
                    placeholder="Select enchantment..."
                    searchPlaceholder="Search enchantments..."
                    allowCustom={false}
                />
            </Field>
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Level</FieldLabel>
                <Input
                    type="number"
                    value={value.enchantment_level}
                    onChange={(e) => onChange({ ...value, enchantment_level: Number(e.target.value) || 1 })}
                />
            </Field>

            <Alert variant={'info'}>
                <InfoIcon/>
                <AlertDescription>
                    Invalid enchantments will be ignored when giving a reward (e.g. Prot V, Infinity on a Sword)
                </AlertDescription>
            </Alert>
        </div>
    );
}
