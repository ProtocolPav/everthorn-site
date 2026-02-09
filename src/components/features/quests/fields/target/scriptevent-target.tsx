import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Field, FieldError, FieldLabel} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";

export const ScriptEventTarget = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
    },

    render: function Render({form, objectiveIndex, targetIndex}) {
        return (
            <div className="flex gap-2 items-start">
                <div>
                    <form.AppField
                        name={`objectives[${objectiveIndex}].targets[${targetIndex}].count`}
                        children={(field) => <field.TargetCountField/>}
                    />
                </div>
                <form.AppField
                    name={`objectives[${objectiveIndex}].targets[${targetIndex}].script_id`}
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                        return (
                            <Field className="flex-1 min-w-0">
                                <FieldLabel className="sr-only">Script ID</FieldLabel>
                                <Input
                                    type="text"
                                    id={field.name}
                                    name={field.name}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    placeholder="Script ID (e.g., my_custom_event)"
                                    className={isInvalid ? "ring-2 ring-destructive" : ""}
                                />
                                {isInvalid && <FieldError errors={field.state.meta.errors}/>}
                            </Field>
                        )
                    }}
                />
            </div>
        );
    },
});
