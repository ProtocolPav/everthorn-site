import React from "react";
import { cn } from "@/lib/utils.ts";
import { getObjectiveVerb, getTargetLabel } from "@/lib/daily-quests.ts";
import { formatRandomCount } from "@/lib/random-count.ts";
import type { DailyTemplateIn } from "@/api/nexuscore/model";

type TemplateSummarySource = Pick<DailyTemplateIn, "objective_type" | "logic" | "targets" | "target_count" | "target_picks">;

interface TemplateSummaryProps {
    template: TemplateSummarySource;
    className?: string;
}

/**
 * The template's objective in the quest editor's summary colours, with
 * random counts as ranges: "Kill 10–14 Pillager then 1 Ravager",
 * "Kill any 8–12 of 2 random: Zombie, Skeleton, Husk".
 */
export function TemplateSummary({ template, className }: TemplateSummaryProps) {
    const isOr = template.logic === "or" && template.targets.length > 1;
    const connector = template.logic === "sequential" ? "then" : (template.logic ?? "and");
    const picks = template.target_picks ? formatRandomCount(template.target_picks) : null;

    return (
        <span className={cn("inline", className)}>
            <span className="text-pink-700 dark:text-pink-200">{getObjectiveVerb(template.objective_type)}</span>

            {isOr && (
                <>
                    <span className="text-muted-foreground"> any </span>
                    <span className="font-semibold">{formatRandomCount(template.target_count)}</span>
                    <span className="text-muted-foreground"> of</span>
                </>
            )}
            {picks && (
                <>
                    <span className="font-semibold"> {picks}</span>
                    <span className="text-muted-foreground"> random:</span>
                </>
            )}

            {template.targets.map((target, index) => {
                const label = getTargetLabel(target) || "?";
                return (
                    <React.Fragment key={target.target_uuid ?? index}>
                        {index > 0 && (
                            <span className="text-muted-foreground">{isOr || picks ? "," : ` ${connector}`}</span>
                        )}
                        {isOr ? (
                            <span className="text-lime-700 dark:text-lime-200"> {label}</span>
                        ) : (
                            <>
                                <span className="font-semibold"> {formatRandomCount(target.count ?? { choices: [1] })} </span>
                                <span className="text-green-700 dark:text-green-200">{label}</span>
                            </>
                        )}
                    </React.Fragment>
                );
            })}
        </span>
    );
}
