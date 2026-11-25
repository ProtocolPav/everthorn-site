import { useCallback, useRef, useState, type SyntheticEvent } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";
import { QuestFormFooter, type SubmitStatus } from "@/components/features/quests/footer/quest-form-footer.tsx";
import { useTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { TemplateMetaBadges } from "@/components/features/quests/daily/template-form/template-meta-badges.tsx";
import { TemplateObjectiveCard } from "@/components/features/quests/daily/template-form/template-objective-card.tsx";
import {
    PLACEHOLDER_FIELDS,
    PlaceholderExample,
    type PlaceholderFieldName,
} from "@/components/features/quests/daily/template-form/placeholder-example.tsx";
import { dailyTemplateFormSchema, type DailyTemplateFormValues } from "@/lib/schemas/daily-template-form.tsx";
import { getValidationErrors } from "@/lib/quest-form-errors.ts";
import { getSubmitErrorMessage } from "@/lib/quest-orval-errors.ts";
import { useFieldValidity } from "@/hooks/use-field-validity.ts";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateOut } from "@/api/nexuscore/model";

interface TemplateEditFormProps {
    template?: DailyTemplateOut;
    defaultValues: DailyTemplateFormValues;
    onSubmit: (values: DailyTemplateFormValues) => Promise<DailyTemplateOut>;
    /** Other enabled templates' total weight, for the weight badge's share of days. */
    otherEnabledWeight: number;
}

/** Where the last placeholder-capable field had its cursor, so the chips insert there. */
interface Caret {
    name: PlaceholderFieldName;
    start: number;
    end: number;
}

function QuestTitleInput() {
    const field = useFieldContext<string>();
    const { isInvalid } = useFieldValidity();
    return (
        <div className="relative">
            <Input
                id={field.name}
                name={field.name}
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Quest title players see, e.g. Daily: Hunt {targets}"
                aria-label="Quest title"
                className={cn("focus-visible:ring-0 pr-9", isInvalid && "ring-2 ring-destructive")}
            />
            <div className="absolute top-2.5 right-3">
                <FieldInfoTooltip>The generated quest's title. Supports {"{targets}"} and {"{count}"}.</FieldInfoTooltip>
            </div>
        </div>
    );
}

/**
 * The daily template editor. Laid out like QuestEditForm: a seamless name,
 * a badge row, the quest text, then one objective card holding targets,
 * customizations and rewards, with the same footer.
 */
export function TemplateEditForm({ template, defaultValues, onSubmit, otherEnabledWeight }: TemplateEditFormProps) {
    const navigate = useNavigate();
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
    const caret = useRef<Caret | null>(null);

    const form = useTemplateForm({
        defaultValues,
        validationLogic: revalidateLogic({ mode: "change" }),
        validators: {
            // @ts-ignore -- same pattern as QuestEditForm: the schema's input type differs from the values type
            onDynamic: dailyTemplateFormSchema,
        },
        onSubmit: async ({ value }) => {
            setSubmitStatus("loading");
            try {
                const saved = await onSubmit(value);
                setSubmitStatus("success");
                toast.success(
                    template ? `"${saved.name}" saved` : `"${saved.name}" created`,
                    { description: "Changes apply to days generated from now on." },
                );
                if (!template) {
                    await navigate({ to: "/admin/quests/daily/templates" });
                }
                window.setTimeout(() => setSubmitStatus("idle"), 2000);
            } catch (error) {
                setSubmitStatus("idle");
                toast.error("Failed to save template", { description: getSubmitErrorMessage(error) });
            }
        },
    });

    const applyParsedJson = useCallback(
        (parsed: object) => {
            for (const key of Object.keys(parsed) as (keyof DailyTemplateFormValues)[]) {
                // @ts-ignore -- raw JSON is validated by the schema after it's applied
                form.setFieldValue(key, parsed[key]);
            }
        },
        [form],
    );

    function rememberCaret(event: SyntheticEvent) {
        const target = event.target as HTMLInputElement | HTMLTextAreaElement;
        if (!PLACEHOLDER_FIELDS.includes(target.name as PlaceholderFieldName)) return;
        caret.current = {
            name: target.name as PlaceholderFieldName,
            start: target.selectionStart ?? target.value.length,
            end: target.selectionEnd ?? target.value.length,
        };
    }

    function insertPlaceholder(token: string) {
        const at = caret.current ?? { name: "description" as const, start: Infinity, end: Infinity };
        const current = (form.getFieldValue(at.name) as string | null | undefined) ?? "";
        const start = Math.min(at.start, current.length);
        const end = Math.min(at.end, current.length);
        form.setFieldValue(at.name, current.slice(0, start) + token + current.slice(end));
        caret.current = { name: at.name, start: start + token.length, end: start + token.length };
        document.getElementById(at.name)?.focus();
    }

    return (
        <form
            id="template-editor"
            className="flex flex-col"
            onFocusCapture={rememberCaret}
            onSelectCapture={rememberCaret}
            onKeyUpCapture={rememberCaret}
            onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await form.handleSubmit();
            }}
        >
            <div className="flex flex-col gap-3 pb-3">
                <form.AppField name="name" children={(field) => <field.QuestTitleField placeholder="Untitled template" />} />

                <TemplateMetaBadges form={form} otherEnabledWeight={otherEnabledWeight} />

                <div className="text-section-label flex gap-1.5 items-center mt-1">
                    Quest
                    <FieldInfoTooltip>
                        What players see. {"{targets}"} becomes e.g. “12 Pillager and 1 Ravager” and {"{count}"} the
                        total, both filled in when the day is rolled.
                    </FieldInfoTooltip>
                    <span className="flex gap-1 normal-case tracking-normal">
                        {["{targets}", "{count}"].map((token) => (
                            <Button
                                key={token}
                                type="button"
                                variant="outline"
                                size="xs"
                                className="h-5 px-1.5 font-mono text-[11px]"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => insertPlaceholder(token)}
                                title={`Insert ${token} at the cursor`}
                            >
                                {token}
                            </Button>
                        ))}
                    </span>
                    <Separator className="flex-1" />
                </div>

                <div className="flex flex-col gap-1">
                    <form.AppField name="title" children={() => <QuestTitleInput />} />
                    <PlaceholderExample form={form} name="title" />
                </div>

                <div className="flex flex-col gap-1">
                    <form.AppField
                        name="description"
                        children={(field) => (
                            <field.QuestDescriptionField
                                placeholder="Set the scene for the day. e.g. The farmers need wool. Bring back {targets}!"
                                info="The generated quest's description. Supports {targets} and {count}."
                            />
                        )}
                    />
                    <PlaceholderExample form={form} name="description" />
                </div>

                <div>
                    <div className="text-section-label flex gap-3 items-center mb-2">
                        Objective <Separator className="flex-1" />
                    </div>
                    <TemplateObjectiveCard form={form} />
                </div>
            </div>

            <form.Subscribe selector={(state) => ({ fieldMeta: state.fieldMeta, values: state.values })}>
                {({ fieldMeta, values }) => (
                    <QuestFormFooter
                        isEditing={Boolean(template)}
                        submitStatus={submitStatus}
                        formValues={values}
                        onApplyValues={applyParsedJson}
                        validationErrors={getValidationErrors(fieldMeta)}
                        createLabel="Create Template"
                    />
                )}
            </form.Subscribe>
        </form>
    );
}
