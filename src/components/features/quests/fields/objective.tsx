import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {CaretDownIcon, TrashIcon} from "@phosphor-icons/react";
import {withQuestForm} from "@/components/features/quests/quest-form.ts";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx";
import {useState} from "react";
import {cn} from "@/lib/utils.ts";
import {ObjectiveFormValues, QuestFormValues} from "@/lib/schemas/quest-form.tsx";
import {TargetList} from "@/components/features/quests/fields/target/targets-list.tsx";
import {useStore} from "@tanstack/react-form";

export const QuestObjectiveCard = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        index: 0,
        onRemove: () => {
        },
    },

    render: function Render({form, index, onRemove}) {
        const [open, setOpen] = useState(false);

        const hasErrors = useStore(form.store, (state) => {
            const fieldMeta = state.fieldMeta;

            // Check if any field starting with objectives[index] has errors AND has been touched
            return Object.keys(fieldMeta).some(key => {
                if (key.startsWith(`objectives[${index}]`)) {
                    // @ts-ignore
                    const meta = fieldMeta[key];
                    return meta.isTouched && meta.errors && meta.errors.length > 0;
                }
                return false;
            });
        });

        function getObjectiveTitle(objective: ObjectiveFormValues) {
            if (objective.display) {
                return objective.display
            } else {
                const title_string: string[] = [objective.objective_type]

                if (objective.targets.length > 1 && objective.logic === 'or' && objective.target_count) {
                    title_string.push('any', String(objective.target_count), 'of')
                }

                objective.targets.forEach((t, i) => {
                    if (i > 0) {
                        title_string.push(objective.logic)
                    }

                    if (objective.logic === 'or' && objective.target_count) {
                        title_string.push('aaa')
                    } else {
                        title_string.push(String(t.count), 'aa')
                    }
                })

                return title_string.join(' ')
            }
        }

        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <Card className={cn(
                    "p-0 gap-0 transition-all overflow-hidden",
                    hasErrors && "ring-2 ring-destructive"
                )}>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="p-2 flex flex-row items-center justify-between space-y-0 group hover:bg-input/10">
                            <div className="flex items-center gap-2 min-w-0">
                                <Button variant="invisible" size="icon-sm"/>

                                <CardTitle className="font-medium flex gap-2 items-center min-w-0">
                                    <form.Subscribe
                                        selector={(state) => [state.values.objectives[index]] as const}
                                        children={([objective]) => {
                                            return (
                                                <div className="truncate">
                                                    {getObjectiveTitle(objective)}
                                                </div>
                                            )
                                        }}
                                    />
                                    <CaretDownIcon
                                        className={cn(
                                            "transition-all duration-75 group-hover:font-bold flex-shrink-0",
                                            open ? "rotate-180" : ""
                                        )}
                                    />
                                </CardTitle>

                            </div>

                            <Button
                                variant="ghost"
                                size="icon-sm"
                                className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive"
                                onClick={onRemove}
                                type="button"
                            >
                                <TrashIcon />
                            </Button>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                        <CardContent className="p-2 grid gap-4">
                            <form.AppField
                                name={`objectives[${index}].description`}
                                children={(field) => <field.ObjectiveDescriptionField/>}
                            />

                            <form.AppField
                                name={`objectives[${index}].display`}
                                children={(field) => <field.ObjectiveDisplayField/>}
                            />

                            <TargetList form={form} objectiveIndex={index}/>
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        );
    },
});
