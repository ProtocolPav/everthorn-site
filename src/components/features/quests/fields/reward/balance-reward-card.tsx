import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { RewardCard } from "@/components/features/quests/fields/reward/reward-card.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";

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
                    const hint = field.state.value
                        ? `Balance: ${field.state.value}`
                        : "Set balance amount";

                    return (
                        <RewardCard
                            title={option.display}
                            icon={option.icon}
                            hint={hint}
                            onRemove={onRemove}
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Field className="flex-1">
                                        <FieldLabel className="sr-only">Balance Amount</FieldLabel>
                                        <Input
                                            type="number"
                                            min={0}
                                            placeholder="Amount..."
                                            value={field.state.value ?? ""}
                                            onChange={(e) =>
                                                field.handleChange(
                                                    e.target.value === "" ? null : Number(e.target.value)
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                            </div>
                        </RewardCard>
                    );
                }}
            />
        );
    },
});
