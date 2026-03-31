import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {TargetEntityField} from "@/components/features/quests/fields/target/target-entity-field.tsx";
import {TARGET_ENTITY_CONFIG} from "@/config/quests/target-options.ts";

const config = TARGET_ENTITY_CONFIG.kill;

export const KillTarget = withQuestForm({
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
                <TargetEntityField
                    form={form}
                    objectiveIndex={objectiveIndex}
                    targetIndex={targetIndex}
                    options={config.options}
                    fieldName={config.fieldName}
                    searchPlaceholder={config.searchPlaceholder}
                />
            </div>
        );
    },
});
