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
import {QuickLookSection} from "@/components/features/quests/fields/objective/quick-look.tsx";

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
                        <CardHeader className="p-0 flex flex-row gap-0 items-center space-y-0 transition-colors group hover:bg-zinc-800/20">
                            <SortableItemHandle asChild>
                                <Button variant="ghost" size="icon-sm" className="w-6 h-11 rounded-none shrink-0 text-muted-foreground/30 hover:text-muted-foreground/60 cursor-grab">
                                    <GripVertical size={14} />
                                </Button>
                            </SortableItemHandle>

                            <div className="pl-0.5 pr-2 flex flex-row flex-1 min-w-0 items-center gap-2">
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

                                <form.Subscribe
                                    selector={(state) => [state.values.objectives[index]?.customizations, state.values.objectives[index]?.rewards?.length ?? 0] as const}
                                    children={([customizations, rewardsCount]) => (
                                        <div className="flex items-center">
                                            <div className="flex items-center gap-2 pr-2 shrink group-hover:w-auto group-hover:shrink overflow-hidden transition-all duration-200 ease-out">
                                                <QuickLookSection
                                                    customizations={customizations || {}}
                                                    rewardsCount={rewardsCount}
                                                />
                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="w-0 overflow-hidden p-0 text-muted-foreground hover:text-destructive! transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)]:group-hover:w-8 [@media(hover:none)]:w-8"
                                                onClick={(e) => { e.stopPropagation(); onRemove(); }}
                                                type="button"
                                            >
                                                <TrashIcon size={13} />
                                            </Button>
                                        </div>
                                    )}
                                />

                                <CaretDownIcon
                                    size={14}
                                    className={cn(
                                        "text-muted-foreground/30 transition-all duration-150 group-hover:text-muted-foreground/60 shrink-0",
                                        open && "rotate-180 text-muted-foreground/50"
                                    )}
                                />
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                        <CardContent className="px-2.5 py-2 grid gap-2.5">
                            <form.AppField
                                name={`objectives[${index}].description`}
                                children={(field) => <field.ObjectiveDescriptionField/>}
                            />

                            <form.AppField
                                name={`objectives[${index}].display`}
                                children={(field) => <field.ObjectiveDisplayField/>}
                            />

                            <TargetList form={form} objectiveIndex={index}/>

                            <div className={'text-section-label flex gap-3 items-center'}>
                                Customization
                                <Separator className={'flex-1'}/>
                            </div>

                            <div className={'flex flex-wrap gap-1.5'}>
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

                            <div className={'text-section-label flex gap-3 items-center'}>
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
