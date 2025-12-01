import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function CommunityValuesStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const communityValues = useStore(form.store, (state) => state.values.community_values);

    return (
        <div className="space-y-6">
            <form.Field
                name="community_values"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I value respect, collaboration, and helping newer players. I think a good community should be welcoming and supportive..."
                                className="min-h-32 resize-none"
                                maxLength={500}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                What do you think makes a gaming community great?
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
                disabled={!communityValues || (communityValues?.length ?? 0) < 20}
            >
                Great perspective!
            </Button>
        </div>
    );
}
