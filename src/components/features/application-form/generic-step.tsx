// components/features/application-form/generic-step.tsx
import { Button } from "@/components/ui/button";
import { StepProps, StepType } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";
import { FieldRenderer } from "./field-renderer";
import { WelcomeStep } from "./welcome";
import { SubmitStep } from "./submit";
import { ArrowRight } from "lucide-react";

interface GenericStepProps extends StepProps {
    step: StepType;
}

export function GenericStep({ step, form, nextStep, session, submitted }: GenericStepProps) {
    // Special cases
    if (step.type === 'welcome') {
        return <WelcomeStep form={form} nextStep={nextStep} session={session} submitted={submitted} />;
    }

    if (step.type === 'submit') {
        return <SubmitStep form={form} nextStep={nextStep} session={session} submitted={submitted} />;
    }

    // Get field value for button state
    const fieldValue = useStore(form.store, (state) =>
        // @ts-ignore
        step.field ? state.values[step.field] : true
    );

    const isDisabled = step.optional ? false :
        step.minLength ? (!fieldValue || (fieldValue?.length ?? 0) < step.minLength) :
            !fieldValue;

    return (
        <div className="space-y-3">
            <FieldRenderer step={step} form={form} />

            {/* Continue Button */}
            <Button
                type="button"
                onClick={nextStep}
                disabled={isDisabled}
                className="w-full h-10 group shadow-sm disabled:opacity-50 transition-all"
            >
                <span className="flex items-center justify-center gap-2 text-sm font-medium">
                    {step.optional && isDisabled ? "Skip" : "Continue"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
            </Button>
        </div>
    );
}
