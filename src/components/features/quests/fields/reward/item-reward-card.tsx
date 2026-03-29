import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues, RewardFormValues } from "@/lib/schemas/quest-form.tsx";
import { RewardCard } from "@/components/features/quests/fields/reward/reward-card.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { MINECRAFT_ITEM_OPTIONS, formatNamespacedId } from "@/config/minecraft-options.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { MetadataSelect } from "@/components/features/quests/fields/reward/metadata-select.tsx";
import { useStore } from "@tanstack/react-form";
import { Badge } from "@/components/ui/badge.tsx";
import { GiftIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils.ts";

type ItemTexturesModule = {
    items?: Record<string, { texture?: string }>;
};

const textures = await import(`minecraft-textures/dist/textures/json/26.1.id.json`) as ItemTexturesModule;

export const ItemRewardCard = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        rewardIndex: 0,
        onRemove: () => {},
    },

    render: function Render({ form, objectiveIndex, rewardIndex, onRemove }) {
        const option = REWARD_OPTIONS_MAP.item;

        const reward = useStore(form.store, (state) => {
            const r = state.values.objectives[objectiveIndex]?.rewards[rewardIndex];
            return r as RewardFormValues | undefined;
        });

        // Card border goes red when any field in this reward has errors (after touch or submit)
        const hasErrors = useStore(form.store, (state) => {
            const fieldMeta = state.fieldMeta;
            const prefix = `objectives[${objectiveIndex}].rewards[${rewardIndex}]`;
            const submitted = state.submissionAttempts > 0;
            return Object.keys(fieldMeta).some(key => {
                if (!key.startsWith(prefix)) return false;
                // @ts-ignore
                const meta = fieldMeta[key];
                return (meta.isTouched || submitted) && meta.errors && meta.errors.length > 0;
            });
        });

        const metadataErrors = useStore(form.store, (state) => {
            const meta = state.fieldMeta[`objectives[${objectiveIndex}].rewards[${rewardIndex}].item_metadata`];
            const submitted = state.submissionAttempts > 0;
            if (!meta?.isTouched && !submitted) return [];
            return meta?.errors ?? [];
        });

        const itemId = reward?.item;
        const count = reward?.count ?? 1;
        const displayName = reward?.display_name;

        const hintParts: string[] = [];
        if (itemId) hintParts.push(`${itemId}`);
        const hint = hintParts.length > 0 ? hintParts.join(" · ") : "Configure item";

        const textureUrl = itemId ? textures.items?.[itemId]?.texture ?? null : null;
        const labelText = displayName || (itemId ? formatNamespacedId(itemId) : null);

        const buttonContent = (
            <>
                {textureUrl
                    ? <img src={textureUrl} alt="" className="size-4 pixelated" />
                    : <GiftIcon size={14} weight="fill" />
                }
                {count > 1 && (
                    <Badge variant="secondary" className="px-1 py-0 text-[10px] font-mono h-4">
                        x{count}
                    </Badge>
                )}
                <span className="truncate max-w-40">{labelText ?? "Select item"}</span>
            </>
        );

        function touchRewardFields() {
            const fieldNames = [
                `objectives[${objectiveIndex}].rewards[${rewardIndex}].item`,
                `objectives[${objectiveIndex}].rewards[${rewardIndex}].count`,
            ] as const;
            fieldNames.forEach((name) =>
                // @ts-ignore
                form.validateField(name, 'blur')
            );
        }

        return (
            <RewardCard
                title="Item"
                icon={option.icon}
                hint={hint}
                onRemove={onRemove}
                onOpenDialog={touchRewardFields}
                buttonContent={buttonContent}
                hasErrors={hasErrors}
            >
                <div className="flex flex-col gap-3">
                    <form.AppField
                        name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].item`}
                        children={(field) => {
                            const submitted = form.state.submissionAttempts > 0;
                            const isInvalid = (field.state.meta.isTouched || submitted) && !field.state.meta.isValid;
                            return (
                                <Field>
                                    <FieldLabel className="text-xs text-muted-foreground">Item</FieldLabel>
                                    <VirtualizedCombobox
                                        value={field.state.value ?? ""}
                                        onValueChange={(value) => {
                                            field.handleChange(value);
                                            field.handleBlur();
                                        }}
                                        options={MINECRAFT_ITEM_OPTIONS}
                                        placeholder="Select item..."
                                        searchPlaceholder="Search items..."
                                        allowCustom={true}
                                        aria-invalid={isInvalid}
                                        className={cn(isInvalid && "ring-2 ring-destructive")}
                                    />
                                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                </Field>
                            );
                        }}
                    />

                    <div className="flex gap-2">
                        <form.AppField
                            name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].count`}
                            children={(field) => {
                                const submitted = form.state.submissionAttempts > 0;
                                const isInvalid = (field.state.meta.isTouched || submitted) && !field.state.meta.isValid;
                                return (
                                    <Field className="w-20">
                                        <FieldLabel className="text-xs text-muted-foreground">Count</FieldLabel>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={64}
                                            aria-invalid={isInvalid}
                                            value={field.state.value ?? ""}
                                            onBlur={field.handleBlur}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value === "" ? null : Number(e.target.value)
                                                )
                                            }
                                        />
                                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                    </Field>
                                );
                            }}
                        />

                        <form.AppField
                            name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].display_name`}
                            children={(field) => (
                                <Field className="flex-1">
                                    <FieldLabel className="text-xs text-muted-foreground">Display Name</FieldLabel>
                                    <Input
                                        value={field.state.value ?? ""}
                                        placeholder="Shows up in Quest UI"
                                        onChange={(e) =>
                                            field.handleChange(
                                                e.target.value === "" ? null : e.target.value
                                            )
                                        }
                                    />
                                </Field>
                            )}
                        />
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2">
                        <span className="text-section-label">
                            Item Metadata
                        </span>

                        <form.Subscribe
                            selector={(state) =>
                                state.values.objectives[objectiveIndex]?.rewards[rewardIndex]?.item_metadata
                            }
                            children={(itemMetadata) => (
                                <MetadataSelect
                                    value={itemMetadata ?? []}
                                    onChange={(next) =>
                                        form.setFieldValue(
                                            // @ts-ignore
                                            `objectives[${objectiveIndex}].rewards[${rewardIndex}].item_metadata`,
                                            next
                                        )
                                    }
                                    hasErrors={metadataErrors.length > 0}
                                />
                            )}
                        />

                        {metadataErrors.length > 0 && (
                            <FieldError errors={metadataErrors} />
                        )}
                    </div>
                </div>
            </RewardCard>
        );
    },
});
