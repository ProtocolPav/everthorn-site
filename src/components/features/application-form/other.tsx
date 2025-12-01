import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function OtherStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const other = useStore(form.store, (state) => state.values.other);

    return (
        <div className="space-y-6">
            <form.Field
                name="other"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I have a pet parrot that sometimes plays Minecraft with me, I'm learning to code, or I make Minecraft-themed art in my spare time..."
                                className="min-h-32 resize-none"
                                maxLength={900}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                Any fun facts, special skills, hobbies, or random thoughts? This is totally optional!
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
            >
                {other ? 'Awesome!' : 'All good, let\'s finish!'}
            </Button>
        </div>
    );
}
