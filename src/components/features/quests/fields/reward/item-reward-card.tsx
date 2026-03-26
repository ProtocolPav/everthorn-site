import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues, RewardFormValues } from "@/lib/schemas/quest-form.tsx";
import { RewardCard } from "@/components/features/quests/fields/reward/reward-card.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { MINECRAFT_ITEM_OPTIONS, formatNamespacedId } from "@/config/minecraft-options.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { MetadataSelect } from "@/components/features/quests/fields/reward/metadata-select.tsx";
import { useStore } from "@tanstack/react-form";
import { Badge } from "@/components/ui/badge.tsx";
import { GiftIcon } from "@phosphor-icons/react";

const textures = await import(`minecraft-textures/dist/textures/json/1.21.11.id.json`);

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

        const itemId = reward?.item;
        const count = reward?.count ?? 1;
        const displayName = reward?.display_name;
        const metadataCount = reward?.item_metadata?.length ?? 0;

        // Build tooltip hint
        const hintParts: string[] = [];
        if (itemId) hintParts.push(itemId);
        if (count > 1) hintParts.push(`x${count}`);
        if (displayName) hintParts.push(`"${displayName}"`);
        if (metadataCount > 0) hintParts.push(`${metadataCount} metadata`);
        const hint = hintParts.length > 0 ? hintParts.join(" · ") : "Configure item";

        // Build button label content
        // @ts-ignore
        const textureUrl = itemId ? textures.items[itemId]?.texture : null;
        const labelText = displayName || (itemId ? formatNamespacedId(itemId) : null);

        // Title shown in button
        const buttonContent = (
            <>
                {textureUrl
                    ? <img src={textureUrl} alt="" className="size-4 pixelated" />
                    : <GiftIcon size={14} weight="fill" />
                }
                <span>{labelText ?? "Item"}</span>
                {count > 1 && (
                    <Badge variant="secondary" className="px-1 py-0 text-[10px] font-mono h-4">
                        ×{count}
                    </Badge>
                )}
                {metadataCount > 0 && (
                    <Badge variant="outline" className="px-1 py-0 text-[10px] font-mono h-4">
                        {metadataCount}
                    </Badge>
                )}
            </>
        );

        return (
            <RewardCard
                title="Item"
                icon={option.icon}
                hint={hint}
                onRemove={onRemove}
                buttonContent={buttonContent}
            >
                <div className="flex flex-col gap-3">
                    <form.AppField
                        name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].item`}
                        children={(field) => (
                            <Field>
                                <FieldLabel className="text-xs text-muted-foreground">Item</FieldLabel>
                                <VirtualizedCombobox
                                    value={field.state.value ?? ""}
                                    onValueChange={(value) => field.handleChange(value)}
                                    options={MINECRAFT_ITEM_OPTIONS}
                                    placeholder="Select item..."
                                    searchPlaceholder="Search items..."
                                    allowCustom={true}
                                />
                            </Field>
                        )}
                    />

                    <div className="flex gap-2">
                        <form.AppField
                            name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].count`}
                            children={(field) => (
                                <Field className="w-20">
                                    <FieldLabel className="text-xs text-muted-foreground">Count</FieldLabel>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={64}
                                        value={field.state.value ?? ""}
                                        onChange={(e) =>
                                            field.handleChange(
                                                e.target.value === "" ? null : Number(e.target.value)
                                            )
                                        }
                                    />
                                </Field>
                            )}
                        />

                        <form.AppField
                            name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].display_name`}
                            children={(field) => (
                                <Field className="flex-1">
                                    <FieldLabel className="text-xs text-muted-foreground">Display Name</FieldLabel>
                                    <Input
                                        value={field.state.value ?? ""}
                                        placeholder="Custom display name..."
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
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                                />
                            )}
                        />
                    </div>
                </div>
            </RewardCard>
        );
    },
});
