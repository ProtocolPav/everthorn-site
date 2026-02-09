import {Button} from "@/components/ui/button.tsx";
import {MinusIcon} from "@phosphor-icons/react";
import {KillTarget} from "@/components/features/quests/fields/target/kill-target.tsx";
import {MineTarget} from "@/components/features/quests/fields/target/mine-target.tsx";
import {ScriptEventTarget} from "@/components/features/quests/fields/target/scriptevent-target.tsx";
import {ObjectiveTypes} from "@/types/quests";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";

function getTargetComponent(target_type: ObjectiveTypes): any {
    if (target_type === 'kill') {
        return KillTarget
    } else if (target_type === 'mine') {
        return MineTarget
    } else if (target_type === 'scriptevent') {
        return ScriptEventTarget
    }
}

export const TargetItem = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
        targetType: "kill",
        onRemove: () => {}
    },

    render: function Render({form, objectiveIndex, targetIndex, targetType, onRemove}) {
        const TargetComponent = getTargetComponent(targetType as ObjectiveTypes);

        if (!TargetComponent) {
            return (
                <Button variant={'destructive'} onClick={onRemove}>
                    Unknown Target Type. Click to Remove.
                </Button>
            );
        }

        return (
            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    <TargetComponent
                        form={form}
                        objectiveIndex={objectiveIndex}
                        targetIndex={targetIndex}
                    />
                </div>

                <form.Subscribe
                    selector={(state) => state.values.objectives[objectiveIndex]?.targets}
                    children={(targets) => {
                        if (targets.length > 1) {
                            return (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0"
                                    onClick={onRemove}
                                    type="button"
                                >
                                    <MinusIcon className="size-4"/>
                                </Button>
                            )
                        }
                    }}
                />
            </div>
        );
    }
})
