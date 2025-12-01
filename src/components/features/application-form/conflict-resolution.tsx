import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function ConflictResolutionStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const conflictResolution = useStore(form.store, (state) => state.values.conflict_resolution);

    return (
        <div className="space-y-6">
            <form.Field
                name="conflict_resolution"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I try to listen to both sides, stay calm, and find a solution that works for everyone. If needed, I'd ask a staff member for help..."
                                className="min-h-32 resize-none"
                                maxLength={400}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                How would you handle a disagreement with another player?
                            </FieldDescription>
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                    );
                }}
            />

            <Button
                type="button"
                onClick={nextStep}
                className="w-full"
                size="lg"
                disabled={!conflictResolution || (conflictResolution?.length ?? 0) < 15}
            >
                Great approach!
            </Button>
        </div>
    );
}
