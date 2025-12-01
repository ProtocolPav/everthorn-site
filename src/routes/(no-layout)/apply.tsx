import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {applicationFormSchema} from "@/lib/schemas/application-form.tsx";
import {revalidateLogic, useForm} from "@tanstack/react-form";
import {toast} from 'sonner';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {authClient} from "@/lib/auth-client.ts";
import {useEffect, useState} from "react";
import {ApplicationFormValues, StepType} from "@/types/application-step";
import {
    Building,
    ChevronLeft, ChevronRight,
    Clock,
    Compass,
    Gamepad2,
    Heart,
    HelpCircle,
    Send,
    Shield,
    User,
    Users,
    Wrench
} from "lucide-react";
import {useEverthornMember} from "@/hooks/use-everthorn-member.ts";
import {Button} from "@/components/ui/button.tsx";
import {WelcomeStep} from "@/components/features/application-form/welcome.tsx";
import {AgeStep} from "@/components/features/application-form/age.tsx";
import {ExperienceStep, LeadershipExperienceStep} from "@/components/features/application-form/experience.tsx";
import {
    BuildingExperienceStep,
    PlaystyleStep,
    RedstoneExperienceStep
} from "@/components/features/application-form/playstyle.tsx";
import {CommunityValuesStep} from "@/components/features/application-form/community-values.tsx";
import {ActivityStep} from "@/components/features/application-form/activity.tsx";
import {ConflictResolutionStep} from "@/components/features/application-form/conflict-resolution.tsx";
import {HeardFromStep} from "@/components/features/application-form/heard-from.tsx";
import {OtherStep} from "@/components/features/application-form/other.tsx";
import {SubmitStep} from "@/components/features/application-form/submit.tsx";

export const Route = createFileRoute('/(no-layout)/apply')({
  component: ApplicationForm,
})

