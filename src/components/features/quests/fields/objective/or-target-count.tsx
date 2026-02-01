import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";

interface OrTargetCountProps {
  objectiveIndex: number;
}

export const OrTargetCountField = withQuestForm({
  props: {
    objectiveIndex: 0,
  } as OrTargetCountProps,

  render: function Render({ form, objectiveIndex }) {
    // Get logic value from form state
    const logic = form.state.values.objectives?.[objectiveIndex]?.logic;
    const isOrLogic = logic === "or";

    if (!isOrLogic) {
      return null;
    }

    return (
      <form.AppField
        name={`objectives[${objectiveIndex}].target_count`}
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field className="flex-1 min-w-0">
              <FieldLabel className="sr-only">Target Count</FieldLabel>
              <Input
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  field.handleChange(value ? Number(value) : null);
                }}
                placeholder="Any of (optional)"
                min={1}
                className={isInvalid ? "ring-2 ring-destructive" : ""}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
    );
  },
});
