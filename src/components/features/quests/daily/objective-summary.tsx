import React from "react";
import { cn } from "@/lib/utils.ts";
import { getObjectiveVerb, getTargetLabel } from "@/lib/daily-quests.ts";
import type { ObjectiveIn, ObjectiveOut } from "@/api/nexuscore/model";

interface ObjectiveSummaryProps {
    /** A saved objective, or one rolled by a template preview. */
    objective: ObjectiveOut | ObjectiveIn;
    className?: string;
}

/**
 * One-line coloured objective summary, the same colours as the quest editor's
 * objective card header: "Kill 12 Pillager then 1 Ravager".
 */
export function ObjectiveSummary({ objective, className }: ObjectiveSummaryProps) {
    if (objective.display) {
        return <span className={cn("text-foreground", className)}>{objective.display}</span>;
    }

    const isOrWithCount = objective.targets.length > 1 && objective.logic === "or" && objective.target_count;
    const connector = objective.logic === "sequential" ? "then" : objective.logic;

    return (
        <span className={cn("inline", className)}>
            <span className="text-pink-700 dark:text-pink-200">{getObjectiveVerb(objective.objective_type)}</span>

            {isOrWithCount && (
                <>
                    <span className="text-muted-foreground"> any </span>
                    <span className="font-semibold">{objective.target_count}</span>
                    <span className="text-muted-foreground"> of</span>
                </>
            )}

            {objective.targets.map((target, index) => (
                <React.Fragment key={target.target_uuid ?? index}>
                    {index > 0 && (
                        <span className="text-muted-foreground">{isOrWithCount ? "," : ` ${connector}`}</span>
                    )}
                    {isOrWithCount ? (
                        <span className="text-lime-700 dark:text-lime-200"> {getTargetLabel(target)}</span>
                    ) : (
                        <>
                            <span className="font-semibold"> {target.count} </span>
                            <span className="text-green-700 dark:text-green-200">{getTargetLabel(target)}</span>
                        </>
                    )}
                </React.Fragment>
            ))}
        </span>
    );
}
