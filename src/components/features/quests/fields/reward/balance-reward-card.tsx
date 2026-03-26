import { useState } from "react";
import { CoinsIcon, XIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldLabel } from "@/components/ui/field.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";

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
                    const label = val != null ? `${val}` : "Set amount";
                    const hint = val != null ? `Amount: ${val}` : "Click to set balance amount";

                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Card className="group/reward transition-all p-0 rounded-lg text-sm hover:bg-background/40">
                                    <CardContent className="p-2 gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <Button
                                                variant="invisible"
                                                size="sm"
                                                type="button"
                                                className="h-auto p-0 gap-1.5 justify-start text-left font-medium text-foreground hover:bg-transparent"
                                            >
                                                <CoinsIcon size={18} weight="fill" />
                                                <span>{option.display}</span>
                                                <span className="font-mono text-muted-foreground">{label}</span>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                type="button"
                                                className="text-muted-foreground hover:text-destructive"
                                                onClick={onRemove}
                                            >
                                                <XIcon size={14} />
                                            </Button>
                                        </div>

                                        <div className="text-muted-foreground font-mono text-xs leading-4">
                                            {hint}
                                        </div>
                                    </CardContent>
                                </Card>
                            </PopoverTrigger>

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
