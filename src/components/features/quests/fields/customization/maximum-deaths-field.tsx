import { Field, FieldError, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import { useFieldContext } from "@/hooks/use-form-context.ts";
import { MaximumDeathsCustomization } from "@/types/quests";
import { CustomizationCard } from "@/components/features/quests/fields/customization/customization-card.tsx";
import { CUSTOMIZATIONS } from "@/config/objective-customization-options.ts";
import {ArrowBendDoubleUpRightIcon, ProhibitIcon, SmileyXEyesIcon} from "@phosphor-icons/react";
import { FieldInfoTooltip } from "@/components/common/field-info-tooltip.tsx";

const label = "text-sm text-muted-foreground";

export function MaximumDeathsField() {
    const field = useFieldContext<MaximumDeathsCustomization>();

    const isInvalid = !field.state.meta.isValid;

    const d = field.state.value?.deaths ?? '?';
    const f = field.state.value?.fail;
    const hint = `max. ${d} deaths`;

    return (
        <Field className="w-fit" data-invalid={isInvalid}>
            <FieldLabel className="sr-only">Maximum Deaths</FieldLabel>

            <CustomizationCard
                title={CUSTOMIZATIONS.maximum_deaths.display}
                icon={CUSTOMIZATIONS.maximum_deaths.icon}
                hint={hint}
                onRemove={() => field.setValue(null as any)}
                warning={f}
                hasErrors={isInvalid}
            >
                <div className="flex flex-col gap-3">

                    {/* Header */}
                    <div className="flex items-center gap-2">
                        <SmileyXEyesIcon weight="fill" className="text-muted-foreground" />
                        <span className={label}>Don't die...</span>
                    </div>

                    {/* Deaths input */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className={label}>Die no more than</span>
                        <Input
                            type="number"
                            className="w-16"
                            value={field.state.value?.deaths ?? ''}
                            onChange={(e) =>
                                field.handleChange({
                                    ...field.state.value,
                                    deaths: e.target.value === '' ? (undefined as any) : parseInt(e.target.value),
                                })
                            }
                            data-invalid={isInvalid}
                            aria-invalid={isInvalid}
                        />
                        <span className={label}>times.</span>
                    </div>

                    {/* Consequence toggle */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5">
                            <span className={label}>Otherwise...</span>
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
                            <ToggleGroupItem value="fail" className="flex gap-2 text-xs data-[state=on]:text-amber-500 data-[state=on]:bg-amber-800/30">
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