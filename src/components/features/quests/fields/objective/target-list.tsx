import {Button} from "@/components/ui/button";
import {PlusIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {TargetItem} from "./target-item";
import {createDefaultTarget, TargetType} from "@/components/features/quests/targets";
import {TargetFormValues} from "@/lib/schemas/quest-form.tsx";

interface TargetListProps {
    objectiveIndex: number;
}

export const TargetList = withQuestForm({
    props: {
        objectiveIndex: 0,
    } as TargetListProps,

    render: function Render({form, objectiveIndex}) {
        return (
            <form.AppField name={`objectives[${objectiveIndex}].targets`} mode="array">
                {(targetsField) => {
                    const targets = targetsField.state.value as TargetFormValues[];

                    // Get objective type from parent form state
                    const objectiveType = form.state.values.objectives?.[objectiveIndex]?.objective_type as TargetType | undefined;

                    const handleAddTarget = () => {
                        if (!objectiveType) return;
                        const newTarget = createDefaultTarget(objectiveType);
                        targetsField.pushValue(newTarget);
                    };

                    const handleRemoveTarget = (index: number) => {
                        targetsField.removeValue(index);
                    };

                    return (
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-2">
                                {targets.map((target: TargetFormValues, index: number) => (
                                    <TargetItem
                                        key={index}
                                        form={form}
                                        objectiveIndex={objectiveIndex}
                                        targetIndex={index}
                                        targetType={target.target_type}
                                        onRemove={() => handleRemoveTarget(index)}
                                    />
                                ))}
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                type="button"
                                className="w-full"
                                onClick={handleAddTarget}
                                disabled={!objectiveType}
                            >
                                <PlusIcon className="mr-2 size-4"/>
                                Add Target
                            </Button>
                        </div>
                    );
                }}
            </form.AppField>
        );
    },
});