function ApplicationForm() {
    const { data: session } = authClient.useSession()
    const { isMember } = useEverthornMember()
    const navigate = useNavigate()
    const [submitted, setSubmitted] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)
    const [dynamicSteps, setDynamicSteps] = useState<StepType[]>([])

    const form = useForm({
        defaultValues: {} as ApplicationFormValues,
        validationLogic: revalidateLogic({mode: 'change'}), // Enable dynamic validation
        validators: {
            onDynamic: applicationFormSchema,
        },
        onSubmit: async ({ value }) => {
            // Modify values before submission
            value.username = session?.user.username ?? 'Unknown';

            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                timeZoneName: 'shortOffset',
            }).formatToParts(new Date());

            const offsetPart = parts.find(part => part.type === 'timeZoneName');
            const offset = offsetPart?.value ?? '';

            value.timezone = `${tz} (${offset})`;

            if (!isMember) {
                try {
                    await submitToDiscord(value);
                    setSubmitted(true);
                    await navigate({to: '/apply/success'})
                } catch (error) {
                    console.error("Submission error:", error);
                    toast.error('There was an error submitting your application.', {
                        description: 'Please try again. If the issue persists, you can manually submit your application on Reddit to u/Skavandross'
                    });
                }
            } else {
                console.error("Already a member. Cannot submit");
                toast.error('There was an error submitting your application.', {
                    description: 'Please try again. If the issue persists, you can manually submit your application on Reddit to u/Skavandross'
                });
            }
        },
    })

    async function submitToDiscord(values: ApplicationFormValues) {
        if (import.meta.env.VITE_WEBHOOK_URL) {
            let response = await fetch(
                import.meta.env.VITE_WEBHOOK_URL, {
                    method: "POST",
                    body: webhook_content(values),
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
            )

            let status = response.status

            if (status === 204) {
                toast.success('Application Submitted!', {
                    description: 'Thanks for applying. Check your discord for a friend request soon :)'
                });
            } else {
                toast.error('Error Submitting Application', {
                    description: `Share this with a site administrator: ${status}`
                });
                throw new Error(`Webhook error code ${status}`)
            }
        } else {
            toast.error('Error Submitting Application', {
                description: `Share this with a site administrator: No_Webhook_URL`
            });
            throw new Error('Webhook not provided')
        }
    }

    // Base steps that are always shown
    const baseSteps = [
        {
            id: 'welcome',
            title: "Welcome to Everthorn! 👋",
            subtitle: "Let's start your adventure together",
            icon: User,
            component: WelcomeStep
        },
        {
            id: 'age',
            title: "First things first...",
            subtitle: "What's your age?",
            icon: User,
            component: AgeStep,
            field: 'age'
        },
        {
            id: 'experience',
            title: "Your Minecraft journey",
            subtitle: "How long have you been playing?",
            icon: Gamepad2,
            component: ExperienceStep,
            field: 'experience'
        },
        {
            id: 'playstyle',
            title: "Show us your style",
            subtitle: "What's your favorite way to play?",
            icon: Heart,
            component: PlaystyleStep,
            field: 'playstyle'
        }
    ]

    // Dynamic steps based on answers
    const getDynamicSteps = () => {
        const values = form.state.values
        const steps = []

        // Add building experience if they mentioned building
        if (values.playstyle?.toLowerCase().includes('build') ||
            values.playstyle?.toLowerCase().includes('castle') ||
            values.playstyle?.toLowerCase().includes('architect')) {
            steps.push({
                id: 'building_experience',
                title: "Tell us about your builds",
                subtitle: "What's your building experience?",
                icon: Building,
                component: BuildingExperienceStep,
                field: 'building_experience'
            })
        }

        // Add redstone experience if they mentioned redstone/technical
        if (values.playstyle?.toLowerCase().includes('redstone') ||
            values.playstyle?.toLowerCase().includes('red stone') ||
            values.playstyle?.toLowerCase().includes('technical') ||
            values.playstyle?.toLowerCase().includes('farm') ||
            values.playstyle?.toLowerCase().includes('contraption')) {
            steps.push({
                id: 'redstone_experience',
                title: "Redstone wizardry",
                subtitle: "Share your technical experience",
                icon: Wrench,
                component: RedstoneExperienceStep,
                field: 'redstone_experience'
            })
        }

        // Add leadership experience if they're experienced/veteran
        if (values.experience === 'experienced' || values.experience === 'veteran') {
            steps.push({
                id: 'leadership_experience',
                title: "Leadership & mentoring",
                subtitle: "Have you helped guide other players?",
                icon: Users,
                component: LeadershipExperienceStep,
                field: 'leadership_experience'
            })
        }

        return steps
    }

    // Update dynamic steps when form values change
    useEffect(() => {
        let previousPlaystyle = form.store.state.values.playstyle;
        let previousExperience = form.store.state.values.experience;

        return form.store.subscribe(() => {
            const currentPlaystyle = form.store.state.values.playstyle;
            const currentExperience = form.store.state.values.experience;

            if (currentPlaystyle !== previousPlaystyle ||
                currentExperience !== previousExperience) {
                const newDynamicSteps = getDynamicSteps();
                setDynamicSteps(newDynamicSteps);

                previousPlaystyle = currentPlaystyle;
                previousExperience = currentExperience;
            }
        });
    }, [form.store]);

    // Final steps that are always shown
    const finalSteps = [
        {
            id: 'community_values',
            title: "Community matters",
            subtitle: "What makes a great community?",
            icon: Users,
            component: CommunityValuesStep,
            field: 'community_values'
        },
        {
            id: 'activity',
            title: "Let's talk time",
            subtitle: "How often can you join us?",
            icon: Clock,
            component: ActivityStep,
            field: 'activity'
        },
        {
            id: 'conflict_resolution',
            title: "Maturity check",
            subtitle: "How do you handle disagreements?",
            icon: Shield,
            component: ConflictResolutionStep,
            field: 'conflict_resolution'
        },
        {
            id: 'heard_from',
            title: "How did we cross paths?",
            subtitle: "We'd love to know how you found us",
            icon: Compass,
            component: HeardFromStep,
            field: 'heard_from'
        },
        {
            id: 'other',
            title: "Anything we missed?",
            subtitle: "Tell us something fun we didn't think to ask!",
            icon: HelpCircle,
            component: OtherStep,
            field: 'other'
        },
        {
            id: 'submit',
            title: "You're all set! 🎉",
            subtitle: "Ready to join the Everthorn family?",
            icon: Send,
            component: SubmitStep
        }
    ]

    // Combine all steps
    const allSteps = [...baseSteps, ...dynamicSteps, ...finalSteps]

    const nextStep = async () => {
        const currentStepData = allSteps[currentStep];

        if (currentStepData.field) {
            // Get the field state to check if it's valid
            const fieldName = currentStepData.field as keyof ApplicationFormValues;

            // Validate the specific field
            await form.validateField(fieldName, 'submit');

            // Get the field state after validation
            const fieldState = form.getFieldMeta(fieldName);

            // Check if field has errors
            if (fieldState?.errors && fieldState.errors.length > 0) {
                return; // Don't proceed if invalid
            }
        }

        if (currentStep < allSteps.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentStep(currentStep + 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setIsAnimating(true)
            setTimeout(() => {
                setCurrentStep(currentStep - 1)
                setIsAnimating(false)
            }, 150)
        }
    }

    const progress = ((currentStep + 1) / allSteps.length) * 100
    const currentStepData = allSteps[currentStep]
    const StepComponent = currentStepData.component
    const IconComponent = currentStepData.icon

    return (
        <div className="h-dvh w-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-6 overflow-hidden">
            <div className="mx-auto max-w-2xl h-full flex flex-col">
                {/* Progress Section - Fixed at top */}
                <div className="mb-6 md:mb-8 flex-shrink-0">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-muted-foreground">
                            Step {currentStep + 1} of {allSteps.length}
                        </span>

                        {/* Progress motivation text */}
                        <div className="text-center">
                            <span className="text-xs text-muted-foreground">
                                {progress < 25 && "Just getting started! 🌱"}
                                {progress >= 25 && progress < 50 && "Making great progress! 🚀"}
                                {progress >= 50 && progress < 75 && "Almost halfway there! ⚡"}
                                {progress >= 75 && progress < 100 && "So close to the finish! 🎯"}
                                {progress >= 100 && "Application complete! 🎉"}
                            </span>
                        </div>
                    </div>

                    {/* Enhanced Progress Bar */}
                    <div className="relative">
                        {/* Background track */}
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden shadow-inner">
                            {/* Gradient progress fill */}
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Animated shine effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-pulse" />

                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-50 blur-sm" />
                            </div>
                        </div>

                        {/* Milestone markers positioned at actual milestones */}
                        <div className="absolute top-0 w-full h-3 flex items-center">
                            {allSteps.slice(0, -1).map((_, index) => {
                                const stepProgress = ((index + 1) / allSteps.length) * 100;
                                return (
                                    <div
                                        key={index}
                                        className={`absolute w-1 h-1 rounded-full transition-all duration-300 transform -translate-x-1/2 ${
                                            index < currentStep
                                                ? 'bg-white shadow-lg'
                                                : index === currentStep
                                                    ? 'bg-white/80 animate-pulse'
                                                    : 'bg-white/20'
                                        }`}
                                        style={{ left: `${stepProgress}%` }}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <form
                    id={'application-form'}
                    onSubmit={async (e) => {
                        e.preventDefault()
                        await form.handleSubmit()
                    }}
                    className="flex-1 flex flex-col pb-5"
                >
                    <div className="flex-1">
                        <Card className={`relative backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                            {/* Animated gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-animated rounded-lg pointer-events-none animate-vibrant-gradient" />

                            <CardHeader className="text-center pb-4 relative">
                                <div className="flex justify-center mb-4">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                                        <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl md:text-2xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                                    {currentStepData.title}
                                </CardTitle>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    {currentStepData.subtitle}
                                </p>
                            </CardHeader>
                            <CardContent className="pt-0 px-6 pb-6 relative">
                                <StepComponent
                                    form={form}
                                    session={session}
                                    nextStep={nextStep}
                                    submitted={submitted}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </form>

                {/* Navigation - Fixed at bottom */}
                <div className="flex justify-between items-center flex-shrink-0">
                    {/* Back Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="group flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-foreground transition-all duration-200 hover:bg-muted/50 disabled:opacity-30"
                    >
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-muted-foreground/10 transition-colors duration-200">
                            <ChevronLeft className="w-3 h-3" />
                        </div>
                        <span className="text-sm hidden sm:inline">Back</span>
                    </Button>

                    {/* Step indicator - scrollable on mobile */}
                    <div className="flex-1 mx-2 md:mx-4 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-x-auto py-2 justify-center">
                            {allSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0 ${
                                        index < currentStep
                                            ? 'bg-primary'
                                            : index === currentStep
                                                ? 'bg-primary/60 w-6'
                                                : 'bg-muted-foreground/20'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Next Button */}
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={nextStep}
                        className={`group flex items-center gap-2 px-3 py-2 text-foreground hover:text-primary transition-all duration-200 hover:bg-primary/5 ${
                            currentStep >= allSteps.length - 1 ? 'invisible' : ''
                        }`}
                    >
                        <span className="text-sm hidden sm:inline">Next</span>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                            <ChevronRight className="w-3 h-3" />
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    )
}
