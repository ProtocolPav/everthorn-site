import { useState } from "react";
import { ArrowsHorizontalIcon, DiceFiveIcon, MapPinAreaIcon, MinusIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";
import { LocationAreaInput } from "@/components/features/quests/fields/location-area-input.tsx";
import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { TARGET_ENTITY_CONFIG } from "@/config/quests/target-options.ts";
import { isTemplateCustomizationAllowed, TEMPLATE_CUSTOMIZATION_IDS } from "@/config/quests/daily-template-options.ts";
import { createTargetOption } from "@/lib/daily-template-conversion.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateFormValues } from "@/lib/schemas/daily-template-form.tsx";

const label = "text-sm text-muted-foreground";

function isFieldInvalid(meta: { isTouched: boolean; isValid: boolean }, submitted: boolean) {
    return (meta.isTouched || submitted) && !meta.isValid;
}

/** Combobox for a kill entity or mine block, like the quest editor's TargetEntityField. */
const EntityTarget = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: { index: 0, type: "kill" as "kill" | "mine" },
    render: function Render({ form, index, type }) {
        const config = TARGET_ENTITY_CONFIG[type];
        const [randomOption] = useState(() => Math.floor(Math.random() * config.options.length));
        const name = (type === "kill" ? `targets[${index}].entity` : `targets[${index}].block`) as `targets[${number}].entity`;

        return (
            <form.AppField
                name={name}
                children={(field) => {
                    const invalid = isFieldInvalid(field.state.meta, form.state.submissionAttempts > 0);
                    return (
                        <Field className="flex-1 w-0 min-w-0">
                            <FieldLabel className="sr-only">{config.fieldName}</FieldLabel>
                            <VirtualizedCombobox
                                value={(field.state.value as string | undefined) ?? ""}
                                onValueChange={(value) => {
                                    field.handleChange(value);
                                    field.handleBlur();
                                }}
                                options={config.options}
                                placeholder={`e.g. ${config.options[randomOption]?.label ?? "..."}`}
                                allowCustom={true}
                                searchPlaceholder={config.searchPlaceholder}
                                showIcons={false}
                                className={cn(invalid && "ring-2 ring-destructive focus:ring-destructive")}
                            />
                        </Field>
                    );
                }}
            />
        );
    },
});

const ScriptEventTarget = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: { index: 0 },
    render: function Render({ form, index }) {
        return (
            <form.AppField
                name={`targets[${index}].script_id` as `targets[${number}].script_id`}
                children={(field) => {
                    const invalid = isFieldInvalid(field.state.meta, form.state.submissionAttempts > 0);
                    return (
                        <Field className="flex-1 min-w-0">
                            <FieldLabel className="sr-only">Script ID</FieldLabel>
                            <Input
                                value={(field.state.value as string | undefined) ?? ""}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                placeholder="Script ID (e.g., my_custom_event)"
                                className={invalid ? "ring-2 ring-destructive" : ""}
                            />
                        </Field>
                    );
                }}
            />
        );
    },
});

