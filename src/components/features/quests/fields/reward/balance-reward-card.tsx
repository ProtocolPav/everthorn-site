import { useState } from "react";
import { CoinsIcon, XIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Button } from "@/components/ui/button.tsx";
import { ButtonGroup } from "@/components/ui/button-group.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldLabel } from "@/components/ui/field.tsx";

export const BalanceRewardCard = withQuestForm({
    defaultValues: {} as QuestFormValues,
    props: {
        objectiveIndex: 0,
        rewardIndex: 0,
        onRemove: () => {},
    },

    render: function Render({ form, objectiveIndex, rewardIndex, onRemove }) {
        const option = REWARD_OPTIONS_MAP.balance;
        const [open, setOpen] = useState(false);

        return (
            <form.AppField
                name={`objectives[${objectiveIndex}].rewards[${rewardIndex}].balance`}
                children={(field) => {
                    const val = field.state.value;
                    const label = val != null && val !== "" ? `${val}` : "Set amount";

                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <ButtonGroup>
                                <PopoverTrigger asChild>
                                    <Button variant="secondary" size="sm" type="button" className="gap-1.5">
                                        <CoinsIcon size={14} weight="fill" />
                                        {option.display}
                                        <span className="text-muted-foreground font-mono">{label}</span>
                                    </Button>
                                </PopoverTrigger>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    type="button"
                                    className="px-1.5 text-muted-foreground hover:text-destructive"
                                    onClick={onRemove}
                                >
                                    <XIcon size={12} />
                                </Button>
                            </ButtonGroup>

                            <PopoverContent className="w-48 p-3" side="bottom" align="start">
                                <FieldLabel className="text-xs text-muted-foreground mb-1.5 block">Balance Amount</FieldLabel>
                                <Input
                                    autoFocus
                                    type="number"
                                    min={0}
                                    placeholder="e.g. 100"
                                    value={field.state.value ?? ""}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value === "" ? null : Number(e.target.value)
                                        )
                                    }
                                />
                            </PopoverContent>
                        </Popover>
                    );
                }}
            />
        );
    },
});
