import type {ReactElement} from "react";
import type {AppForm} from "@/components/features/quests/quest-form.ts";

export type TargetType = "kill" | "mine" | "scriptevent";

export interface TargetComponentProps {
    form: AppForm;
    objectiveIndex: number;
    targetIndex: number;
    namePrefix: string;
}

export type TargetComponent = (props: TargetComponentProps) => ReactElement;

export interface TargetRegistryEntry {
    type: TargetType;
    component: TargetComponent;
    label: string;
}
