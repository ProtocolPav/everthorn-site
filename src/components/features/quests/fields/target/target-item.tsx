import {Button} from "@/components/ui/button.tsx";
import {MinusIcon} from "@phosphor-icons/react";
import {KillTarget} from "@/components/features/quests/fields/target/kill-target.tsx";
import {MineTarget} from "@/components/features/quests/fields/target/mine-target.tsx";
import {ScriptEventTarget} from "@/components/features/quests/fields/target/scriptevent-target.tsx";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import type {ComponentType} from "react";
import {ObjectiveOutObjectiveType} from "@/api/nexuscore/model";

interface TargetComponentProps {
    form: any;
    objectiveIndex: number;
    targetIndex: number;
}

const TARGET_COMPONENT_MAP: Record<ObjectiveOutObjectiveType, ComponentType<TargetComponentProps>> = {
    kill: KillTarget,
    mine: MineTarget,
    scriptevent: ScriptEventTarget,
};

export const TargetItem = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        targetIndex: 0,
        targetType: "kill" as string,
        onRemove: () => {}
    },

    render: function Render({form, objectiveIndex, targetIndex, targetType, onRemove}) {
        const TargetComponent = TARGET_COMPONENT_MAP[targetType as ObjectiveOutObjectiveType];

        if (!TargetComponent) {
            return (
                <Button variant={'destructive'} onClick={onRemove}>
                    Unknown Target Type. Click to Remove.
                </Button>
            );
        }

        return (
            <div className="flex gap-1 items-center">
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
                                    size="icon-sm"
                                    className="size-7 text-muted-foreground hover:text-destructive"
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
