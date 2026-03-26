import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { RewardSelect } from "@/components/features/quests/fields/reward/reward-select.tsx";
import { BalanceRewardCard } from "@/components/features/quests/fields/reward/balance-reward-card.tsx";
import { ItemRewardCard } from "@/components/features/quests/fields/reward/item-reward-card.tsx";

export const RewardList = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
    },

    render: function Render({ form, objectiveIndex }) {
        return (
            <div className="flex flex-wrap gap-2">
                <form.AppField
                    mode="array"
                    name={`objectives[${objectiveIndex}].rewards`}
                >
                    {(field) => (
                        <>
                            {field.state.value?.map((reward, rewardIndex) => {
                                const isBalance = reward.balance != null;

                                if (isBalance) {
                                    return (
                                        <BalanceRewardCard
                                            key={`balance-${rewardIndex}`}
                                            form={form}
                                            objectiveIndex={objectiveIndex}
                                            rewardIndex={rewardIndex}
                                            onRemove={() => field.removeValue(rewardIndex)}
                                        />
                                    );
                                }

                                return (
                                    <ItemRewardCard
                                        key={`item-${rewardIndex}`}
                                        form={form}
                                        objectiveIndex={objectiveIndex}
                                        rewardIndex={rewardIndex}
                                        onRemove={() => field.removeValue(rewardIndex)}
                                    />
                                );
                            })}

                            <RewardSelect form={form} objectiveIndex={objectiveIndex} />
                        </>
                    )}
                </form.AppField>
            </div>
        );
    },
});
