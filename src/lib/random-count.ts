import type { RandomCount } from "@/api/nexuscore/model";

/**
 * RandomCount is a randomised number used by daily templates: either an
 * inclusive `{min, max}` range or a list of `{choices}`, never both.
 */

/** "7", "5–8" or "5 / 10 / 20". */
export function formatRandomCount(value: RandomCount | null | undefined): string {
    if (!value) return "?";
    if (value.choices && value.choices.length > 0) return value.choices.join(" / ");
    if (value.min != null && value.max != null) {
        return value.min === value.max ? `${value.min}` : `${value.min}–${value.max}`;
    }
    return "?";
}

/** The smallest value the count can roll. */
export function lowestRandomCount(value: RandomCount | null | undefined): number | null {
    if (!value) return null;
    if (value.choices && value.choices.length > 0) return Math.min(...value.choices);
    return value.min ?? null;
}
