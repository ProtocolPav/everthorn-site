import {
    Building,
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
import { ApplicationFormValues, StepType } from "@/types/application-step";

export const BASE_STEPS: StepType[] = [
    {
        id: 'welcome',
        title: "Welcome to Everthorn! 👋",
        subtitle: "Let's start your adventure together",
        icon: User,
        type: 'welcome'
    },
    {
        id: 'age',
        title: "First things first...",
        subtitle: "What's your age?",
        icon: User,
        field: 'age',
        type: 'number',
        placeholder: 'Enter your age',
        description: "We care about your privacy. This stays between you and our staff members"
    },
    {
        id: 'experience',
        title: "Your Minecraft journey",
        subtitle: "How long have you been playing?",
        icon: Gamepad2,
        field: 'experience',
        type: 'select',
        placeholder: 'How long have you been playing?',
        description: "Don't worry - we welcome players of all experience levels!",
        options: [
            { value: 'new_up_to_6_months', label: 'New to Minecraft (Less than 6 months)' },
            { value: 'beginner_up_to_12_months', label: 'Beginner (6 months - 1 year)' },
            { value: 'intermediate_up_to_3_years', label: 'Intermediate (1-3 years)' },
            { value: 'experienced_up_to_5_years', label: 'Experienced (3-5 years)' },
            { value: 'veteran_5+_years', label: 'Veteran (5+ years)' }
        ]
    },
    {
        id: 'playstyle',
        title: "Show us your style",
        subtitle: "What's your favorite way to play?",
        icon: Heart,
        field: 'playstyle',
        type: 'textarea',
        placeholder: "I love building medieval castles and exploring with friends! I'm also getting into redstone automation...",
        description: "Building? Exploring? Redstone? PvP? Tell us what you enjoy most!",
        minLength: 10
    }
];

export const DYNAMIC_STEP_CONFIG = [
    {
        id: 'building_experience',
        title: "Tell us about your builds",
        subtitle: "What's your building experience?",
        icon: Building,
        field: 'building_experience',
        type: 'textarea',
        placeholder: "I've built several medieval castles, modern skyscrapers, and I'm currently working on a massive city project...",
        description: "Tell us about your favorite builds, projects, or building styles!",
        minLength: 10,
        condition: (values: ApplicationFormValues) => {
            const playstyle = values.playstyle?.toLowerCase() || '';
            return playstyle.includes('build') ||
                playstyle.includes('castle') ||
                playstyle.includes('architect');
        }
    },
    {
        id: 'redstone_experience',
        title: "Redstone wizardry",
        subtitle: "Share your technical experience",
        icon: Wrench,
        field: 'redstone_experience',
        type: 'textarea',
        placeholder: "I've built automatic farms, complex sorting systems, and even a working calculator!...",
        description: "Share your coolest redstone creations or technical achievements!",
        minLength: 10,
        condition: (values: ApplicationFormValues) => {
            const playstyle = values.playstyle?.toLowerCase() || '';
            return playstyle.includes('redstone') ||
                playstyle.includes('red stone') ||
                playstyle.includes('technical') ||
                playstyle.includes('farm') ||
                playstyle.includes('contraption');
        }
    },
    {
        id: 'leadership_experience',
        title: "Leadership & mentoring",
        subtitle: "Have you helped guide other players?",
        icon: Users,
        field: 'leadership_experience',
        type: 'textarea',
        placeholder: "I love helping newer players get started! I've shown friends how to build cool redstone contraptions...",
        description: "Do you enjoy helping other players? Share any times you've lent a hand! 😊",
        minLength: 10,
        condition: (values: ApplicationFormValues) => {
            return values.experience === 'experienced_up_to_5_years' || values.experience === 'veteran_5+_years';
        }
    }
];

export const FINAL_STEPS: StepType[] = [
    {
        id: 'community_values',
        title: "Community matters",
        subtitle: "What makes a great community?",
        icon: Users,
        field: 'community_values',
        type: 'textarea',
        placeholder: "I value respect, collaboration, and helping newer players. I think a good community should be welcoming...",
        description: "What do you think makes a gaming community great?",
        minLength: 20
    },
    {
        id: 'activity',
        title: "Let's talk time",
        subtitle: "How often can you join us?",
        icon: Clock,
        field: 'activity',
        type: 'select',
        placeholder: 'Choose your activity level',
        description: "Be honest! We understand everyone has different schedules",
        options: [
            { value: 'daily', label: 'Daily (Most days of the week)' },
            { value: '3-4_times_per_week', label: 'Frequent (3-4 times per week)' },
            { value: '1-2_times_per_week', label: 'Regular (1-2 times per week)' },
            { value: 'few_times_per_week', label: 'Casual (Few times per month)' },
            { value: 'weekends', label: 'Weekends only' }
        ]
    },
    {
        id: 'conflict_resolution',
        title: "Maturity check",
        subtitle: "How do you handle disagreements?",
        icon: Shield,
        field: 'conflict_resolution',
        type: 'textarea',
        placeholder: "I try to listen to both sides, stay calm, and find a solution that works for everyone...",
        description: "How would you handle a disagreement with another player?",
        minLength: 15,
        maxLength: 400
    },
    {
        id: 'heard_from',
        title: "How did we cross paths?",
        subtitle: "We'd love to know how you found us",
        icon: Compass,
        field: 'heard_from',
        type: 'select',
        placeholder: 'How did you find us?',
        description: "Just curious how you discovered our little corner of the internet!",
        options: [
            { value: 'friends', label: 'My Friends' },
            { value: 'reddit', label: 'Reddit Advertisement' },
            { value: 'website', label: 'I found your website' },
            { value: 'youtube', label: 'YouTube' },
            { value: 'other', label: 'Other' }
        ],
        followUp: {
            field: 'heard_from_details',
            type: 'textarea',
            showWhen: ['friends', 'other'],
            placeholder: (value: string) => value === 'friends'
                ? "Which friend told you about us? We'd love to thank them!"
                : "Tell us more about how you found us!",
            description: (value: string) => value === 'friends'
                ? "We love hearing about our community spreading through friends!"
                : "We're always curious about new discovery paths!",
            maxLength: 200
        }
    },
    {
        id: 'other',
        title: "Anything we missed?",
        subtitle: "Tell us something fun we didn't think to ask!",
        icon: HelpCircle,
        field: 'other',
        type: 'textarea',
        placeholder: "I have a pet parrot that sometimes plays Minecraft with me, I'm learning to code...",
        description: "Any fun facts, special skills, hobbies, or random thoughts? This is totally optional!",
        maxLength: 900,
        optional: true
    },
    {
        id: 'submit',
        title: "You're all set! 🎉",
        subtitle: "Ready to join the Everthorn family?",
        icon: Send,
        type: 'submit'
    }
];

export function getDynamicSteps(values: ApplicationFormValues): StepType[] {
    return DYNAMIC_STEP_CONFIG
        .filter(step => step.condition?.(values))
        .map(({ condition, ...step }) => step as StepType);
}
