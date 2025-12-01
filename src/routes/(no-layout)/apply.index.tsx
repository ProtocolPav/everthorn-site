// routes/(no-layout)/apply/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { applicationFormSchema } from "@/lib/schemas/application-form";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { ApplicationFormValues, StepType } from "@/types/application-step";
import { useEverthornMember } from "@/hooks/use-everthorn-member";
import { BASE_STEPS, FINAL_STEPS, getDynamicSteps } from "@/config/application-form-steps";
import { GenericStep } from "@/components/features/application-form/generic-step";
import { FormHeader } from "@/components/features/application-form/form-header";
import { FormFooter } from "@/components/features/application-form/form-footer";
import { motion, AnimatePresence } from "motion/react";
import useEmblaCarousel from 'embla-carousel-react';
import Fade from 'embla-carousel-fade';
import { hero_images } from "@/config/hero-images";
import webhook_content from "@/components/features/application-form/webhook_content.tsx";

export const Route = createFileRoute('/(no-layout)/apply/')({
    component: ApplicationForm,
});

function ApplicationForm() {
    const { data: session } = authClient.useSession();
    const { isMember } = useEverthornMember();
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [dynamicSteps, setDynamicSteps] = useState<StepType[]>([]);

    // Embla carousel for background
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, duration: 200 },
        [Fade()]
    );

    // Auto-play carousel
    useEffect(() => {
        if (!emblaApi) return;

        const intervalId = setInterval(() => {
            emblaApi.scrollNext();
        }, 15000);

        return () => clearInterval(intervalId);
    }, [emblaApi]);

    const form = useForm({
        defaultValues: {} as ApplicationFormValues,
        validationLogic: revalidateLogic({ mode: 'change' }),
        validators: {
            // @ts-ignore
            onDynamic: applicationFormSchema,
        },
        onSubmit: async ({ value }) => {
            value.username = session?.user.username ?? 'Unknown';
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'shortOffset',
            }).formatToParts(new Date());
            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            value.timezone = `${tz} (${offsetPart?.value ?? ''})`;

            if (isMember) {
                try {
                    await submitToDiscord(value);
                    setSubmitted(true);
                    await navigate({ to: '/apply/success' });
                } catch (error) {
                    console.error("Submission error:", error);
                    toast.error('There was an error submitting your application.', {
                        description: 'Please try again. If the issue persists, contact u/Skavandross on Reddit'
                    });
                }
            } else {
                toast.error('There was an error submitting your application.', {
                    description: 'You are already a member.'
                });
            }
        },
    });

    async function submitToDiscord(values: ApplicationFormValues) {
        if (import.meta.env.VITE_WEBHOOK_URL) {
            const response = await fetch(import.meta.env.VITE_WEBHOOK_URL, {
                method: "POST",
                body: webhook_content(values),
                headers: { 'Content-type': 'application/json' }
            });

            if (response.status === 204) {
                toast.success('Application Submitted!', {
                    description: 'Thanks for applying. Check your discord for a friend request soon :)'
                });
            } else {
                throw new Error(`Webhook error code ${response.status}`);
            }
        } else {
            throw new Error('Webhook not provided');
        }
    }

    // Update dynamic steps
    useEffect(() => {
        let previousPlaystyle = form.store.state.values.playstyle;
        let previousExperience = form.store.state.values.experience;

        return form.store.subscribe(() => {
            const currentPlaystyle = form.store.state.values.playstyle;
            const currentExperience = form.store.state.values.experience;

            if (currentPlaystyle !== previousPlaystyle || currentExperience !== previousExperience) {
                setDynamicSteps(getDynamicSteps(form.store.state.values));
                previousPlaystyle = currentPlaystyle;
                previousExperience = currentExperience;
            }
        });
    }, [form.store]);

    const allSteps = [...BASE_STEPS, ...dynamicSteps, ...FINAL_STEPS];

    const nextStep = async () => {
        const currentStepData = allSteps[currentStep];

        if (currentStepData.field && !currentStepData.optional) {
            await form.validateField(currentStepData.field as keyof ApplicationFormValues, 'submit');
            const fieldState = form.getFieldMeta(currentStepData.field as keyof ApplicationFormValues);

            if (fieldState?.errors && fieldState.errors.length > 0) {
                return;
            }
        }

        if (currentStep < allSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const progress = ((currentStep + 1) / allSteps.length) * 100;
    const currentStepData = allSteps[currentStep];
    const IconComponent = currentStepData.icon;

    return (
        <div className="min-h-screen w-screen relative overflow-hidden">
            {/* Background Carousel */}
            <div className="absolute inset-0 z-0">
                <div className="embla overflow-hidden h-full" ref={emblaRef}>
                    <div className="embla__container flex h-full">
                        {hero_images.map((image, index) => (
                            <div key={index} className="embla__slide flex-[0_0_100%] min-w-0 relative">
                                <img
                                    src={image.image}
                                    alt={image.name}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient overlay for better readability */}
                                <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-br from-background/90 via-background/85 to-background/90" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                    {/* Fixed Header */}
                    <div className="sticky top-0 z-20 bg-background/80 sm:bg-transparent border-b border-border/50 px-4 pt-4 pb-3">
                        <FormHeader
                            currentStep={currentStep}
                            totalSteps={allSteps.length}
                            progress={progress}
                        />
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto">
                        <div className="px-4 py-6">
                            <form
                                id="application-form"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    await form.handleSubmit();
                                }}
                            >
                                <Card className="relative backdrop-blur-xl bg-background/90 border-border/50 shadow-2xl">
                                    <CardHeader className="text-center pb-3 pt-4 px-4">
                                        <div className="flex justify-center mb-2">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ scale: 0.8, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                                className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/20"
                                            >
                                                <IconComponent className="w-5 h-5 text-primary-foreground" />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <CardTitle className="text-base font-bold mb-0.5">
                                                    {currentStepData.title}
                                                </CardTitle>
                                                <p className="text-xs text-muted-foreground">
                                                    {currentStepData.subtitle}
                                                </p>
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardHeader>

                                    <CardContent className="px-4 pb-4 pt-0">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={currentStep}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <GenericStep
                                                    step={currentStepData}
                                                    form={form}
                                                    session={session}
                                                    nextStep={nextStep}
                                                    submitted={submitted}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </CardContent>
                                </Card>
                            </form>
                        </div>
                    </div>

                    {/* Fixed Footer */}
                    <div className="sticky bottom-0 z-20 bg-background/80 sm:bg-transparent px-4 py-3">
                        <FormFooter
                            currentStep={currentStep}
                            totalSteps={allSteps.length}
                            canGoBack={currentStep > 0}
                            canGoForward={currentStep < allSteps.length - 1}
                            onBack={prevStep}
                            onNext={nextStep}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
