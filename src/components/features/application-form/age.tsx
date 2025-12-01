import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function AgeStep({ form, nextStep }: StepProps) {
    // Watch age value for button state
    // @ts-ignore
    const age = useStore(form.store, (state) => state.values.age);

    return (
        <div className="space-y-6">
            <form.Field
                name="age"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Input
                                id="application-age"
                                name={field.name}
                                placeholder="Enter your age"
                                type="number"
                                className="text-center text-lg h-12 md:h-14"
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                We care about your privacy. This stays between you and our staff members
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
                disabled={!age}
            >
                Continue
            </Button>
        </div>
    );
}
