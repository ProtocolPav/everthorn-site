import React from "react";
import {FormApi} from "@tanstack/form-core";
import {applicationFormSchema} from "@/lib/schemas/application-form.tsx";
import {z} from "zod";
import { User } from "better-auth";

type ApplicationFormValues = z.infer<typeof applicationFormSchema>

type StepType = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any>;
    field?: string;
};

interface StepProps {
    form: FormApi<ApplicationFormValues>;
    nextStep: () => Promise<void>;
    onSubmit?: (values: any) => void;
    submitted?: boolean;
    session: {user: User} | null;
}