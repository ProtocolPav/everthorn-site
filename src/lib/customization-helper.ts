import {Customization} from "@/config/quests/customization-options.ts";
import {ObjectiveOutObjectiveType} from "@/api/nexuscore/model";

export function isAllowedForObjectiveType(
    cust: Customization,
    objective_type: ObjectiveOutObjectiveType | undefined
): boolean {
    if (!objective_type) return true

    if (cust.allowed_objective_types?.length) {
        return cust.allowed_objective_types.includes(objective_type)
    }

    if (cust.disallowed_objective_types?.length) {
        return !cust.disallowed_objective_types.includes(objective_type)
    }

    return true
}