import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { XIcon, CoinsIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button.tsx";

export const BalanceRewardCard = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        rewardIndex: 0,
        onRemove: () => {},
    },

    render: function Render({ form, objectiveIndex, rewardIndex, onRemove }) {
        const option = REWARD_OPTIONS_MAP.balance;

        return (
            <form.AppField
                name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].balance`}
                children={(field) => {
                    return (
                        <Card className="group/reward transition-all p-0 rounded-lg text-sm hover:bg-background/40">
                            <CardContent className="p-2 gap-1">
                                <div className="flex justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <CoinsIcon size={18} weight="fill" />
                                        {option.display}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={onRemove}
                                        type="button"
                                    >
                                        <XIcon size={14} />
                                    </Button>
                                </div>
                                <Input
                                    type="number"
                                    min={0}
                                    className="mt-1"
                                    placeholder="Amount..."
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value === "" ? null : Number(e.target.value)
                                        )
                                    }
                                />
                            </CardContent>
                        </Card>
                    );
                }}
            />
        );
    },
});
