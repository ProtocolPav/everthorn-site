export interface EventData {
    slug: string;
    title: string;
    startTime: Date;
    endTime: Date;
    image: string;
    teaserImage?: string;
    description?: string;
    teaserText?: string;
    inWorld?: boolean;
    teams?: number;
    rewardTeaser?: string;
    hidden?: boolean;
    clickable?: boolean;

    // Detail page fields
    about: string[];
    extraInfo?: {
        title: string;
        content: string;
    }[];
    faq: {
        question: string;
        answer: string;
    }[];
    rewards: {
        title: string;
        items: string[];
        icon?: any;
        color?: string;
    }[];
    rules?: {
        allowed: string[];
        disallowed: string[];
    };
    customCards?: {
        sectionTitle: string;
        cards: {
            icon: any;
            title: string;
            subtitle?: string;
            description: string;
            color?: string;
        }[];
    };
    stats?: {
        icon: any;
        label: string;
        value: string;
        color?: string;
    }[];
    images?: {
        src: string;
        alt: string;
    }[];
}