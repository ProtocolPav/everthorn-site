import { FormApi } from '@tanstack/react-form';
import React from 'react';
import {User} from "better-auth";

export interface ApplicationFormValues {
    username?: string;
    timezone?: string;
    age?: number;
    experience?: string;
    playstyle?: string;
    building_experience?: string;
    redstone_experience?: string;
    leadership_experience?: string;
    community_values?: string;
    activity?: string;
    conflict_resolution?: string;
    heard_from?: string;
    heard_from_details?: string;
    other?: string;
}

export type StepType = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    field?: keyof ApplicationFormValues;
    type?: 'welcome' | 'submit' | 'textarea' | 'number' | 'select';
    placeholder?: string;
    description?: string;
    options?: Array<{ value: string; label: string }>;
    minLength?: number;
    maxLength?: number;
    optional?: boolean;
    condition?: (values: ApplicationFormValues) => boolean;
    followUp?: {
        field: keyof ApplicationFormValues;
        type: 'textarea';
        showWhen?: string[];
        placeholder?: string | ((value: string) => string);
        description?: string | ((value: string) => string);
        maxLength?: number;
    };
};

export interface StepProps {
    form: FormApi<ApplicationFormValues>;
    nextStep: () => Promise<void>;
    onSubmit?: (values: ApplicationFormValues) => void;
    submitted?: boolean;
    session?: {user: User} | null;
}
