import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {SeamlessSelect} from "@/components/features/common/seamless-select.tsx";
import {OBJECTIVE_TYPES} from "@/config/quest-form-options.ts";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {createDefaultTarget} from "@/components/features/quests/targets";
import {TargetType} from "@/components/features/quests/targets/types";
import {useField} from "@tanstack/react-form";

interface ObjectiveTypeProps {
    index: number;
}

export const ObjectiveTypeField = withQuestForm({
    props: {
        index: 0,
    } as ObjectiveTypeProps,

    render: function Render({form, index}) {
        const field = useField({
            form,
            name: `objectives[${index}].objective_type`,
        });

        const targetsField = form.state.values.objectives[index]?.targets

        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

        const handleTypeChange = (newType: string) => {
            // Reset targets to a single default target of the new type
            const defaultTarget = createDefaultTarget(newType as TargetType);
            targetsField.setValue([defaultTarget]);

            // Update the objective type
            field.handleChange(newType);
        };

        return (
            <Field className="w-fit">
                <FieldLabel className="sr-only">Objective Type</FieldLabel>
                <SeamlessSelect
                    options={OBJECTIVE_TYPES}
                    value={field.state.value}
                    onValueChange={handleTypeChange}
                    placeholder="Objective Type"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors}/>}
            </Field>
        );
    },
});
