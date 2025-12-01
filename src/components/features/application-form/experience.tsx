import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@tanstack/react-form";

export function ExperienceStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const experience = useStore(form.store, (state) => state.values.experience);

    return (
        <div className="space-y-6">
            <form.Field
                name="experience"
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
                                    <SelectValue placeholder="How long have you been playing?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="new">New to Minecraft (Less than 6 months)</SelectItem>
                                    <SelectItem value="beginner">Beginner (6 months - 1 year)</SelectItem>
                                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                                    <SelectItem value="experienced">Experienced (3-5 years)</SelectItem>
                                    <SelectItem value="veteran">Veteran (5+ years)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FieldDescription className="text-center">
                                Don't worry - we welcome players of all experience levels!
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
                disabled={!experience}
            >
                Perfect!
            </Button>
        </div>
    );
}

export function LeadershipExperienceStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const leadershipExperience = useStore(form.store, (state) => state.values.leadership_experience);

    return (
        <div className="space-y-6">
            <form.Field
                name="leadership_experience"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I love helping newer players get started! I've shown friends how to build cool redstone contraptions, helped coordinate some fun group projects, and I'm always happy to share tips and tricks I've learned..."
                                className="min-h-32 resize-none"
                                maxLength={500}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                Do you enjoy helping other players? Share any times you've lent a hand! 😊
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
                disabled={!leadershipExperience || (leadershipExperience?.length ?? 0) < 10}
            >
                Love helping others! 🤝
            </Button>
        </div>
    );
}
