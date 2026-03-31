import { useState } from "react";
import { CoinsIcon, PlusIcon, GiftIcon, XIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues, RewardFormValues } from "@/lib/schemas/quest-form.tsx";
import {
    Dialog,
    DialogContent,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { VirtualizedCombobox } from "@/components/common/virtualized-combobox.tsx";
import { MINECRAFT_ITEM_OPTIONS } from "@/config/minecraft-options.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { MetadataSelect } from "@/components/features/quests/fields/reward/metadata-select.tsx";
import { useStore } from "@tanstack/react-form";
import { REWARD_OPTIONS_MAP } from "@/config/quests/reward-options.ts";
import { RewardMetadata } from "@/types/quests";

export const RewardSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: { objectiveIndex: 0 },

    render: function Render({ form, objectiveIndex }) {
        const hasBalance = useStore(form.store, (state) => {
            return (state.values.objectives[objectiveIndex]?.rewards ?? []).some((r) => r.balance != null);
        });

        const [itemDialogOpen, setItemDialogOpen] = useState(false);
        const [rewardTypeDialogOpen, setRewardTypeDialogOpen] = useState(false);
        const [itemForm, setItemForm] = useState<RewardFormValues>({ ...REWARD_OPTIONS_MAP.item.defaultValue });

        function addBalance() {
            const currentRewards = form.state.values.objectives[objectiveIndex]?.rewards ?? [];
            form.setFieldValue(
                `objectives[${objectiveIndex}].rewards` as never,
                [...currentRewards, { ...REWARD_OPTIONS_MAP.balance.defaultValue }]
            );
            setRewardTypeDialogOpen(false)
        }

        function openItemDialog() {
            setItemForm({ ...REWARD_OPTIONS_MAP.item.defaultValue });
            setItemDialogOpen(true);
            setRewardTypeDialogOpen(false)
        }

        function confirmItem() {
            const currentRewards = form.state.values.objectives[objectiveIndex]?.rewards ?? [];
            form.setFieldValue(
                `objectives[${objectiveIndex}].rewards` as never,
                [...currentRewards, { ...itemForm }]
            );
            setItemDialogOpen(false);
        }

        return (
            <>
                <Dialog open={rewardTypeDialogOpen} onOpenChange={setRewardTypeDialogOpen}>
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="w-fit text-muted-foreground"
                        onClick={() => !hasBalance ? setRewardTypeDialogOpen(true) : openItemDialog()}
                    >
                        <PlusIcon />
                        Add
                    </Button>

                    <DialogContent className="gap-3 p-2.5">
                        <DialogTitle>Add Reward</DialogTitle>

                        <div className="flex gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={addBalance}
                            >
                                <CoinsIcon size={14} />
                                Balance
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                                onClick={openItemDialog}
                            >
                                <GiftIcon size={14} />
                                Item
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                    <DialogContent showCloseButton={false} className="p-2 sm:max-w-md scroll-auto!">
                        <DialogTitle className="sr-only">Add Item Reward</DialogTitle>
                        <div className="space-y-3">
                            <Field>
                                <FieldLabel className="text-xs text-muted-foreground">Item</FieldLabel>
                                <VirtualizedCombobox
                                    value={itemForm.item ?? ""}
                                    onValueChange={(value) => setItemForm((prev) => ({ ...prev, item: value }))}
                                    options={MINECRAFT_ITEM_OPTIONS}
                                    placeholder="Select item..."
                                    searchPlaceholder="Search items..."
                                    allowCustom={true}
                                />
                            </Field>

                            <div className="flex gap-2">
                                <Field className="w-20">
                                    <FieldLabel className="text-xs text-muted-foreground">Count</FieldLabel>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={64}
                                        value={itemForm.count ?? ""}
                                        onChange={(e) =>
                                            setItemForm((prev) => ({
                                                ...prev,
                                                count: e.target.value === "" ? null : Number(e.target.value),
                                            }))
                                        }
                                    />
                                </Field>

                                <Field className="flex-1">
                                    <FieldLabel className="text-xs text-muted-foreground">Display Name</FieldLabel>
                                    <Input
                                        value={itemForm.display_name ?? ""}
                                        placeholder="Custom display name..."
                                        onChange={(e) =>
                                            setItemForm((prev) => ({
                                                ...prev,
                                                display_name: e.target.value === "" ? null : e.target.value,
                                            }))
                                        }
                                    />
                                </Field>
                            </div>

                            <Separator />

                            <div className="flex flex-col gap-2">
                                <span className="text-section-label">
                                    Item Metadata
                                </span>
                                <MetadataSelect
                                    value={itemForm.item_metadata}
                                    onChange={(next: RewardMetadata[]) =>
                                        setItemForm((prev) => ({ ...prev, item_metadata: next }))
                                    }
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <Button variant="ghost" size="sm" type="button" onClick={() => setItemDialogOpen(false)}>
                                    <XIcon size={14} />
                                    Cancel
                                </Button>
                                <Button variant="default" size="sm" type="button" onClick={confirmItem}>
                                    <PlusIcon size={14} />
                                    Add Item
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </>
        );
    },
});
