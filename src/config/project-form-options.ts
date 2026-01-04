// --- Configuration Options ---
import {SeamlessSelectOption} from "@/components/ui/custom/seamless-select.tsx";
import {
    CheckCircleIcon,
    ClockCounterClockwiseIcon, FireIcon,
    GlobeHemisphereWestIcon,
    HandWavingIcon,
    SealQuestionIcon,
    SpiralIcon
} from "@phosphor-icons/react";

export const STATUS_OPTIONS: SeamlessSelectOption[] = [
    {
        value: 'ongoing',
        label: 'In Progress',
        icon: ClockCounterClockwiseIcon,
        triggerClassName: "bg-pink-500/10 text-pink-700 border-pink-500/20 hover:bg-pink-500/20",
        iconClassName: "text-pink-600 animate-spin-slow"
    },
    {
        value: 'completed',
        label: 'Completed',
        icon: CheckCircleIcon,
        triggerClassName: "bg-orange-500/10 text-orange-700 border-orange-500/20 hover:bg-orange-500/20",
        iconClassName: "text-orange-600"
    },
    {
        value: 'abandoned',
        label: 'Available',
        icon: HandWavingIcon,
        triggerClassName: "bg-cyan-500/10 text-cyan-700 border-cyan-500/20 hover:bg-cyan-500/20",
        iconClassName: "text-cyan-500"
    },
    {
        value: 'pending',
        label: 'Pending Approval',
        icon: SealQuestionIcon,
        triggerClassName: "bg-blue-500/10 text-blue-700 border-blue-500/20 hover:bg-blue-500/20",
        iconClassName: "text-blue-600"
    }
];

// --- Dimension Options ---
export const DIMENSION_OPTIONS: SeamlessSelectOption[] = [
    {
        value: 'minecraft:overworld',
        label: 'Overworld',
        icon: GlobeHemisphereWestIcon,
        triggerClassName: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30",
        iconClassName: "text-emerald-600/80 dark:text-emerald-400/80"
    },
    {
        value: 'minecraft:nether',
        label: 'Nether',
        icon: FireIcon,
        triggerClassName: "bg-orange-600/10 text-orange-700 border-orange-600/20 hover:bg-orange-600/15 dark:text-orange-400 dark:border-orange-500/30",
        iconClassName: "text-orange-600/80 dark:text-orange-400/80"
    },
    {
        value: 'minecraft:the_end',
        label: 'The End',
        icon: SpiralIcon,
        triggerClassName: "bg-violet-500/10 text-violet-700 border-violet-500/20 hover:bg-violet-500/15 dark:text-violet-400 dark:border-violet-500/30",
        iconClassName: "text-violet-600/80 dark:text-violet-400/80"
    }
];