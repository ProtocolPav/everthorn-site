import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { TimerCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/objective-customization-options.ts";
import { ArrowBendDoubleUpRightIcon, ProhibitIcon, HourglassIcon } from "@phosphor-icons/react";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";

const label = "text-sm text-muted-foreground";

function toHMS(totalSeconds: number) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return { h, m, s };
}

function formatHint(totalSeconds: number | undefined): string {
    if (totalSeconds === undefined) return '?';
    const { h, m, s } = toHMS(totalSeconds);
    const parts = [];
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    if (s || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}

export function TimerField() {
    const field = useFieldContext<TimerCustomization>();

    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

    const total = field.state.value?.seconds;
    const f = field.state.value?.fail;
    const { h, m, s } = total !== undefined ? toHMS(total) : { h: 0, m: 0, s: 0 };
    const hint = `Complete within ${formatHint(total)}`;

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
                warning={f}
            >
                <div className="flex flex-col gap-3">

                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <HourglassIcon weight="fill" className="text-muted-foreground" />
                        <span className={label}>Complete within...</span>
                    </div>

                    {/* H/M/S inputs */}
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
                        <span className={label}>h</span>
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
                        <span className={label}>m</span>
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
                        <span className={label}>s</span>
                    </div>

                    {/* Consequence toggle */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className={label}>On timeout...</span>
                            <FieldInfoTooltip>
                                Skip: moves to the next objective. Fail: the entire quest ends.
                            </FieldInfoTooltip>
                        </div>
                        <ToggleGroup
                            variant="outline"
                            size="sm"
                            type="single"
                            value={f ? 'fail' : 'skip'}
                            onValueChange={(val) => {
                                if (!val) return;
                                field.handleChange({ ...field.state.value, fail: val === 'fail' });
                            }}
                            className="w-full"
                        >
                            <ToggleGroupItem value="skip" className="flex gap-2 text-xs">
                                <ArrowBendDoubleUpRightIcon size={14} />
                                Skip objective
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="fail"
                                className="flex gap-2 text-xs data-[state=on]:text-amber-500 data-[state=on]:bg-amber-800/30"
                            >
                                <ProhibitIcon size={14} />
                                Fail entire quest
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
            </CustomizationCard>
        </Field>
    );
}