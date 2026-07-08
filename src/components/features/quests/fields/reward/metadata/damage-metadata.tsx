import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import {DamageModel} from "@/api/nexuscore/model";

interface DamageMetadataProps {
    value: DamageModel;
    onChange: (value: DamageModel) => void;
}

export function DamageMetadata({ value, onChange }: DamageMetadataProps) {
    return (
        <Field>
            <FieldLabel className="text-xs text-muted-foreground">Damage Percentage</FieldLabel>
            <Input
                type="number"
                min={0}
                max={100}
                value={value.damage_percentage}
                onChange={(e) => onChange({ ...value, damage_percentage: Number(e.target.value) || 0 })}
            />
        </Field>
    );
}