/** A locate target: a summary button that opens the same kind of dialog as the quest editor's. */
const VisitTarget = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: { index: 0 },
    render: function Render({ form, index }) {
        const prefix = `targets[${index}]`;

        return (
            <Dialog>
                <form.Subscribe
                    selector={(state) => state.values.targets[index]}
                    children={(target) => {
                        if (target?.target_type !== "visit") return null;
                        const hasLabel = Boolean(target.helper_text?.trim());
                        return (
                            <DialogTrigger asChild>
                                <Button variant="outline" type="button" className="w-full justify-start gap-2 overflow-hidden px-3 font-normal">
                                    <span className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden text-xs">
                                        <span className={cn("truncate font-medium", !hasLabel && "text-muted-foreground")}>
                                            {hasLabel ? target.helper_text : "Click to edit"}
                                        </span>
                                        <span className="shrink-0 font-mono text-muted-foreground">
                                            [{target.coordinates?.join(", ")}]
                                        </span>
                                        <span className="inline-flex shrink-0 items-center gap-0.5 text-muted-foreground">
                                            <ArrowsHorizontalIcon className="size-3" />
                                            {target.horizontal_radius}
                                        </span>
                                    </span>
                                </Button>
                            </DialogTrigger>
                        );
                    }}
                />
                <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                    <DialogTitle className="sr-only">Edit Locate Target</DialogTitle>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <MapPinAreaIcon className="text-muted-foreground" />
                            <span className={label}>Locate...</span>
                        </div>
                        <form.AppField
                            name={`${prefix}.helper_text` as `targets[${number}].helper_text`}
                            children={(field) => (
                                <div className="flex items-center gap-2">
                                    <span className={label}>Locate</span>
                                    <Input
                                        aria-invalid={!field.state.meta.isValid}
                                        placeholder="the Super Secret button"
                                        value={(field.state.value as string | undefined) ?? ""}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </div>
                            )}
                        />
                        <form.Subscribe
                            selector={(state) => ({
                                target: state.values.targets[index],
                                isInvalid: (["coordinates", "horizontal_radius", "vertical_radius"] as const).some((key) => {
                                    const meta = state.fieldMeta[`${prefix}.${key}` as keyof typeof state.fieldMeta];
                                    return (meta?.errors?.length ?? 0) > 0;
                                }),
                            })}
                            children={({ target, isInvalid }) => {
                                if (target?.target_type !== "visit") return null;
                                return (
                                    <LocationAreaInput
                                        allowAnyHeight
                                        isInvalid={isInvalid}
                                        value={target}
                                        onChange={(area) => {
                                            form.setFieldValue(`${prefix}.coordinates` as `targets[${number}].coordinates`, area.coordinates as never);
                                            form.setFieldValue(`${prefix}.horizontal_radius` as `targets[${number}].horizontal_radius`, area.horizontal_radius as never);
                                            form.setFieldValue(`${prefix}.vertical_radius` as `targets[${number}].vertical_radius`, (area.vertical_radius ?? undefined) as never);
                                        }}
                                    />
                                );
                            }}
                        />
                        <form.AppField
                            name={`${prefix}.seconds` as `targets[${number}].seconds`}
                            children={(field) => (
                                <div className="flex items-center flex-wrap gap-2">
                                    <span className={label}>Stay for</span>
                                    <Input
                                        type="number"
                                        min={1}
                                        className="w-16"
                                        aria-invalid={!field.state.meta.isValid}
                                        value={(field.state.value as number | undefined) ?? ""}
                                        onChange={(e) => field.handleChange(e.target.value === "" ? (undefined as unknown as number) : parseInt(e.target.value))}
                                    />
                                    <span className={label}>seconds</span>
                                </div>
                            )}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        );
    },
});

/**
 * Objective type, logic and target options. Same layout as the quest
 * editor's TargetList; each target's count is a RandomCount, hidden for
 * "any" logic where the total is set once.
 */
