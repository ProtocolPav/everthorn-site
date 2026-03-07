import { useState } from "react";
import {Field, FieldError, FieldLabel, FieldGroup} from "@/components/ui/field.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {useFieldContext} from "@/hooks/use-form-context.ts";
import {TimerCustomization} from "@/types/quests";
import {CustomizationCard} from "@/components/features/quests/fields/customization/customization-card.tsx";
import {CUSTOMIZATIONS} from "../../../../../config/objective-customization-options.ts";

export function TimerField() {
    const field = useFieldContext<TimerCustomization>()
    const [secondsValue, setSecondsValue] = useState(String(field.state.value?.seconds || 60));

    const isInvalid =
        field.state.meta.isTouched && !field.state.meta.isValid

    const s = field.state.value?.seconds || 60;
    const f = field.state.value?.fail;
    const hint = `Timer: ${s} seconds${f ? ' (fail)' : ''}`;

    return (
        <Field className="w-fit">
            <FieldLabel className="sr-only">Timer</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.timer.display}
                icon={CUSTOMIZATIONS.timer.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
            >
                <FieldGroup>
                    <Field>
                        <FieldLabel>Seconds</FieldLabel>
                         <Input
                             type="number"
                             min="1"
                             value={secondsValue}
                             onChange={(e) => setSecondsValue(e.target.value)}
                             onBlur={() => { const num = Math.max(1, parseInt(secondsValue) || 60); field.handleChange({ ...field.state.value, seconds: num }); setSecondsValue(String(num)); }}
                         />
                    </Field>
                    <Field orientation="horizontal">
                        <FieldLabel>Fail on timeout</FieldLabel>
                        <Checkbox
                            checked={field.state.value?.fail || false}
                            onCheckedChange={(checked) => field.handleChange({ ...field.state.value, fail: !!checked })}
                        />
                    </Field>
                </FieldGroup>
            </CustomizationCard>

            {isInvalid && (
                <FieldError errors={field.state.meta.errors} />
            )}
        </Field>
    )
}