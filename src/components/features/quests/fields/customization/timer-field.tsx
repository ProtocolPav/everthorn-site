import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { TimerCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "../../../../../config/objective-customization-options.ts";

export function TimerField() {
    const field = useFieldContext<TimerCustomization>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const s = field.state.value?.seconds ?? '?';
    const f = field.state.value?.fail;
    const hint = `Timer: ${s} seconds${f ? ' (fail)' : ''}`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Timer</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.timer.display}
                icon={CUSTOMIZATIONS.timer.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center flex-wrap gap-2 text-base">
                        <span>Player has</span>
                        <Input
                            type="number"
                            value={field.state.value?.seconds ?? ''}
                            onChange={(e) =>
                                field.handleChange({
                                    ...field.state.value,
                                    seconds: e.target.value === '' ? (undefined as any) : parseInt(e.target.value),
                                })
                            }
                            className="w-20 border-b-2 border-x-0 border-t-0 bg-transparent rounded-none px-1 text-center font-bold focus-visible:ring-0 focus-visible:border-primary shadow-none data-[invalid=true]:border-destructive"
                            data-invalid={isInvalid}
                            aria-invalid={isInvalid}
                        />
                        <span>seconds to complete this task.</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Checkbox
                            id="timer-fail"
                            checked={field.state.value?.fail || false}
                            onCheckedChange={(checked) =>
                                field.handleChange({ ...field.state.value, fail: !!checked })
                            }
                        />
                        <label htmlFor="timer-fail" className="cursor-pointer">Fail quest on timeout.</label>
                    </div>
                </div>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </CustomizationCard>
        </Field>
    );
}
