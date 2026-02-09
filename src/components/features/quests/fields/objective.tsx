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
import {ObjectiveFormValues, QuestFormValues, TargetFormValues} from "@/lib/schemas/quest-form.tsx";
import {TargetList} from "@/components/features/quests/fields/target/targets-list.tsx";
import {useStore} from "@tanstack/react-form";
import {formatNamespacedId} from "@/config/minecraft-options.ts";

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

        function getTargetText(target: TargetFormValues) {
            switch (target.target_type) {
                case "kill":
                    return target.entity ? formatNamespacedId(target.entity) : '';
                case "mine":
                    return target.block ? formatNamespacedId(target.block): '';
                case "scriptevent":
                    return target.script_id ? formatNamespacedId(target.script_id) : '';
            }
        }

        function getObjectiveTitle(objective: ObjectiveFormValues) {
            // Default fallback if no objective type or targets
            if (!objective ||
                !objective.objective_type ||
                !objective.targets[0].count
            ) {
                return <div>Objective #{index + 1}</div>
            }

            if (objective.display) {
                return <div>{objective.display}</div>
            }

            const elements: React.ReactNode[] = []

            // Add objective type
            elements.push(<div key="type" className={'capitalize text-yellow-200'}>{objective.objective_type}</div>)

            // Add "any X of" for OR logic with target_count
            if (objective.targets.length > 1 && objective.logic === 'or' && objective.target_count) {
                elements.push(<div key="any" className="text-muted-foreground">any</div>)
                elements.push(<div key="count" className="font-bold">{objective.target_count}</div>)
                elements.push(<div key="of" className="text-muted-foreground">of</div>)
            }

            // Add targets
            objective.targets.forEach((t, i) => {
                // Add logic operator between targets
                if (i > 0) {
                    elements.push(
                        <div key={`logic-${i}`} className="text-muted-foreground uppercase">
                            {objective.logic}
                        </div>
                    )
                }

                // Add target with or without count
                if (objective.logic === 'or' && objective.target_count) {
                    elements.push(
                        <div key={`target-${i}`} className={'text-blue-200'}>{getTargetText(t)}</div>
                    )
                } else {
                    elements.push(
                        <div key={`count-${i}`} className="font-bold">{t.count}</div>
                    )
                    elements.push(
                        <div key={`target-${i}`} className={'text-blue-200'}>{getTargetText(t)}</div>
                    )
                }
            })

            return <div className={'flex gap-1'}>{elements}</div>
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
                                                <div className="truncate leading-snug">
                                                    {objective.objective_id}
                                                    {getObjectiveTitle(objective)}
                                                </div>
                                            )
                                        }}
                                    />
                                    <CaretDownIcon
                                        className={cn(
                                            "transition-all duration-75 group-hover:font-bold shrink-0",
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
