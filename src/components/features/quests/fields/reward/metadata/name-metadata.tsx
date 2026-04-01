import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { NameModel } from "@/types/quests";

interface NameMetadataProps {
    value: NameModel;
    onChange: (value: NameModel) => void;
}

export function NameMetadata({ value, onChange }: NameMetadataProps) {
    return (
        <Field>
            <FieldLabel className="text-xs text-muted-foreground">Custom Name</FieldLabel>
            <Input
                value={value.item_name}
                placeholder="Item name..."
                onChange={(e) => onChange({ ...value, item_name: e.target.value })}
            />
        </Field>
    );
}
