import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {Field, FieldLabel} from "@/components/ui/field.tsx";
import {VirtualizedCombobox, VirtualizedComboboxOption} from "@/components/common/virtualized-combobox.tsx";
import {cn} from "@/lib/utils.ts";
import {useState} from "react";

export const TargetEntityField = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
        options: [] as VirtualizedComboboxOption[],
        fieldName: '',
        searchPlaceholder: '',
        showIcons: true
    },

    render: function Render({form, objectiveIndex, targetIndex, options, fieldName, searchPlaceholder, showIcons}) {
        const [randomOption] = useState<number>(Math.round(Math.random() * options.length))

        return (
            <form.AppField
                // @ts-ignore
                name={`objectives[${objectiveIndex}].targets[${targetIndex}].${fieldName}`}
                children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                    return (
                        <Field className="flex-1 w-0 min-w-0">
                            <FieldLabel className="sr-only">{fieldName}</FieldLabel>
                            <VirtualizedCombobox
                                // @ts-ignore
                                value={field.state.value}
                                onValueChange={(value) => field.handleChange(value)}
                                options={options}
                                placeholder={`e.g. ${options[randomOption]?.label ?? '...'}`}
                                allowCustom={true}
                                searchPlaceholder={searchPlaceholder}
                                disabled={field.state.meta.isValidating}
                                className={cn(
                                    isInvalid && "ring-2 ring-destructive focus:ring-destructive"
                                )}
                                showIcons={showIcons}
                            />
                        </Field>
                    )
                }}
            />
        );
    },
});
