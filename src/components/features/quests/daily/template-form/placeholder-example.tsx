import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { fillTemplatePlaceholders } from "@/lib/daily-quests.ts";
import type { DailyTemplateFormValues } from "@/lib/schemas/daily-template-form.tsx";

export type PlaceholderFieldName = "title" | "description" | "objective_description" | "objective_display";

export const PLACEHOLDER_FIELDS: PlaceholderFieldName[] = ["title", "description", "objective_description", "objective_display"];

/**
 * A muted "↳" line under a text field showing it with `{targets}` and
 * `{count}` filled in. Hidden when the text has no placeholders.
 */
export const PlaceholderExample = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: { name: "title" as PlaceholderFieldName },
    render: function Render({ form, name }) {
        return (
            <form.Subscribe
                selector={(state) => ({
                    text: state.values[name] ?? "",
                    logic: state.values.logic,
                    targets: state.values.targets,
                    target_count: state.values.target_count,
                    target_picks: state.values.target_picks,
                })}
                children={({ text, ...source }) => {
                    if (!/\{(targets|count)\}/.test(text)) return null;
                    return (
                        <p className="text-hint px-1" title="Example with each random count at its lowest value">
                            <span aria-hidden="true">↳ </span>
                            {fillTemplatePlaceholders(text, source)}
                        </p>
                    );
                }}
            />
        );
    },
});
