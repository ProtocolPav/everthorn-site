import { useState } from "react";
import { CoinsIcon, XIcon } from "@phosphor-icons/react";
import { withQuestForm } from "@/components/features/quests/quest-form.ts";
import { QuestFormValues } from "@/lib/schemas/quest-form.tsx";
import { REWARD_OPTIONS_MAP } from "@/config/objective-reward-options.ts";
import { Button } from "@/components/ui/button.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FieldLabel, FieldError } from "@/components/ui/field.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";

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

                    const submitted = form.state.submissionAttempts > 0;
                    const isInvalid = (field.state.meta.isTouched || submitted) && !field.state.meta.isValid;

                    return (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Card className={cn(
                                    "group/reward transition-all p-0 rounded-lg text-sm hover:bg-background/40",
                                    isInvalid && "border-destructive"
                                )}>
                                    <CardContent className="p-2 gap-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <CoinsIcon size={16} weight="fill" />
                                            <span>{option.display}</span>
                                            <span className="text-muted-foreground">{label}</span>
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

                                        <div className="text-hint">
                                            {hint}
                                        </div>
                                    </CardContent>
                                </Card>
                            </PopoverTrigger>

                            <PopoverContent className="w-56 p-3" side="bottom" align="start">
                                <FieldLabel className="text-xs text-muted-foreground mb-1.5 block">Balance Amount</FieldLabel>
                                <Input
                                    autoFocus
                                    type="number"
                                    min={1}
                                    placeholder="e.g. 100"
                                    aria-invalid={isInvalid}
                                    value={field.state.value ?? ""}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(
                                            e.target.value === "" ? null : Number(e.target.value)
                                        )
                                    }
                                />
                                {isInvalid && (
                                    <FieldError className="mt-1.5" errors={field.state.meta.errors} />
                                )}
                            </PopoverContent>
                        </Popover>
                    );
                }}
            />
        );
    },
});
