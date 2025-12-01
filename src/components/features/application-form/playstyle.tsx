import { Field, FieldDescription, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StepProps } from "@/types/application-step";
import { useStore } from "@tanstack/react-form";

export function PlaystyleStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const playstyle = useStore(form.store, (state) => state.values.playstyle);

    return (
        <div className="space-y-6">
            <form.Field
                name="playstyle"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I love building medieval castles and exploring with friends! I'm also getting into redstone automation..."
                                className="min-h-32 resize-none"
                                maxLength={500}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                Building? Exploring? Redstone? PvP? Tell us what you enjoy most!
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
                disabled={!playstyle || (playstyle?.length ?? 0) < 10}
            >
                Sounds awesome!
            </Button>
        </div>
    );
}

export function BuildingExperienceStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const buildingExperience = useStore(form.store, (state) => state.values.building_experience);

    return (
        <div className="space-y-6">
            <form.Field
                name="building_experience"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I've built several medieval castles, modern skyscrapers, and I'm currently working on a massive city project. I love using different materials and architectural styles..."
                                className="min-h-32 resize-none"
                                maxLength={500}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                Tell us about your favorite builds, projects, or building styles!
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
                disabled={!buildingExperience || (buildingExperience?.length ?? 0) < 10}
            >
                Impressive builds!
            </Button>
        </div>
    );
}

export function RedstoneExperienceStep({ form, nextStep }: StepProps) {
    // @ts-ignore
    const redstoneExperience = useStore(form.store, (state) => state.values.redstone_experience);

    return (
        <div className="space-y-6">
            <form.Field
                name="redstone_experience"
                // @ts-ignore
                children={(field) => {
                    const isInvalid = !field.state.meta.isValid;

                    return (
                        <Field data-invalid={isInvalid}>
                            <Textarea
                                placeholder="I've built automatic farms, complex sorting systems, and even a working calculator! I love creating contraptions that solve problems and make life easier..."
                                className="min-h-32 resize-none"
                                maxLength={500}
                                value={field.state.value ?? ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                onBlur={field.handleBlur}
                                aria-invalid={isInvalid}
                            />
                            <FieldDescription className="text-center">
                                Share your coolest redstone creations or technical achievements!
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
                disabled={!redstoneExperience || (redstoneExperience?.length ?? 0) < 10}
            >
                Technical genius!
            </Button>
        </div>
    );
}