export const TemplateTargets = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: {},
    render: function Render({ form }) {
        return (
            <div className="flex gap-2 text-sm">
                <div className="flex flex-col gap-2 items-end">
                    <form.AppField
                        name="objective_type"
                        listeners={{
                            onChange: ({ value }) => {
                                form.setFieldValue("targets", [createTargetOption(value)]);
                                form.setFieldValue("logic", "and");
                                form.setFieldValue("target_count", null);
                                form.setFieldValue("target_picks", null);
                                // Strip customizations the new objective type doesn't allow.
                                const current = form.getFieldValue("customizations") ?? {};
                                const next = { ...current };
                                for (const id of TEMPLATE_CUSTOMIZATION_IDS) {
                                    if (!isTemplateCustomizationAllowed(id, value)) delete next[id];
                                }
                                form.setFieldValue("customizations", next);
                            },
                        }}
                        children={(field) => <field.ObjectiveTypeField />}
                    />
                    <form.Subscribe
                        selector={(state) => state.values.targets.length}
                        children={(count) =>
                            count > 1 ? <form.AppField name="logic" children={(field) => <field.TargetLogicField />} /> : null
                        }
                    />
                </div>

                <div className="flex flex-col gap-2 w-full min-w-0">
                    <form.Subscribe
                        selector={(state) => state.values.targets.length > 1 && state.values.logic === "or"}
                        children={(isAny) =>
                            isAny ? (
                                <div className="flex items-center gap-1.5 w-fit text-sm text-muted-foreground">
                                    any
                                    <form.AppField
                                        name="target_count"
                                        children={(field) => <field.RandomCountField label="Total count" placeholder="e.g. 8-12" />}
                                    />
                                    of
                                    <FieldInfoTooltip side="right">
                                        Required for “or”: the total players must reach across these targets. Rolled
                                        each day.
                                    </FieldInfoTooltip>
                                </div>
                            ) : null
                        }
                    />

                    <form.AppField
                        name="targets"
                        mode="array"
                        listeners={{
                            onChange: ({ value }) => {
                                if (value.length <= 1) {
                                    form.setFieldValue("logic", "and");
                                    form.setFieldValue("target_count", null);
                                    form.setFieldValue("target_picks", null);
                                }
                            },
                        }}
                    >
                        {(field) => (
                            <div className="flex flex-1 flex-col gap-2">
                                <form.Subscribe
                                    selector={(state) => ({
                                        targets: state.values.targets,
                                        isAny: state.values.targets.length > 1 && state.values.logic === "or",
                                    })}
                                    children={({ targets, isAny }) =>
                                        targets.map((target, index) => (
                                            <div key={target.target_uuid} className="flex gap-1 items-center">
                                                <div className="flex flex-1 min-w-0 gap-2 items-start">
                                                    {!isAny && target.target_type !== "visit" && (
                                                        <form.AppField
                                                            name={`targets[${index}].count`}
                                                            children={(countField) => <countField.RandomCountField />}
                                                        />
                                                    )}
                                                    {(target.target_type === "kill" || target.target_type === "mine") && (
                                                        <EntityTarget form={form} index={index} type={target.target_type} />
                                                    )}
                                                    {target.target_type === "scriptevent" && <ScriptEventTarget form={form} index={index} />}
                                                    {target.target_type === "visit" && <VisitTarget form={form} index={index} />}
                                                </div>
                                                {targets.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        className="size-7 text-muted-foreground hover:text-destructive"
                                                        onClick={() => field.removeValue(index)}
                                                        type="button"
                                                        aria-label="Remove target"
                                                    >
                                                        <MinusIcon className="size-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        ))
                                    }
                                />
                                <form.Subscribe
                                    selector={(state) => ({
                                        count: state.values.targets.length,
                                        hasPicks: state.values.target_picks != null,
                                    })}
                                    children={({ count, hasPicks }) => (
                                        <>
                                            {hasPicks && (
                                                <div className="flex flex-wrap items-center gap-1.5 rounded-md bg-muted/30 px-2 py-1 text-sm text-muted-foreground">
                                                    <DiceFiveIcon className="size-4 shrink-0" />
                                                    use
                                                    <form.AppField
                                                        name="target_picks"
                                                        children={(picksField) => <picksField.RandomCountField label="Targets to pick" placeholder="1" />}
                                                    />
                                                    of {count} at random
                                                    <FieldInfoTooltip side="right">
                                                        Each day uses a random subset of the targets, e.g. “one random ore”.
                                                    </FieldInfoTooltip>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        type="button"
                                                        className="ml-auto size-6 text-muted-foreground/60 hover:text-destructive"
                                                        aria-label="Use all targets"
                                                        onClick={() => form.setFieldValue("target_picks", null)}
                                                    >
                                                        <XIcon size={12} />
                                                    </Button>
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    type="button"
                                                    className="w-fit text-muted-foreground"
                                                    onClick={() => field.pushValue(createTargetOption(form.getFieldValue("objective_type")))}
                                                >
                                                    <PlusIcon />
                                                    Add Target
                                                </Button>
                                                {count > 1 && !hasPicks && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        type="button"
                                                        className="w-fit text-muted-foreground"
                                                        onClick={() => form.setFieldValue("target_picks", { choices: [1] })}
                                                    >
                                                        <DiceFiveIcon />
                                                        Pick a random subset
                                                    </Button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                />
                            </div>
                        )}
                    </form.AppField>
                </div>
            </div>
        );
    },
});
