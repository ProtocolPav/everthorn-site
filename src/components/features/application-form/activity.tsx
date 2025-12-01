import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function ActivityStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const activity = useStore(form.store, (state) => state.values.activity);

    return (
        <div className="space-y-6">
            <form.Field
                name="activity"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Select
                                value={field.state.value}
                                onValueChange={field.handleChange}
                            >
                                <SelectTrigger
                                    className="h-12 md:h-14 w-full"
                                    aria-invalid={isInvalid}
                                >
                                    <SelectValue placeholder="Choose your activity level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Daily (Most days of the week)</SelectItem>
                                    <SelectItem value="frequent">Frequent (3-4 times per week)</SelectItem>
                                    <SelectItem value="regular">Regular (1-2 times per week)</SelectItem>
                                    <SelectItem value="casual">Casual (Few times per month)</SelectItem>
                                    <SelectItem value="weekends">Weekends only</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-center">
                                Be honest! We understand everyone has different schedules
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
                disabled={!activity}
            >
                Perfect!
            </Button>
        </div>
    );
}
