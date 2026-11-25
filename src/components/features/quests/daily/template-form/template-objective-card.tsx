import { useState, type ElementType, type ReactNode } from "react";
import { CaretDownIcon, GiftIcon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { useStore } from "@tanstack/react-form";
import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { TemplateTargets } from "@/components/features/quests/daily/template-form/template-targets.tsx";
import { PlaceholderExample } from "@/components/features/quests/daily/template-form/placeholder-example.tsx";
import { TemplateSummary } from "@/components/features/quests/daily/template-summary.tsx";
import { CUSTOMIZATIONS, type CustomizationId } from "@/config/quests/customization-options.ts";
import { fieldMetaHasErrors } from "@/lib/form-utils.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateFormValues } from "@/lib/schemas/daily-template-form.tsx";

function QuickLookIcon({ icon: Icon, hint, badge }: { icon: ElementType; hint: string; badge?: number }) {
    return (
        <Tooltip delayDuration={30}>
            <TooltipTrigger asChild>
                <span className="flex items-center gap-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
                    <Icon size={15} weight="duotone" />
                    {badge !== undefined && <span className="text-[11px] tabular-nums">{badge}</span>}
                </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>{hint}</TooltipContent>
        </Tooltip>
    );
}

interface TemplateObjectiveCardProps {
    /** Extra sections rendered below the targets (customizations, rewards). */
    children?: ReactNode;
}

/**
 * The template's single objective, in the quest editor's collapsible
 * objective card: a coloured summary with quick-look icons, then the
 * descriptions, targets and any extra sections.
 */
export const TemplateObjectiveCard = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: {} as TemplateObjectiveCardProps,
    render: function Render({ form, children }) {
        const [open, setOpen] = useState(true);
        const hasErrors = useStore(form.store, (state) =>
            ["objective_", "targets", "target_", "customizations", "rewards", "reward_picks", "logic"].some((prefix) =>
                fieldMetaHasErrors(state.fieldMeta as Parameters<typeof fieldMetaHasErrors>[0], prefix),
            ),
        );

        return (
            <Collapsible open={open} onOpenChange={setOpen}>
                <Card className={cn("p-0 gap-0 overflow-hidden bg-zinc-900/40", hasErrors && !open && "ring-2 ring-destructive")}>
                    <CollapsibleTrigger asChild>
                        <CardHeader className="p-0 flex flex-row gap-0 items-center space-y-0 transition-colors group hover:bg-zinc-800/20 cursor-pointer">
                            <div className="pl-3 pr-2 h-11 flex flex-row flex-1 min-w-0 items-center gap-2">
                                <CardTitle className="text-sm font-medium flex gap-2 items-center min-w-0 flex-1">
                                    <form.Subscribe
                                        selector={(state) => state.values}
                                        children={(values) => (
                                            <div className="pr-1 truncate leading-snug">
                                                {values.objective_display?.trim() ? (
                                                    <span>{values.objective_display}</span>
                                                ) : (
                                                    <TemplateSummary template={values} />
                                                )}
                                            </div>
                                        )}
                                    />
                                </CardTitle>
                                <form.Subscribe
                                    selector={(state) => ({
                                        customizations: state.values.customizations,
                                        rewards: state.values.rewards.length,
                                        picks: state.values.reward_picks,
                                    })}
                                    children={({ customizations, rewards, picks }) => (
                                        <div className="flex items-center gap-2 pr-1">
                                            {rewards > 0 && (
                                                <QuickLookIcon
                                                    icon={GiftIcon}
                                                    hint={`Gives ${Math.min(Number(picks) || 0, rewards)} of ${rewards} rewards`}
                                                    badge={rewards}
                                                />
                                            )}
                                            {Object.entries(customizations ?? {})
                                                .filter(([, option]) => option != null)
                                                .map(([id, option]) => {
                                                    const config = CUSTOMIZATIONS[id as CustomizationId];
                                                    if (!config) return null;
                                                    const chance = Math.round(((option as { chance: number }).chance ?? 0) * 100);
                                                    return <QuickLookIcon key={id} icon={config.icon} hint={`${config.display} · ${chance}% of rolls`} />;
                                                })}
                                        </div>
                                    )}
                                />
                                <CaretDownIcon
                                    size={14}
                                    className={cn(
                                        "text-muted-foreground/30 transition-all duration-150 group-hover:text-muted-foreground/60 shrink-0",
                                        open && "rotate-180 text-muted-foreground/50",
                                    )}
                                />
                            </div>
                        </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent asChild>
                        <CardContent className="px-2.5 py-2 grid gap-2.5">
                            <div className="flex flex-col gap-1">
                                <form.AppField
                                    name="objective_description"
                                    children={(field) => <field.ObjectiveDescriptionField />}
                                />
                                <PlaceholderExample form={form} name="objective_description" />
                            </div>
                            <form.AppField
                                name="objective_display"
                                children={(field) => <field.ObjectiveDisplayField />}
                            />

                            <TemplateTargets form={form} />

                            {children}
                        </CardContent>
                    </CollapsibleContent>
                </Card>
            </Collapsible>
        );
    },
});
