import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {VirtualizedCombobox} from "@/components/common/virtualized-combobox.tsx";
import {CUSTOM_BLOCK_OPTIONS} from "@/config/minecraft-options.ts";
import {cn} from "@/lib/utils.ts";
import {useState} from "react";

export const MineTarget = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
    },

    render: function Render({form, objectiveIndex, targetIndex}) {
        const [randomOption] = useState<number>(Math.round(Math.random() * CUSTOM_BLOCK_OPTIONS.length))

        return (
            <div className="flex gap-2 items-start">
                <div>
                    <form.AppField
                        name={`objectives[${objectiveIndex}].targets[${targetIndex}].count`}
                        children={(field) => <field.TargetCountField/>}
                    />
                </div>
                <form.AppField
                    name={`objectives[${objectiveIndex}].targets[${targetIndex}].block`}
                    children={(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                        return (
                            <Field className="flex-1 w-0 min-w-0">
                                <FieldLabel className="sr-only">Block</FieldLabel>
                                <VirtualizedCombobox
                                    value={field.state.value}
                                    onValueChange={(value) => field.handleChange(value)}
                                    options={CUSTOM_BLOCK_OPTIONS}
                                    placeholder={`e.g. ${CUSTOM_BLOCK_OPTIONS[randomOption].label}`}
                                    allowCustom={true}
                                    searchPlaceholder="Search blocks..."
                                    disabled={field.state.meta.isValidating}
                                    className={cn(
                                        isInvalid && "ring-2 ring-destructive focus:ring-destructive"
                                    )}
                                />
                            </Field>
                        )
                    }}
                />
            </div>
        );
    },
});
