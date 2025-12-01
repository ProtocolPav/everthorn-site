import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function HeardFromStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const heardFrom = useStore(form.store, (state) => state.values.heard_from);

    return (
        <div className="space-y-6">
            <form.Field
                name="heard_from"
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
                                    <SelectValue placeholder="How did you find us?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="friends">My Friends</SelectItem>
                                    <SelectItem value="reddit">Reddit Advertisement</SelectItem>
                                    <SelectItem value="website">I found your website</SelectItem>
                                    <SelectItem value="youtube">YouTube</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-center">
                                Just curious how you discovered our little corner of the internet!
                            </FieldDescription>
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                    );
                }}
            />

            {/* Follow-up question for specific sources */}
            {(heardFrom === 'friends' || heardFrom === 'other') && (
                <form.Field
                    name="heard_from_details"
                    // @ts-ignore
                    children={(field) => {
                        const isInvalid = !field.state.meta.isValid;

                        return (
                            <Field data-invalid={isInvalid}>
                                <Textarea
                                    placeholder={
                                        heardFrom === 'friends'
                                            ? "Which friend told you about us? We'd love to thank them!"
                                            : "Tell us more about how you found us!"
                                    }
                                    className="min-h-20 resize-none"
                                    maxLength={200}
                                    value={field.state.value ?? ''}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    aria-invalid={isInvalid}
                                />
                                <FieldDescription className="text-center">
                                    {heardFrom === 'friends'
                                        ? "We love hearing about our community spreading through friends!"
                                        : "We're always curious about new discovery paths!"
                                    }
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                        );
                    }}
                />
            )}

            <div className="space-y-3">
                <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full"
                    size="lg"
                    disabled={!heardFrom}
                >
                    Cool!
                </Button>

                <div className="flex justify-center">
                    <Button
                        type="button"
                        variant="link"
                        onClick={nextStep}
                        className="text-muted-foreground hover:text-foreground text-sm"
                    >
                        I'll skip this one
                    </Button>
                </div>
            </div>
        </div>
    );
}
