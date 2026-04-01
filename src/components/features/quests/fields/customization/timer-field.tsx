import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { TimerCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/quests/customization-options.ts";
import { HourglassIcon } from "@phosphor-icons/react";
import { useFieldValidity } from "@/hooks/use-field-validity.ts";
import { decomposeDuration, formatDuration } from "@/lib/format.ts";
import { ConsequenceToggle } from "@/components/features/quests/fields/customization/consequence-toggle.tsx";

export function TimerField() {
    const field = useFieldContext<TimerCustomization>();
    const { isInvalid } = useFieldValidity();

    const total = field.state.value?.seconds;
    const fail = field.state.value?.fail;
    const { h, m, s } = total !== undefined ? decomposeDuration(total) : { h: 0, m: 0, s: 0 };
    const hint = total !== undefined ? `Complete within ${formatDuration(total)}` : 'Complete within ?';

    function handleTimeChange(hours: number, minutes: number, seconds: number) {
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;
        field.handleChange({ ...field.state.value, seconds: totalSeconds });
    }

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Timer</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.timer.display}
                icon={CUSTOMIZATIONS.timer.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
                warning={fail}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <HourglassIcon weight="fill" className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Complete within...</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Input
                            type="number" min={0}
                            className="w-16 text-center"
                            placeholder="0"
                            value={h || ''}
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            onChange={(e) => handleTimeChange(
                                e.target.value === '' ? 0 : parseInt(e.target.value),
                                m, s
                            )}
                        />
                        <span className="text-sm text-muted-foreground">h</span>
                        <Input
                            type="number" min={0} max={59}
                            className="w-16 text-center"
                            placeholder="0"
                            value={m || ''}
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            onChange={(e) => handleTimeChange(
                                h,
                                e.target.value === '' ? 0 : parseInt(e.target.value),
                                s
                            )}
                        />
                        <span className="text-sm text-muted-foreground">m</span>
                        <Input
                            type="number" min={0} max={59}
                            className="w-16 text-center"
                            placeholder="0"
                            value={s || ''}
                            data-invalid={isInvalid} aria-invalid={isInvalid}
                            onChange={(e) => handleTimeChange(
                                h, m,
                                e.target.value === '' ? 0 : parseInt(e.target.value),
                            )}
                        />
                        <span className="text-sm text-muted-foreground">s</span>
                    </div>

                    <ConsequenceToggle
                        value={fail ?? false}
                        onChange={(fail) => field.handleChange({ ...field.state.value, fail })}
                        label="On timeout..."
                    />

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}
