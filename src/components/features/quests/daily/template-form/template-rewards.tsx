import { useState } from "react";
import { CoinsIcon, GiftIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { RewardCard } from "@/components/features/quests/fields/reward/reward-card.tsx";
import { MetadataSelect } from "@/components/features/quests/fields/reward/metadata-select.tsx";
import { RandomCountInput } from "@/components/features/quests/daily/template-form/random-count-input.tsx";
import { withTemplateForm } from "@/components/features/quests/daily/template-form/template-form.ts";
import { formatNamespacedId, MINECRAFT_ITEM_OPTIONS } from "@/config/minecraft-options.ts";
import { formatRandomCount } from "@/lib/random-count.ts";
import { fieldMetaHasErrors } from "@/lib/form-utils.ts";
import { cn } from "@/lib/utils.ts";
import type { DailyTemplateFormValues, RewardOptionFormValues } from "@/lib/schemas/daily-template-form.tsx";
import type { RandomCount } from "@/api/nexuscore/model";
import type { RewardMetadata } from "@/types/quests";

function RewardOptionEditor({
    reward,
    onChange,
}: {
    reward: RewardOptionFormValues;
    onChange: (reward: RewardOptionFormValues) => void;
}) {
    if (reward.balance != null) {
        return (
            <div className="flex flex-col gap-1.5">
                <FieldLabel className="text-xs text-muted-foreground">Nugs</FieldLabel>
                <RandomCountInput
                    value={reward.balance}
                    onChange={(balance) => onChange({ ...reward, balance: balance ?? { min: 0, max: 0 } })}
                    minimum={0}
                    placeholder="50-100"
                    aria-label="Nugs"
                    className="w-32"
                />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <Field>
                <FieldLabel className="text-xs text-muted-foreground">Item</FieldLabel>
                <VirtualizedCombobox
                    value={reward.item ?? ""}
                    onValueChange={(item) => onChange({ ...reward, item: item || null })}
                    options={MINECRAFT_ITEM_OPTIONS}
                    placeholder="Select item..."
                    searchPlaceholder="Search items..."
                    allowCustom={true}
                    className={cn(!reward.item && "ring-2 ring-destructive")}
                />
            </Field>
            <div className="flex gap-2">
                <Field className="w-fit">
                    <FieldLabel className="text-xs text-muted-foreground">Count</FieldLabel>
                    <RandomCountInput
                        value={reward.count}
                        onChange={(count) => onChange({ ...reward, count: count as RandomCount | null })}
                        invalid={reward.count == null}
                        placeholder="1-3"
                        aria-label="Item count"
                    />
                </Field>
                <Field className="flex-1">
                    <FieldLabel className="text-xs text-muted-foreground">Display Name</FieldLabel>
                    <Input
                        value={reward.display_name ?? ""}
                        placeholder="Shows up in Quest UI"
                        onChange={(e) => onChange({ ...reward, display_name: e.target.value === "" ? null : e.target.value })}
                    />
                </Field>
            </div>
            <Separator />
            <div className="flex flex-col gap-2">
                <span className="text-section-label">Item Metadata</span>
                <MetadataSelect
                    value={(reward.item_metadata ?? []) as RewardMetadata[]}
                    onChange={(next) => onChange({ ...reward, item_metadata: next as RewardOptionFormValues["item_metadata"] })}
                />
            </div>
        </div>
    );
}

function rewardTitle(reward: RewardOptionFormValues): string {
    if (reward.balance != null) return "Nugs";
    if (reward.display_name) return reward.display_name;
    return reward.item ? formatNamespacedId(reward.item) : "Item";
}

function rewardHint(reward: RewardOptionFormValues): string {
    if (reward.balance != null) return `Amount: ${formatRandomCount(reward.balance)}`;
    if (!reward.item) return "Click to pick an item";
    if (!reward.count) return "Click to set a count";
    const metadata = reward.item_metadata?.length ?? 0;
    return `Count: ${formatRandomCount(reward.count)}${metadata ? ` · ${metadata} metadata` : ""}`;
}

/**
 * Reward options for a template, as the quest editor's reward cards with
 * RandomCount amounts, plus how many of them a roll gives (reward_picks).
 */
export const TemplateRewards = withTemplateForm({
    defaultValues: {} as DailyTemplateFormValues,
    props: {},
    render: function Render({ form }) {
        const [addOpen, setAddOpen] = useState(false);

        function add(reward: RewardOptionFormValues) {
            form.setFieldValue("rewards", [...form.getFieldValue("rewards"), reward]);
            setAddOpen(false);
        }

        return (
            <form.Subscribe
                selector={(state) => ({
                    rewards: state.values.rewards,
                    fieldMeta: state.fieldMeta,
                    submitted: state.submissionAttempts > 0,
                })}
                children={({ rewards, fieldMeta, submitted }) => (
                    <>
                        <div className="text-section-label flex gap-1.5 items-center">
                            Rewards
                            <FieldInfoTooltip>
                                Reward options. Each roll gives a random selection of them, as many as “give” says.
                            </FieldInfoTooltip>
                            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm" type="button" className="w-fit text-muted-foreground">
                                        <PlusIcon />
                                        Add
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="gap-3 p-2.5">
                                    <DialogTitle>Add Reward</DialogTitle>
                                    <DialogDescription className="sr-only">Add a balance or item reward option.</DialogDescription>
                                    <div className="flex gap-1.5">
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5"
                                                onClick={() => add({ balance: { min: 50, max: 100 }, item_metadata: [] })}
                                            >
                                                <CoinsIcon size={14} />
                                                Balance
                                            </Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-1.5"
                                                onClick={() => add({ item: null, count: { choices: [1] }, display_name: null, item_metadata: [] })}
                                            >
                                                <GiftIcon size={14} />
                                                Item
                                            </Button>
                                        </DialogClose>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            {rewards.length > 0 && (
                                <form.AppField
                                    name="reward_picks"
                                    children={(field) => (
                                        <span className="flex items-center gap-1.5 normal-case tracking-normal font-normal text-xs">
                                            give
                                            <Input
                                                type="number"
                                                min={0}
                                                aria-label="Rewards given per roll"
                                                className={cn("h-6 w-12 px-1.5 text-center text-xs", !field.state.meta.isValid && "ring-2 ring-destructive")}
                                                value={field.state.value ?? ""}
                                                onBlur={field.handleBlur}
                                                onChange={(e) =>
                                                    field.handleChange(e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value))
                                                }
                                            />
                                            of {rewards.length}
                                        </span>
                                    )}
                                />
                            )}
                            <Separator className="flex-1" />
                        </div>

                        {rewards.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                                {rewards.map((reward, index) => (
                                    <RewardCard
                                        key={index}
                                        title={rewardTitle(reward)}
                                        icon={reward.balance != null ? CoinsIcon : GiftIcon}
                                        hint={rewardHint(reward)}
                                        hasErrors={
                                            (submitted || reward.item != null) &&
                                            fieldMetaHasErrors(fieldMeta as Parameters<typeof fieldMetaHasErrors>[0], `rewards[${index}]`)
                                        }
                                        onRemove={() => form.setFieldValue("rewards", rewards.filter((_, i) => i !== index))}
                                    >
                                        <RewardOptionEditor
                                            reward={reward}
                                            onChange={(next) => form.setFieldValue("rewards", rewards.map((r, i) => (i === index ? next : r)))}
                                        />
                                    </RewardCard>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-muted-foreground/50 italic">
                                No rewards. Add balance or item options to give players something.
                            </p>
                        )}
                    </>
                )}
            />
        );
    },
});
