import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { SeamlessSelect } from "@/components/features/common/seamless-select.tsx";

const LOGIC_OPTIONS = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
  { value: "sequential", label: "SEQUENTIAL" },
];

export function TargetLogicField() {
  const field = useFieldContext<string>();

  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <Field className="w-fit">
      <FieldLabel className="sr-only">Target Logic</FieldLabel>
      <SeamlessSelect
        options={LOGIC_OPTIONS}
        value={field.state.value}
        onValueChange={(value) => field.handleChange(value)}
        placeholder="Logic"
      />
      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  );
}
