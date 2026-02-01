import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";

export function TargetCountField() {
  const field = useFieldContext<number>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className="flex-1 min-w-0">
      <FieldLabel className="sr-only">Count</FieldLabel>
      <Input
        type="number"
        id={field.name}
        name={field.name}
        value={field.state.value}
        onChange={(e) => field.handleChange(Number(e.target.value))}
        placeholder="Count"
        min={1}
        className={isInvalid ? "ring-2 ring-destructive" : ""}
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
