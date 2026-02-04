import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";

export const MineTarget = withQuestForm({
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
                    name={`objectives[${objectiveIndex}].targets[${targetIndex}].block`}
                    children={(field) => <field.TargetBlockField/>}
                />
            </div>
        );
    },
});
