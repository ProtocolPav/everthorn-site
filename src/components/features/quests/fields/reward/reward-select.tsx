import { PlusIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useStore } from "@tanstack/react-form";
import { REWARD_OPTIONS, REWARD_OPTIONS_MAP, RewardKind } from "@/config/objective-reward-options.ts";

export const RewardSelect = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: { objectiveIndex: 0 },

    render: function Render({ form, objectiveIndex }) {
        const rewards = useStore(form.store, (state) => {
            return state.values.objectives[objectiveIndex]?.rewards ?? [];
        });

        const hasBalance = rewards.some((r) => r.balance != null);
        const availableOptions = REWARD_OPTIONS.filter((opt) => {
            if (opt.reward_kind === "balance" && hasBalance) return false;
            return true;
        });

        if (availableOptions.length === 0) return null;

        function addReward(kind: RewardKind) {
            const option = REWARD_OPTIONS_MAP[kind];
            const currentRewards = form.state.values.objectives[objectiveIndex]?.rewards ?? [];
            form.setFieldValue(
                // @ts-ignore
                `objectives[${objectiveIndex}].rewards`,
                [...currentRewards, { ...option.defaultValue }]
            );
        }

        return (
            <Dialog>
                <DialogTrigger asChild>
                    <Card className="flex transition-all bg-background/20 hover:bg-background/50 p-0 rounded-lg text-sm justify-center">
                        <CardContent className="p-2 gap-1">
                            <div className="flex items-center gap-1 h-8">
                                <PlusIcon size={18} weight="bold" />
                                Add Reward
                            </div>
                            <div className="text-muted-foreground font-mono">
                                {availableOptions.length} Available
                            </div>
                        </CardContent>
                    </Card>
                </DialogTrigger>

                <DialogContent className="gap-3 p-2.5">
                    <DialogTitle>Add Reward</DialogTitle>

                    <div className="flex flex-wrap gap-1.5">
                        {availableOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <Button
                                    key={option.reward_kind}
                                    variant="outline"
                                    size="sm"
                                    className="gap-1.5"
                                    onClick={() => addReward(option.reward_kind)}
                                >
                                    <Icon size={14} />
                                    {option.display}
                                </Button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        );
    },
});
