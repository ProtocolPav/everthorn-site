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
import {Separator} from "@/components/ui/separator.tsx";
import {CustomizationSelect} from "@/components/features/quests/fields/customization/customization-select.tsx";
import {RewardList} from "@/components/features/quests/fields/reward/reward-list.tsx";
import {SortableItemHandle} from "@/components/ui/sortable.tsx";
import {GripVertical} from "lucide-react";
import React from "react";

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
            if (!objective?.objective_type || !objective.targets[0]?.count) {
                return <span className="text-muted-foreground italic">Objective #{index + 1}</span>;
            }

            if (objective.display) {
                return <span className="text-foreground">{objective.display}</span>;
            }

            const isOrWithCount =
                objective.targets.length > 1 &&
                objective.logic === 'or' &&
                objective.target_count;

            const connector = objective.logic === 'sequential' ? 'then' : objective.logic;

            return (
                <span className="inline">
                    <span className="capitalize text-pink-200">
                        {objective.objective_type}
                    </span>

                    {isOrWithCount && (
                        <>
                            <span className={'text-zinc-400'}> any </span>
                            <span className="font-semibold text-zinc-100">
                                {objective.target_count}
                            </span>
                            <span className={'text-zinc-400'}> of </span>
                        </>
                    )}

                    {objective.targets.map((t, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && (
                                <span className="text-zinc-400">
                                    {` ${connector} `}
                                </span>
                            )}
                            {isOrWithCount ? (
                                <span className="text-lime-200"> {getTargetText(t)}</span>
                            ) : (
                                <>
                                    <span className="font-semibold text-zinc-100"> {t.count} </span>
                                    <span className="text-green-200">{getTargetText(t)}</span>
                                </>
                            )}
                        </React.Fragment>
                    ))}
                </span>
            );
        }

        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <Card className={cn(
                    "p-0 gap-0 overflow-hidden",
                    hasErrors && !open && "ring-2 ring-destructive"
                )}>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="p-0 flex flex-row gap-0 space-y-0 transition-colors group hover:bg-zinc-800/20">
                            <SortableItemHandle asChild>
                                <Button variant="ghost" size="icon-sm" className="w-7 h-11 pl-0.5 rounded-none shrink-0 text-muted-foreground/50">
                                    <GripVertical />
                                </Button>
                            </SortableItemHandle>

                            <div className="pl-0.5 pr-2 p-1.5 flex flex-row flex-1 min-w-0 items-center gap-2">
                                <CardTitle className="text-sm font-medium flex gap-2 items-center min-w-0 flex-1">
                                    <form.Subscribe
                                        selector={(state) => [state.values.objectives[index]] as const}
                                        children={([objective]) => (
                                            <div className="pr-1 truncate leading-snug">
                                                {getObjectiveTitle(objective)}
                                            </div>
                                        )}
                                    />
                                </CardTitle>

                                <Button
                                    variant="ghost"
                                    size="icon-sm"
                                    className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive shrink-0"
                                    onClick={onRemove}
                                    type="button"
                                >
                                    <TrashIcon />
                                </Button>

                                <CaretDownIcon
                                    className={cn(
                                        "text-muted-foreground/40 transition-all duration-150 group-hover:text-muted-foreground shrink-0",
                                        open && "rotate-180"
                                    )}
                                />
                            </div>
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

                            <div className={'px-1 text-section-label flex gap-3 items-center'}>
                                Customization
                                <Separator className={'flex-1'}/>
                            </div>

                            <div className={'flex flex-wrap gap-2'}>
                                <form.Subscribe
                                    selector={(state) => state.values.objectives[index]?.customizations}
                                    children={(customizations) => {
                                        return Object.entries(customizations || {}).filter(([, value]) => value !== null).map(([key]) => {
                                            switch (key) {
                                                case "natural_block":
                                                    return (
                                                        <form.AppField
                                                            // @ts-ignore
                                                            name={`objectives[${index}].customizations.natural_block`}
                                                            children={(field) => <field.NaturalBlocksField/>}
                                                        />
                                                    )
                                                case "location":
                                                    return (
                                                        <form.AppField
                                                            // @ts-ignore
                                                            name={`objectives[${index}].customizations.location`}
                                                            children={(field) => <field.LocationField/>}
                                                        />
                                                    )
                                                case "mainhand":
                                                    return (
                                                        <form.AppField
                                                            // @ts-ignore
                                                            name={`objectives[${index}].customizations.mainhand`}
                                                            children={(field) => <field.MainhandField/>}
                                                        />
                                                    )
                                                case "timer":
                                                    return (
                                                        <form.AppField
                                                            // @ts-ignore
                                                            name={`objectives[${index}].customizations.timer`}
                                                            children={(field) => <field.TimerField/>}
                                                        />
                                                    )
                                                case "maximum_deaths":
                                                    return (
                                                        <form.AppField
                                                            // @ts-ignore
                                                            name={`objectives[${index}].customizations.maximum_deaths`}
                                                            children={(field) => <field.MaximumDeathsField/>}
                                                        />
                                                    )
                                            }
                                        })
                                    }}
                                />

                                <CustomizationSelect form={form} objective_index={index}/>
                            </div>

                            <div className={'px-1 text-section-label flex gap-3 items-center'}>
                                Rewards
                                <Separator className={'flex-1'}/>
                            </div>

                            <RewardList form={form} objectiveIndex={index}/>

                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        );
    },
});
