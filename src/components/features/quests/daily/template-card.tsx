import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ScalesIcon, TrophyIcon } from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { TemplateSummary } from "@/components/features/quests/daily/template-summary.tsx";
import { CUSTOMIZATIONS, type CustomizationId } from "@/config/quests/customization-options.ts";
import { OBJECTIVE_TYPES } from "@/config/quests/form-options.ts";
import {
    invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet,
    useUpdateDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdPatch,
} from "@/api/nexuscore/daily-quests/daily-quests.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateOut } from "@/api/nexuscore/model";

interface TemplateCardProps {
    template: DailyTemplateOut;
    /** This template's share of days among enabled templates (0–1). */
    share: number;
    /** Footer actions (preview, edit, delete). */
    actions?: ReactNode;
    /** Makes the name a link, e.g. to the editor. */
    renderName?: (name: string) => ReactNode;
}

function customizationChips(template: DailyTemplateOut) {
    return Object.entries(template.customizations ?? {})
        .filter(([, option]) => option != null)
        .map(([id, option]) => ({
            id: id as CustomizationId,
            chance: (option as { chance: number }).chance,
        }));
}

/** One template in the pool. Laid out like QuestCard, with an enabled switch in the header. */
export function TemplateCard({ template, share, actions, renderName }: TemplateCardProps) {
    const queryClient = useQueryClient();
    const update = useUpdateDailyTemplateV1GuildsMeQuestsDailyTemplatesTemplateIdPatch();
    const enabled = template.enabled ?? true;
    const type = OBJECTIVE_TYPES.find((option) => option.value === template.objective_type);
    const TypeIcon = type?.icon;
    const rewards = template.rewards ?? [];
    const logicLabel = template.logic === "sequential" ? "then" : (template.logic ?? "and");

    async function toggle(next: boolean) {
        try {
            await update.mutateAsync({ templateId: template.template_id, data: { enabled: next } });
            await invalidateListDailyTemplatesV1GuildsMeQuestsDailyTemplatesGet(queryClient);
            toast.success(`${template.name} ${next ? "enabled" : "disabled"}`);
        } catch (error) {
            toast.error(`Couldn't update ${template.name}`, { description: getSubmitErrorMessage(error) });
        }
    }

    return (
        <Card
            className={cn(
                "@container group/card hover:border-foreground/15 transition-[border-color,opacity] duration-200 p-0 gap-0 overflow-hidden h-full flex flex-col",
                !enabled && "opacity-60 hover:opacity-100",
            )}
        >
            <div className="px-2.5 py-1.5 bg-muted/30 border-b flex items-center justify-between gap-2 shrink-0">
                <div className="flex gap-1.5 items-center min-w-0">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0.5 font-semibold tracking-wide uppercase gap-1">
                        {TypeIcon && <TypeIcon weight="bold" />}
                        {type?.label ?? template.objective_type}
                    </Badge>
                    {template.targets.length > 1 && (
                        <Badge variant="secondary" className="px-1.5 py-0 text-[10px] font-normal">
                            {logicLabel}
                        </Badge>
                    )}
                </div>
                <Switch
                    checked={enabled}
                    disabled={update.isPending}
                    onCheckedChange={toggle}
                    aria-label={`${enabled ? "Disable" : "Enable"} ${template.name}`}
                />
            </div>

            <CardContent className="p-2.5 flex flex-col flex-1">
                <h4 className="font-semibold text-sm leading-tight line-clamp-1">
                    {renderName ? renderName(template.name) : template.name}
                </h4>
                <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">“{template.title}”</p>

                <p className="text-xs leading-relaxed my-2 line-clamp-2">
                    <TemplateSummary template={template} />
                </p>

                <div className="flex-1" />

                <div className="flex min-h-4 flex-wrap items-center gap-1 mb-2">
                    {customizationChips(template).map(({ id, chance }) => (
                        <Badge key={id} variant="secondary" className="px-1.5 py-0 text-[10px] font-normal gap-1">
                            {CUSTOMIZATIONS[id]?.display ?? id}
                            <span className="text-muted-foreground tabular-nums">{Math.round(chance * 100)}%</span>
                        </Badge>
                    ))}
                </div>

                <div className="flex items-center gap-2 mb-2 px-2 py-1 rounded bg-muted/30 border border-border/30 text-[11px]">
                    <ScalesIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" weight="duotone" />
                    <span className="text-muted-foreground">Weight</span>
                    <span className="font-semibold tabular-nums">{template.weight ?? 1}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                        <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${share * 100}%` }} />
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                        {enabled ? `${Math.round(share * 100)}% of days` : "off"}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-border/40">
                    <span className="flex items-center gap-1 text-[11px]" title="Rewards given per roll">
                        <TrophyIcon className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
                        <span className="font-semibold tabular-nums">
                            {Math.min(template.reward_picks ?? 1, rewards.length)} of {rewards.length}
                        </span>
                    </span>
                    <div className="flex shrink-0 items-center gap-0.5">{actions}</div>
                </div>
            </CardContent>
        </Card>
    );
}
