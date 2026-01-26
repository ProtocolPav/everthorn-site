import {SeamlessSelectOption} from "@/components/ui/custom/seamless-select.tsx";
import {
    CheckCircleIcon,
    ClockCounterClockwiseIcon,
    HandWavingIcon,
    SealQuestionIcon,
} from "@phosphor-icons/react";

export const QUEST_TYPES: SeamlessSelectOption[] = [
    {
        value: 'minor',
        label: 'Minor Quest',
        icon: HandWavingIcon,
        triggerClassName: "bg-neutral-500/10 text-neutral-700 border-neutral-500/20 hover:bg-neutral-500/20 dark:text-neutral-300 dark:border-neutral-500/30",
        iconClassName: "text-neutral-600 dark:text-neutral-400"
    },
    {
        value: 'story',
        label: 'Story Quest',
        icon: CheckCircleIcon,
        triggerClassName: "bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/20 dark:text-violet-300 dark:border-violet-500/30",
        iconClassName: "text-violet-600 dark:text-violet-400"
    },
    {
        value: 'weekly',
        label: 'Weekly Quest',
        icon: SealQuestionIcon,
        triggerClassName: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
        iconClassName: "text-sky-600 dark:text-sky-400"
    },
    {
        value: 'side',
        label: 'Side Quest',
        icon: ClockCounterClockwiseIcon,
        triggerClassName: "bg-sky-500/10 text-sky-700 border-sky-500/20 hover:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30",
        iconClassName: "text-sky-600 dark:text-sky-400",
        disabled: true
    },
];
